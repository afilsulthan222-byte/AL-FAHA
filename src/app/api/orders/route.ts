import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendOrderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    if (user.role === 'admin') {
      const orders = db.getOrders();
      return NextResponse.json({ success: true, orders });
    }

    const customerOrders = db.getOrdersByUserId(user.userId).length > 0 
      ? db.getOrdersByUserId(user.userId) 
      : db.getOrdersByEmail(user.email);

    return NextResponse.json({ success: true, orders: customerOrders });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      discount = 0,
      couponCode,
      total,
      paymentMethod,
      paymentStatus = 'pending',
      razorpayOrderId,
      razorpayPaymentId,
      giftNote
    } = body;

    if (!customerEmail || !items?.length || !shippingAddress || !total) {
      return NextResponse.json({ success: false, message: 'Incomplete order details.' }, { status: 400 });
    }

    // Optional user token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;

    const order = db.createOrder({
      userId: user?.userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      discount,
      couponCode,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' && razorpayPaymentId ? 'paid' : paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      orderStatus: 'confirmed',
      estimatedDelivery: '3-5 Business Days',
      giftNote
    });

    // Automatically send and record luxury email confirmation
    try {
      sendOrderEmail(order, 'order_confirmed');
    } catch (emailErr) {
      console.warn('Email confirmation logging note:', emailErr);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to place order' }, { status: 500 });
  }
}
