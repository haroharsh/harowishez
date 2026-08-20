import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/adminAuthService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(username, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
        token: result.token,
        username: username.trim().toLowerCase(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Authentication failed' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error during authentication' },
      { status: 500 }
    );
  }
}
