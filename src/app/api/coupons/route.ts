import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Please enter a privilege promo code' }, { status: 400 });
    }

    const coupon = db.getCouponByCode(code);

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or expired royal privilege code' }, { status: 404 });
    }

    if (cartTotal && cartTotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `This privilege code requires a minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to apply coupon' }, { status: 500 });
  }
}
