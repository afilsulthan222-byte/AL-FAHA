import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendOrderEmail } from '@/lib/email';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const order = db.getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to retrieve order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, trackingNumber, courierName, note } = body;

    const previousOrder = db.getOrderById(id);
    const updatedOrder = db.updateOrderStatus(id, status, { trackingNumber, courierName, note });

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // If status changed to dispatched, trigger dispatch email notification
    if (status === 'dispatched' && previousOrder?.orderStatus !== 'dispatched') {
      try {
        sendOrderEmail(updatedOrder, 'order_dispatched');
      } catch (err) {
        console.warn('Dispatch email trigger warning:', err);
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
