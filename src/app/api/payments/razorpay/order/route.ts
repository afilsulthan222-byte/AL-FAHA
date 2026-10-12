import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid payment amount' }, { status: 400 });
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}`;
    const order = await createRazorpayOrder({
      amount,
      currency: 'INR',
      receipt: orderReceipt,
    });

    // We send back the public Key ID only, NEVER the secret!
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_ALFAHA_PUBLIC';

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        key: publicKey,
        isSandboxSimulated: order.isSandboxSimulated,
      },
    });
  } catch (error: any) {
    console.error('Error generating Razorpay order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
