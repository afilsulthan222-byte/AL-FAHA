import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ success: false, message: 'Missing payment verification tokens' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature || '',
    });

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Cryptographic signature verification failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      message: 'Payment verified successfully by AL FAHA secure gateway.',
    });
  } catch (error: any) {
    console.error('Payment signature check error:', error);
    return NextResponse.json({ success: false, message: 'Payment validation error' }, { status: 500 });
  }
}
