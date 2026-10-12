export type ProductCategory = 
  | 'Royal Thobes' 
  | 'Haute Couture Abayas' 
  | 'Embroidered Bishts' 
  | 'Silk Caftans' 
  | 'Velvet Evening Wear'
  | 'Fragrances & Accessories';

export interface Product {
  id: string;
  slug: string;
  name: string;
  arabicName: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  collection: 'Royal Heritage' | 'Desert Noir' | 'Velvet Mirage' | 'Golden Oasis';
  price: number; // in INR
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  sizes: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  fabric: string;
  care: string[];
  details: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isExclusive?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 
  | 'confirmed' 
  | 'tailoring' 
  | 'dispatched' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  arabicName?: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ALF-2026-8910
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  giftNote?: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: ShippingAddress[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  description: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'order_confirmed' | 'order_dispatched' | 'welcome';
  orderNumber?: string;
  htmlPreview: string;
  sentAt: string;
}
