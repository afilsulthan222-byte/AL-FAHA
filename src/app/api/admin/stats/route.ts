import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const orders = db.getOrders();
    const products = db.getProducts();
    const users = db.getUsers();
    const emailNotifications = db.getEmailNotifications();

    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const customersCount = users.filter(u => u.role === 'customer').length;

    // Status distribution
    const ordersByStatus = {
      confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
      tailoring: orders.filter(o => o.orderStatus === 'tailoring').length,
      dispatched: orders.filter(o => o.orderStatus === 'dispatched').length,
      out_for_delivery: orders.filter(o => o.orderStatus === 'out_for_delivery').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    };

    // Category breakdown
    const categoryRevenue: Record<string, number> = {};
    for (const order of orders) {
      for (const item of order.items) {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'Couture';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.total;
      }
    }

    // Low stock items (stock <= 10)
    const lowStockProducts = products.filter(p => p.stock <= 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        customersCount,
        ordersByStatus,
        categoryRevenue,
        lowStockProducts,
        recentOrders: orders.slice(0, 5),
        recentEmails: emailNotifications.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ success: false, message: 'Failed to compute metrics' }, { status: 500 });
  }
}
