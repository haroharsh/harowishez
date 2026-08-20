import { NextRequest, NextResponse } from 'next/server';
import { getAllWishes, createWish } from '@/lib/wishService';

export async function GET() {
  try {
    const wishes = await getAllWishes();
    return NextResponse.json({ success: true, data: wishes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch wishes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Recipient name is required' },
        { status: 400 }
      );
    }

    const created = await createWish(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create wish profile' },
      { status: 500 }
    );
  }
}
