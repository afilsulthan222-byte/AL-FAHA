import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, emailOrPhone } = await request.json();

    if (!orderNumber) {
      return NextResponse.json({ success: false, message: 'Please provide an Order Number (e.g. ALF-2026-7842).' }, { status: 400 });
    }

    const order = db.getOrderById(orderNumber.trim());

    if (!order) {
      return NextResponse.json({ success: false, message: 'No royal order found matching this reference number. Please check and try again.' }, { status: 404 });
    }

    if (emailOrPhone) {
      const query = emailOrPhone.trim().toLowerCase();
      const matchEmail = order.customerEmail.toLowerCase() === query;
      const matchPhone = order.customerPhone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''));

      if (!matchEmail && !matchPhone) {
        return NextResponse.json({ 
          success: false, 
          message: 'The email address or phone number provided does not match the order record.' 
        }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        trackingNumber: order.trackingNumber,
        courierName: order.courierName,
        estimatedDelivery: order.estimatedDelivery,
        shippingAddress: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          country: order.shippingAddress.country
        },
        items: order.items.map(item => ({
          productName: item.productName,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        timeline: order.timeline
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to process tracking inquiry' }, { status: 500 });
  }
}
