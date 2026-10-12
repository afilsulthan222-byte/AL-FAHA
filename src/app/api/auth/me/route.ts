import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('alfaha_token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const allUsers = db.getUsers();
    const user = allUsers.find(u => u.id === payload.userId) || {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Logout endpoint clearing cookie
  const response = NextResponse.json({ success: true, message: 'Signed out successfully' });
  response.cookies.delete('alfaha_token');
  return response;
}
