import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Product, Order, User, Review, Coupon, EmailNotification } from '@/types';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  users: (User & { passwordHash: string })[];
  reviews: Review[];
  coupons: Coupon[];
  emailNotifications: EmailNotification[];
  settings: {
    codEnabled: boolean;
    codFee: number;
    freeShippingThreshold: number;
    standardShippingFee: number;
    expressWhiteGloveFee: number;
    currency: string;
    razorpayKeyId: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial seed products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'imperial-gold-kasab-royal-bisht',
    name: 'Imperial Gold Kasab Royal Bisht',
    arabicName: 'بشت ملكي مطرز بالقصب الذهبي',
    subtitle: 'Woven from superfine pure camel wool with 24k Japanese gold zaree embroidery.',
    description: 'The pinnacle of Arabian ceremonial dignity. Hand-tailored in our Dubai atelier over 90 meticulous hours, this bisht features artisanal Kasab embroidery along the neckline, lapels, and cuffs, using genuine gold-plated threads. Drapes with an imposing yet effortless regal posture.',
    category: 'Embroidered Bishts',
    collection: 'Royal Heritage',
    price: 48500,
    compareAtPrice: 58000,
    stock: 7,
    sku: 'ALF-BST-001',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['56 (Regular)', '58 (Tall)', '60 (Grand Tall)', 'Bespoke Made-to-Measure'],
    colors: [
      { name: 'Obsidian Black & Gold', hex: '#0B0B0B' },
      { name: 'Desert Sand & Gold', hex: '#D2B48C' },
      { name: 'Imperial Emerald & Gold', hex: '#0E3A2F' }
    ],
    fabric: '100% Superfine Merino Wool & Fine Camel Hair Blend with French Silk Lacing',
    care: ['Strictly professional dry clean only', 'Store in complimentary cedar garment bag with velvet hanger', 'Steam press on low silk temperature'],
    details: [
      'Handcrafted Kasab gold embroidery by master artisans',
      'Double-ply reinforced gold tassels (Hael)',
      'Custom monograms available upon request',
      'Includes numbered AL FAHA Atelier Certificate of Authenticity'
    ],
    isFeatured: true,
    isNew: false,
    isExclusive: true,
    rating: 4.95,
    reviewsCount: 38,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'prod_2',
    slug: 'noir-etoile-silk-organza-haute-abaya',
    name: 'Noir Étoile Silk Organza Haute Abaya',
    arabicName: 'عباية الهوت كوتور الأورجانزا السوداء',
    subtitle: 'Layered Italian silk organza with hand-sewn Swarovski jet crystal embellishments.',
    description: 'An evocative dialogue between contemporary Milanese haute couture and Arabian modesty. The Noir Étoile Abaya flows with ethereal layers of sheer and opaque pure silk organza, subtle batwing sleeves, and hand-applied jet crystals that shimmer like desert constellations.',
    category: 'Haute Couture Abayas',
    collection: 'Desert Noir',
    price: 34900,
    compareAtPrice: 42000,
    stock: 12,
    sku: 'ALF-ABY-002',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['52 (Petite)', '54 (Standard)', '56 (Medium)', '58 (Long)', '60 (Tall)'],
    colors: [
      { name: 'Midnight Onyx', hex: '#0D0D0D' },
      { name: 'Ivory Moonbeam', hex: '#FDFBF7' },
      { name: 'Smoky Charcoal', hex: '#262626' }
    ],
    fabric: '100% Pure Mulberry Silk Crepe with Silk Organza Overlay',
    care: ['Gentle dry clean only', 'Keep away from sharp jewelry surfaces', 'Store hanging in breathable garment bag'],
    details: [
      'Includes matching silk chiffon Sheila (scarf)',
      'Concealed French snap buttons down front',
      'Swarovski crystal micro-facets on cuffs and neckline',
      'Featherweight breathability tailored for warm climates'
    ],
    isFeatured: true,
    isNew: true,
    isExclusive: true,
    rating: 4.9,
    reviewsCount: 52,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'prod_3',
    slug: 'qatari-giza-cotton-royal-thobe',
    name: 'Al-Sultan Qatari Giza Cotton Thobe',
    arabicName: 'ثوب السلطان القطري من قطن الجيزة',
    subtitle: 'Woven from 200s 2-ply Egyptian Giza cotton with structured stiffened royal collar.',
    description: 'Precision-tailored to perfection. Embodying the regal simplicity favored by Gulf royalty, this thobe features an immaculate silhouette, mother-of-pearl buttons, and crisp structured collar and cuffs engineered to maintain razor-sharp form all day.',
    category: 'Royal Thobes',
    collection: 'Royal Heritage',
    price: 18500,
    compareAtPrice: 22000,
    stock: 24,
    sku: 'ALF-THB-003',
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['54 (S)', '56 (M)', '58 (L)', '60 (XL)', '62 (XXL)'],
    colors: [
      { name: 'Crisp Royal Ivory', hex: '#FDFBF7' },
      { name: 'Sand Pearl Cream', hex: '#F5EFEB' },
      { name: 'Desert Platinum Gray', hex: '#D6D6D6' }
    ],
    fabric: 'Extra-Long Staple 100% Egyptian Giza 200/2 Cotton (Made in Italy)',
    care: ['Gentle warm machine wash or luxury laundry', 'Hot steam press with starch for signature crispness', 'Do not tumble dry'],
    details: [
      'Natural Australian mother-of-pearl hidden buttons',
      'Double chest pen pocket & deep smartphone holster pocket',
      'Reinforced internal canvas collar interfacing',
      'Wrinkle-resistant silky handfeel'
    ],
    isFeatured: true,
    isNew: true,
    isExclusive: false,
    rating: 4.88,
    reviewsCount: 74,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'prod_4',
    slug: 'andalusian-emerald-silk-jacquard-caftan',
    name: 'Andalusian Emerald Silk Jacquard Caftan',
    arabicName: 'قفطان أندلسي من حرير الجاكار الزمردي',
    subtitle: 'Heavyweight silk jacquard adorned with Moroccan Sfifa braiding and aker buttons.',
    description: 'Inspired by the historic palatial grandeur of the Alhambra and Fez royal courts. Crafted from custom-milled emerald green silk jacquard, detailed with shimmering metallic gold Sfifa trim, handmade braided silk Aakad buttons, and an ornate matching metallic belt.',
    category: 'Silk Caftans',
    collection: 'Golden Oasis',
    price: 39500,
    compareAtPrice: 47000,
    stock: 9,
    sku: 'ALF-CFT-004',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['XS (34)', 'S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: [
      { name: 'Imperial Emerald & Gold', hex: '#0C2E24' },
      { name: 'Royal Ruby & Gold', hex: '#630D19' },
      { name: 'Midnight Sapphire & Gold', hex: '#0D2149' }
    ],
    fabric: 'Heavyweight 100% Mulberry Silk Damask Jacquard',
    care: ['Professional dry clean only', 'Keep belt in dry cotton pouch', 'Iron inside-out on low silk setting'],
    details: [
      'Includes detachable handcrafted adjustable gold ceremonial belt (Mdamma)',
      '140 hand-knotted silk buttons along central placket',
      'Fully lined in pure lightweight habotai silk',
      'Floor-sweeping regal silhouette'
    ],
    isFeatured: true,
    isNew: false,
    isExclusive: true,
    rating: 4.96,
    reviewsCount: 29,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 'prod_5',
    slug: 'burgundy-velvet-gold-embroidered-robe',
    name: 'Sultana Burgundy Velvet Evening Robe',
    arabicName: 'رداء سهرة مخملي بورجوندي مطرز',
    subtitle: 'Plush Lyon silk velvet with hand-embroidered floral gold zardozi motifs.',
    description: 'An arresting statement piece for private soirees and royal galas. Sumptuous French silk velvet in deep vintage burgundy, trimmed with sculpted gold bullion embroidery along the shawl lapel and cuffs. Flows with sublime weight and dramatic drape.',
    category: 'Velvet Evening Wear',
    collection: 'Velvet Mirage',
    price: 42000,
    compareAtPrice: 50000,
    stock: 5,
    sku: 'ALF-VLV-005',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'Bespoke Custom'],
    colors: [
      { name: 'Burgundy Crimson', hex: '#5B1425' },
      { name: 'Royal Obsidian Black', hex: '#111111' },
      { name: 'Deep Royal Navy', hex: '#121F3D' }
    ],
    fabric: '100% Silk Plush Velvet with 24k Gold Thread Zardozi Detailing',
    care: ['Specialist dry clean only', 'Do not iron directly; steam from reverse distance only', 'Store hung in breathable garment bag'],
    details: [
      'Sculpted 3D gold metal thread embroidery (Zardozi)',
      'Pure silk satin lining in antique champagne',
      'Deep tailored side welt pockets',
      'Hand-stitched velvet sash belt included'
    ],
    isFeatured: false,
    isNew: true,
    isExclusive: true,
    rating: 4.92,
    reviewsCount: 19,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'prod_6',
    slug: 'royal-cambodi-dehn-al-oud-extrait',
    name: 'Crown Reserve Dehn Al Oud Cambodi Extrait 100ml',
    arabicName: 'دهن عود كمبودي معتق - الاحتياطي الملكي',
    subtitle: 'Distilled from 45-year aged wild Cambodi agarwood trees, macerated in pure sandalwood.',
    description: 'The aromatic signature of AL FAHA royalty. Rare wild Cambodian agarwood oil aged for 45 years in dark crystal carboys, opening with warm smoky leather, honeyed dried plums, animalic woods, and a transcendent golden amber dry-down that lingers for over 36 hours.',
    category: 'Fragrances & Accessories',
    collection: 'Royal Heritage',
    price: 24500,
    compareAtPrice: 29000,
    stock: 18,
    sku: 'ALF-FRG-006',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['50ml Extrait', '100ml Flacon Flambeau'],
    colors: [
      { name: 'Crystal Gold Flacon', hex: '#D4AF37' }
    ],
    fabric: 'Pure Perfume Oil (Extrait de Parfum 40% Concentration)',
    care: ['Keep away from direct sunlight and heat', 'Store in velvet presentation chest', 'Dab gently on pulse points'],
    details: [
      'Distilled from ethically harvested 45-year wild agarwood',
      'Handcrafted crystal flacon with 24k gold leaf stopper',
      'Housed in hand-carved polished black walnut keepsake chest',
      'Batch numbered: Only 250 flacons released worldwide annually'
    ],
    isFeatured: true,
    isNew: false,
    isExclusive: true,
    rating: 5.0,
    reviewsCount: 46,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'prod_7',
    slug: 'falcons-crest-24k-gold-cufflinks',
    name: 'Falcon’s Crest 24K Gold Plated Cufflinks',
    arabicName: 'أزرار أكمام مطلية بالذهب عيار ٢٤ قيراط بشعار الصقر',
    subtitle: 'Cast in solid jeweler’s bronze and heavily plated in 24k yellow gold with black onyx inlay.',
    description: 'The quintessential sartorial finishing touch for the distinguished gentleman. Emblazoned with the noble Arabian Falcon crest against hand-cut natural black onyx stone, bordered by fine guilloché diamond milling.',
    category: 'Fragrances & Accessories',
    collection: 'Desert Noir',
    price: 12500,
    compareAtPrice: 15000,
    stock: 20,
    sku: 'ALF-ACC-007',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['One Size (18mm)'],
    colors: [
      { name: '24k Gold & Natural Onyx', hex: '#D4AF37' },
      { name: 'Platinum & Emerald Jade', hex: '#E5E4E2' }
    ],
    fabric: 'Solid Jeweler Bronze with 5-Micron 24k Gold Electroplating & Natural Black Onyx',
    care: ['Buff with complimentary microfiber jewelry cloth', 'Avoid exposure to perfumes and water', 'Store in velvet presentation pouch'],
    details: [
      'Heavyweight whale-back closure with AL FAHA hallmark engraving',
      'Natural hand-cut and polished gemstone inserts',
      'Presented in a leather travel box with gold embossed seal',
      'Lifetime guarantee against tarnishing'
    ],
    isFeatured: false,
    isNew: false,
    isExclusive: false,
    rating: 4.85,
    reviewsCount: 22,
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString()
  },
  {
    id: 'prod_8',
    slug: 'sahara-dune-silk-chiffon-farasha-abaya',
    name: 'Sahara Dune Silk Chiffon Farasha Abaya',
    arabicName: 'عباية فراشة من شيفون الحرير بلون رمال الصحراء',
    subtitle: 'Dramatic billowing Farasha cut in sand ivory chiffon with gold lurex filament stripes.',
    description: 'A masterclass in majestic movement. This Farasha abaya catches every desert breeze with its expansive, sweeping cut. Delicate woven gold lurex stripes catch natural sunlight, creating a golden halo effect around the wearer.',
    category: 'Haute Couture Abayas',
    collection: 'Golden Oasis',
    price: 29500,
    compareAtPrice: 35000,
    stock: 14,
    sku: 'ALF-ABY-008',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop'
    ],
    sizes: ['54 (Free Fit)', '56 (Free Fit)', '58 (Free Fit)'],
    colors: [
      { name: 'Dune Sand & Gold', hex: '#EAE0D5' },
      { name: 'Oasis Ivory', hex: '#FDFBF7' },
      { name: 'Desert Night Black', hex: '#141414' }
    ],
    fabric: '100% High-Twist Silk Chiffon with Metallic Gold Lurex Weft',
    care: ['Gentle dry clean only', 'Steam gently from 6 inches distance'],
    details: [
      'Dramatic 180-degree winged butterfly drape',
      'Comes with matching opaque slip dress in breathable jersey',
      'Matching silk chiffon scarf with gold beaded hemline',
      'Lightweight and fluid'
    ],
    isFeatured: false,
    isNew: true,
    isExclusive: false,
    rating: 4.93,
    reviewsCount: 31,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

// Initial coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ROYAL10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 5000,
    maxDiscount: 10000,
    expiresAt: '2028-12-31T23:59:59Z',
    description: '10% off for prestigious AL FAHA patrons'
  },
  {
    code: 'ALFAHA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 25000,
    maxDiscount: 20000,
    expiresAt: '2028-12-31T23:59:59Z',
    description: '20% off on private couture orders above ₹25,000'
  },
  {
    code: 'WELCOME500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 3000,
    expiresAt: '2028-12-31T23:59:59Z',
    description: '₹500 welcome credit on your first atelier order'
  }
];

// Initial mock orders to verify tracking & admin order management immediately
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'ALF-2026-7842',
    userId: 'user_customer_1',
    customerName: 'Sheikh Tariq Al-Mansoor',
    customerEmail: 'tariq@alfaha.com',
    customerPhone: '+91 98201 54321',
    shippingAddress: {
      fullName: 'Sheikh Tariq Al-Mansoor',
      email: 'tariq@alfaha.com',
      phone: '+91 98201 54321',
      addressLine1: 'Villa 14, Royal Palm Residences',
      addressLine2: 'Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      country: 'India'
    },
    items: [
      {
        productId: 'prod_1',
        productName: 'Imperial Gold Kasab Royal Bisht',
        arabicName: 'بشت ملكي مطرز بالقصب الذهبي',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
        size: '58 (Tall)',
        color: 'Obsidian Black & Gold',
        price: 48500,
        quantity: 1,
        total: 48500
      },
      {
        productId: 'prod_6',
        productName: 'Crown Reserve Dehn Al Oud Cambodi Extrait 100ml',
        arabicName: 'دهن عود كمبودي معتق',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
        size: '100ml Flacon Flambeau',
        color: 'Crystal Gold Flacon',
        price: 24500,
        quantity: 1,
        total: 24500
      }
    ],
    subtotal: 73000,
    shippingFee: 0,
    discount: 7300,
    couponCode: 'ROYAL10',
    total: 65700,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_test_901824',
    razorpayPaymentId: 'pay_test_892711',
    orderStatus: 'tailoring',
    trackingNumber: 'BLUEDART-ROYAL-78912',
    courierName: 'Blue Dart Apex White Glove',
    estimatedDelivery: '18 October 2026',
    giftNote: 'Please engrave the presentation wooden chest with AL FAHA Royal Emblem.',
    timeline: [
      {
        status: 'confirmed',
        title: 'Order Confirmed & Payment Verified',
        description: 'Payment of ₹65,700 verified via Razorpay Secured Checkout.',
        timestamp: '11 Oct 2026, 14:30 IST'
      },
      {
        status: 'tailoring',
        title: 'Master Atelier Crafting & Hand-Embroidery',
        description: 'Our senior tailors are executing bespoke edge embroidery and double inspection.',
        timestamp: '12 Oct 2026, 09:15 IST'
      }
    ],
    createdAt: '2026-10-11T09:00:00.000Z',
    updatedAt: '2026-10-12T03:45:00.000Z'
  },
  {
    id: 'ord_102',
    orderNumber: 'ALF-2026-8910',
    userId: 'user_customer_2',
    customerName: 'Fatima Al-Sayed',
    customerEmail: 'fatima.couture@example.com',
    customerPhone: '+91 99887 65432',
    shippingAddress: {
      fullName: 'Fatima Al-Sayed',
      email: 'fatima.couture@example.com',
      phone: '+91 99887 65432',
      addressLine1: 'Penthouse 22B, Oberoi Sky Heights',
      addressLine2: 'Juhu Tara Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400049',
      country: 'India'
    },
    items: [
      {
        productId: 'prod_2',
        productName: 'Noir Étoile Silk Organza Haute Abaya',
        arabicName: 'عباية الهوت كوتور الأورجانزا السوداء',
        image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=600&auto=format&fit=crop',
        size: '56 (Medium)',
        color: 'Midnight Onyx',
        price: 34900,
        quantity: 1,
        total: 34900
      }
    ],
    subtotal: 34900,
    shippingFee: 0,
    discount: 0,
    total: 34900,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'dispatched',
    trackingNumber: 'DELHIVERY-PRIME-44102',
    courierName: 'Delhivery Sovereign Royal',
    estimatedDelivery: '15 October 2026',
    timeline: [
      {
        status: 'confirmed',
        title: 'Order Placed (Cash on Delivery)',
        description: 'Order confirmed with recipient verification phone confirmation.',
        timestamp: '10 Oct 2026, 11:20 IST'
      },
      {
        status: 'tailoring',
        title: 'Hand-Finished & Packaged in Royal Black Box',
        description: 'Placed inside velvet scented sleeve with silk ribbon seal.',
        timestamp: '11 Oct 2026, 16:00 IST'
      },
      {
        status: 'dispatched',
        title: 'Handed Over to Sovereign Royal Courier',
        description: 'In transit to Mumbai delivery hub under tracking DELHIVERY-PRIME-44102.',
        timestamp: '12 Oct 2026, 08:30 IST'
      }
    ],
    createdAt: '2026-10-10T05:50:00.000Z',
    updatedAt: '2026-10-12T03:00:00.000Z'
  }
];

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const customerPasswordHash = bcrypt.hashSync('customer123', 10);

    const initialDb: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      users: [
        {
          id: 'user_admin',
          name: 'Amir Al-Mansoor (Admin)',
          email: 'admin@alfaha.com',
          role: 'admin',
          phone: '+91 90000 11111',
          passwordHash: adminPasswordHash,
          createdAt: new Date().toISOString()
        },
        {
          id: 'user_customer_1',
          name: 'Sheikh Tariq Al-Mansoor',
          email: 'tariq@alfaha.com',
          role: 'customer',
          phone: '+91 98201 54321',
          passwordHash: customerPasswordHash,
          addresses: [
            {
              fullName: 'Sheikh Tariq Al-Mansoor',
              email: 'tariq@alfaha.com',
              phone: '+91 98201 54321',
              addressLine1: 'Villa 14, Royal Palm Residences',
              addressLine2: 'Altamount Road, Cumballa Hill',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400026',
              country: 'India'
            }
          ],
          createdAt: new Date().toISOString()
        }
      ],
      reviews: [
        {
          id: 'rev_1',
          productId: 'prod_1',
          userName: 'H.E. Tariq Al-Falasi',
          userEmail: 'tariq.f@example.com',
          rating: 5,
          title: 'Unsurpassed craftsmanship and drape',
          comment: 'The 24k Japanese Kasab gold work is peerless. I wore this to the National Gala and received numerous compliments on its regal cut. Packaging in the wooden chest is world-class.',
          verified: true,
          createdAt: '2026-09-28T10:00:00.000Z'
        },
        {
          id: 'rev_2',
          productId: 'prod_2',
          userName: 'Princess Salma',
          userEmail: 'salma.k@example.com',
          rating: 5,
          title: 'Sheer perfection for private galas',
          comment: 'The way the silk organza catches the light is hypnotic. Truly haute couture grade. Customer concierge service was delightfully swift.',
          verified: true,
          createdAt: '2026-10-02T12:30:00.000Z'
        }
      ],
      coupons: INITIAL_COUPONS,
      emailNotifications: [
        {
          id: 'email_1',
          recipientEmail: 'tariq@alfaha.com',
          recipientName: 'Sheikh Tariq Al-Mansoor',
          subject: 'AL FAHA: Order Confirmed #ALF-2026-7842',
          type: 'order_confirmed',
          orderNumber: 'ALF-2026-7842',
          htmlPreview: '<h1>Welcome to the Atelier</h1><p>Your order #ALF-2026-7842 has been received and our master artisans have initiated crafting.</p>',
          sentAt: '2026-10-11T14:30:05.000Z'
        }
      ],
      settings: {
        codEnabled: true,
        codFee: 0,
        freeShippingThreshold: 10000,
        standardShippingFee: 250,
        expressWhiteGloveFee: 750,
        currency: 'INR',
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_ALFAHA_LUXURY'
      }
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading DB file, recreating default:', err);
    return ensureDbFile();
  }
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to DB file:', err);
  }
}

// Database helper export methods
export const db = {
  getProducts(): Product[] {
    const data = ensureDbFile();
    return data.products;
  },

  getProductBySlug(slug: string): Product | undefined {
    const data = ensureDbFile();
    return data.products.find(p => p.slug === slug || p.id === slug);
  },

  getProductById(id: string): Product | undefined {
    const data = ensureDbFile();
    return data.products.find(p => p.id === id);
  },

  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const data = ensureDbFile();
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    data.products.unshift(newProduct);
    saveDb(data);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const data = ensureDbFile();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    data.products[index] = { ...data.products[index], ...updates };
    saveDb(data);
    return data.products[index];
  },

  deleteProduct(id: string): boolean {
    const data = ensureDbFile();
    const lenBefore = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    saveDb(data);
    return data.products.length < lenBefore;
  },

  getOrders(): Order[] {
    const data = ensureDbFile();
    return data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrderById(id: string): Order | undefined {
    const data = ensureDbFile();
    return data.orders.find(o => o.id === id || o.orderNumber === id);
  },

  getOrdersByUserId(userId: string): Order[] {
    const data = ensureDbFile();
    return data.orders.filter(o => o.userId === userId);
  },

  getOrdersByEmail(email: string): Order[] {
    const data = ensureDbFile();
    const norm = email.trim().toLowerCase();
    return data.orders.filter(o => o.customerEmail.toLowerCase() === norm);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'> & { timeline?: Order['timeline'] }): Order {
    const data = ensureDbFile();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ALF-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      timeline: orderData.timeline || [
        {
          status: 'confirmed',
          title: orderData.paymentMethod === 'cod' ? 'Order Confirmed (Cash on Delivery)' : 'Payment Verified & Order Confirmed',
          description: orderData.paymentMethod === 'cod' 
            ? 'Bespoke order accepted. Payable via Cash or UPI at doorstep upon royal delivery.'
            : 'Secured via Razorpay. Order transferred to the AL FAHA Atelier.',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    // Deduct stock for ordered products
    for (const item of newOrder.items) {
      const prodIndex = data.products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1 && data.products[prodIndex].stock > 0) {
        data.products[prodIndex].stock = Math.max(0, data.products[prodIndex].stock - item.quantity);
      }
    }

    data.orders.unshift(newOrder);
    saveDb(data);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus'], details?: { trackingNumber?: string; courierName?: string; note?: string }): Order | null {
    const data = ensureDbFile();
    const index = data.orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    const currentOrder = data.orders[index];
    currentOrder.orderStatus = status;
    currentOrder.updatedAt = new Date().toISOString();

    if (details?.trackingNumber) currentOrder.trackingNumber = details.trackingNumber;
    if (details?.courierName) currentOrder.courierName = details.courierName;

    const titles: Record<Order['orderStatus'], string> = {
      confirmed: 'Order Confirmed & Atelier Queued',
      tailoring: 'Master Tailoring & Quality Inspection',
      dispatched: 'Dispatched with Sovereign Courier',
      out_for_delivery: 'Out for White Glove Delivery',
      delivered: 'Delivered in Person to Patron',
      cancelled: 'Order Cancelled'
    };

    const descriptions: Record<Order['orderStatus'], string> = {
      confirmed: 'Order and sizing verification completed.',
      tailoring: 'Garment is currently in bespoke tailoring and hand-finishing at our atelier.',
      dispatched: `Package dispatched via ${currentOrder.courierName || 'Royal Express'}. Tracking: ${currentOrder.trackingNumber || 'Available shortly'}.`,
      out_for_delivery: 'Our white-glove courier is in transit to your residence today.',
      delivered: 'Package hand-delivered in signature wooden keepsake chest.',
      cancelled: details?.note || 'Order has been cancelled upon request.'
    };

    currentOrder.timeline.push({
      status,
      title: titles[status],
      description: descriptions[status],
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
    });

    saveDb(data);
    return currentOrder;
  },

  getUsers(): User[] {
    const data = ensureDbFile();
    return data.users.map(({ passwordHash, ...user }) => user);
  },

  getUserByEmailWithPassword(email: string) {
    const data = ensureDbFile();
    return data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  createUser(userData: { name: string; email: string; password: string; role?: 'customer' | 'admin'; phone?: string }): User {
    const data = ensureDbFile();
    const existing = data.users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = bcrypt.hashSync(userData.password, 10);
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      role: userData.role || 'customer',
      phone: userData.phone,
      passwordHash,
      addresses: [],
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    saveDb(data);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  getCoupons(): Coupon[] {
    const data = ensureDbFile();
    return data.coupons;
  },

  getCouponByCode(code: string): Coupon | undefined {
    const data = ensureDbFile();
    return data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  },

  addEmailNotification(notification: Omit<EmailNotification, 'id' | 'sentAt'>): EmailNotification {
    const data = ensureDbFile();
    const newNotification: EmailNotification = {
      ...notification,
      id: `email_${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    data.emailNotifications.unshift(newNotification);
    saveDb(data);
    return newNotification;
  },

  getEmailNotifications(): EmailNotification[] {
    const data = ensureDbFile();
    return data.emailNotifications;
  },

  getSettings() {
    const data = ensureDbFile();
    return data.settings;
  },

  updateSettings(settings: Partial<DatabaseSchema['settings']>) {
    const data = ensureDbFile();
    data.settings = { ...data.settings, ...settings };
    saveDb(data);
    return data.settings;
  }
};
