import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide your full name, email, and password.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = db.createUser({
      name,
      email,
      password,
      phone,
      role: 'customer'
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const response = NextResponse.json({
      success: true,
      message: 'Welcome to the AL FAHA royal circle.',
      user,
      token
    }, { status: 201 });

    response.cookies.set('alfaha_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Registration failed' }, { status: 400 });
  }
}
