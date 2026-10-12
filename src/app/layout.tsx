import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';

export const metadata: Metadata = {
  title: 'AL FAHA | Haute Couture Arabia & Sovereign Elegance',
  description: 'The pinnacle of Arabian luxury clothing, royal thobes, haute couture abayas, 24k Kasab bishts, silk caftans and aged Cambodi oud.',
  keywords: 'AL FAHA, Luxury Arabic Fashion, Royal Thobe, Haute Abaya, Kasab Bisht, Silk Caftan, Dubai Couture',
  openGraph: {
    title: 'AL FAHA | Haute Couture Arabia',
    description: 'Arabian sartorial grandeur crafted with 200s Giza cotton, Italian silk and 24k gold bullion.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="min-h-screen flex flex-col bg-obsidian-950 text-ivory-100 antialiased selection:bg-gold-500 selection:text-obsidian-950">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
