import { NextRequest, NextResponse } from 'next/server';
import { getAllWishes, createWish, clearAllWishes, resetToSeedWishes } from '@/lib/wishService';

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

// DELETE /api/wishes -> Clears all wishes in DB and local store
export async function DELETE() {
  try {
    await clearAllWishes();
    return NextResponse.json({ success: true, message: 'All database entries cleared successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear database' },
      { status: 500 }
    );
  }
}

// PUT /api/wishes -> Reset database to initial seed sample portals
export async function PUT() {
  try {
    const wishes = await resetToSeedWishes();
    return NextResponse.json({ success: true, data: wishes, message: 'Database reset to initial seed data' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset database' },
      { status: 500 }
    );
  }
}
