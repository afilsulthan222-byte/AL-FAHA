import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide both email and password.' }, { status: 400 });
    }

    const userRecord = db.getUserByEmailWithPassword(email);

    if (!userRecord || !comparePassword(password, userRecord.passwordHash)) {
      return NextResponse.json({ success: false, message: 'Invalid credentials. Please verify your email and password.' }, { status: 401 });
    }

    const { passwordHash: _, ...safeUser } = userRecord;

    const token = signToken({
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: safeUser,
      token
    });

    response.cookies.set('alfaha_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Login failed' }, { status: 500 });
  }
}
