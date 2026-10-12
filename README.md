# AL FAHA (الفحة) &bull; Haute Couture Arabia

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-D4AF37?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Secured-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-Proprietary-D4AF37?style=for-the-badge)]()

**AL FAHA** is a premium, fully responsive luxury clothing e-commerce platform embodying timeless Arabian grandeur, bespoke craftsmanship, and contemporary haute couture aesthetics.

---

## ⚜️ Brand Identity & Aesthetics

- **Color Palette**:
  - **Obsidian Black** (`#080808`, `#121212`)
  - **Metallic Gold** (`#D4AF37`, `#C5A059`, `#F2DC8B`)
  - **Ivory Cream** (`#FDFBF7`, `#F7F3E9`)
  - **Imperial Emerald** (`#0C2E24`)
- **Distinctive Royal Emblem & Wordmark**:
  - Vector SVG royal cipher combining an 8-pointed star, calligraphic **AF** monogram, and regal crescent finial.
  - Serif typography inspired by *Cinzel* & *Amiri* calligraphy paired with modern *Plus Jakarta Sans*.
- **Editorial High-Fashion Photography**: Curated high-resolution imagery showcasing royal thobes, haute abayas, 24k Kasab bullion bishts, and aged Cambodi agarwood perfumes.

---

## ✨ Key Features

### 🛍️ Storefront & Customer Experience
1. **Luxury Hero Section**: Editorial imagery with golden CTAs (*"Explore Haute Couture"*, *"The Royal Bisht Atelier"*), craftsmanship highlights, and brand storytelling.
2. **Shop & Filtering**:
   - Filter by Category (*Royal Thobes*, *Haute Couture Abayas*, *Embroidered Bishts*, *Silk Caftans*, *Velvet Evening Wear*, *Fragrances & Accessories*).
   - Filter by Collection (*Royal Heritage*, *Desert Noir*, *Velvet Mirage*, *Golden Oasis*).
   - Dynamic price range slider (₹10,000 - ₹75,000+).
   - Live search with highlighted keyword filtering.
   - Sort by Newest, Price Low-High, Price High-Low, and Patron Acclaim.
3. **Product Details Page (`/product/[slug]`)**:
   - High-resolution gallery with thumbnail switcher.
   - Interactive Color swatches with live names.
   - Sizing options with an interactive **Bespoke Sizing & Tailoring Guide modal** (inches & cm).
   - Real-time stock status indicator (*In Atelier* vs *Low Stock Alert*).
   - Accordion tabs for **Textile Origin & Craftsmanship**, **Royal Packaging**, and **Garment Care**.
   - Customer Reviews with 5-star rating selector and verified patron submissions.
   - Curated companion products.
4. **Haute Bag & Wishlist**:
   - Slide-out Cart Drawer accessible site-wide with smooth backdrop blur.
   - Dedicated `/cart` page with line-item management and complimentary gift note inscription.
   - Free shipping progress bar (Complimentary White Glove Delivery on orders above ₹10,000).
   - Privilege coupon validation engine (`ROYAL10` for 10% off, `ALFAHA20` for 20% off, `WELCOME500`).
   - Persistent Wishlist (`/wishlist`) with 1-click move to cart.
5. **Sovereign Checkout (`/checkout`)**:
   - Full residence and contact form validation (India default with PIN code).
   - Courier tiers: *Blue Dart Apex Sovereign Express* vs *White Glove Uniformed Delivery in Lacquered Keepsake Chest*.
   - **Razorpay Online Payment** (Cards, UPI, NetBanking, Sovereign Wallets) with zero secret exposure.
   - **Cash on Delivery (COD)** with doorstep handover settlement.
   - Instant order confirmation screen (`/order-success/[orderNumber]`) with golden confetti celebration.
6. **Live Consignment Tracking (`/track`)**:
   - Lookup by order reference (e.g. `ALF-2026-7842`) and email/phone.
   - 5-stage visual milestone timeline:
     1. *Order Confirmed & Measurements Verified*
     2. *Master Tailoring & Hand-Finishing at Dubai Atelier*
     3. *Dispatched with Sovereign Royal Courier*
     4. *Out for White Glove Handover*
     5. *Delivered in Person in Keepsake Chest*
   - Real-time event log with timestamps and carrier consignment tracking ID.
7. **Patron Account Portal (`/account`)**:
   - Order history with live status tags and direct tracking links.
   - Saved shipping addresses.

---

### 🛡️ Secure Admin Dashboard (`/admin`)
- **Role-Based Authorization**: Protected by JWT verification (`role: 'admin'`).
- **Executive Analytics Overview (`/admin`)**:
  - Total Revenue in INR (₹).
  - Total Acquisitions & Average Order Value.
  - Active Patron Registry count.
  - Order pipeline status breakdown (Confirmed, Tailoring, Dispatched, Delivered).
  - Revenue distribution by category.
  - Low stock warning alerts.
- **Product Management (`/admin/products`)**:
  - Full CRUD operations: Create new creation, Edit existing piece, Delete piece.
  - Manage English title, Arabic calligraphy subtitle, fabric specifications, INR price, stock, sizes, and luxury tags (*Atelier Exclusive*, *New Season*).
- **Order Management & Dispatch (`/admin/orders`)**:
  - View all customer orders with customer details and line items.
  - Status transition modal (Confirmed &rarr; Tailoring &rarr; Dispatched &rarr; Delivered &rarr; Cancelled).
  - Assign carrier name and tracking consignment number.
  - **Automatic Dispatch Email Trigger**: Setting status to *Dispatched* automatically dispatches a luxury dispatch notification email to the patron!
- **Inventory Matrix (`/admin/inventory`)**:
  - Quick inline stock adjustments (`+`, `-`) with real-time database updates.
  - Visual flags for critical stock (&le; 5 units) and low stock (&le; 10 units).
- **Email Notifications Register (`/admin/notifications`)**:
  - Audit trail of all generated luxury HTML emails.
  - 1-click embedded modal preview of actual sent HTML templates.

---

## 🔒 Security & Payment Principles

1. **Zero Client Secret Exposure**:
   - `RAZORPAY_KEY_SECRET` is strictly accessible on server-side routes (`/api/payments/*`).
   - The frontend only receives `key` (`NEXT_PUBLIC_RAZORPAY_KEY_ID`) and `order_id`.
   - Cryptographic signature verification uses HMAC-SHA256 on the backend before confirming orders.
2. **Password Security**: All credentials hashed with `bcryptjs` (salt rounds: 10).
3. **JWT Authentication**: Signed with `jsonwebtoken`, verified on protected routes, stored in `HttpOnly` cookies and local storage.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+ installed.

### 1. Installation
Clone or navigate to the project directory:
```bash
cd c:\Users\lenovo\Desktop\E-COM
npm install
```

### 2. Environment Configuration
Create or edit `.env.local`:
```env
JWT_SECRET=AL_FAHA_ROYAL_HAUTE_COUTURE_SECRET_KEY_2026_98124
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_ALFAHA_LUXURY_PUBLIC
RAZORPAY_KEY_ID=rzp_test_ALFAHA_LUXURY_PUBLIC
RAZORPAY_KEY_SECRET=rzp_test_ALFAHA_SECRET_KEY_BACKEND_ONLY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Production Build
```bash
npm run build
npm start
```

---

## 🧪 Automated Testing

An automated integration test script is included to test all endpoints:
```bash
node scripts/test-suite.mjs
```
**Test Coverage**:
- Catalog products retrieval & category filtering
- Authentication (Admin & Customer role tokens)
- Luxury privilege promo code calculation (`ROYAL10`)
- Razorpay order initiation & payment secret safety check
- Order creation & inventory deduction
- Public live order tracking timeline
- Admin status updates & automated dispatch alert emails
- Email notifications audit log
- Executive analytics calculation

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Royal Admin** | `admin@alfaha.com` | `admin123` | Full Admin Console (`/admin`), Product CRUD, Order Status |
| **Privileged Patron** | `tariq@alfaha.com` | `customer123` | Patron Account (`/account`), Order History, Wishlist |

> **Tip**: On the `/login` page, click the **"Fill Royal Admin"** or **"Fill Patron"** buttons for 1-click test fill!

---

## 🚢 Deployment Guide

### Deploying to Vercel (Recommended)
1. Push repository to GitHub/GitLab.
2. Import project in the [Vercel Dashboard](https://vercel.com).
3. Set Environment Variables:
   - `JWT_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Click **Deploy**.

### Deploying via Docker / Standalone Node Server
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🏛️ Copyright & Rights
&copy; 2026 AL FAHA Couture. All Royal Rights Reserved.
Bespoke Haute Couture Arabia & Sovereign Elegance.
