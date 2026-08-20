import { NextRequest, NextResponse } from 'next/server';
import { getWishByHash, updateWish, deleteWish } from '@/lib/wishService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    if (!hash) {
      return NextResponse.json(
        { success: false, error: 'Hash parameter is required' },
        { status: 400 }
      );
    }

    const wish = await getWishByHash(hash);
    if (!wish) {
      return NextResponse.json(
        { success: false, error: `Wish profile not found for hash: ${hash}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wish });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching wish profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    const body = await req.json();

    const updated = await updateWish(hash, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Wish profile not found or failed to update' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating wish profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    const success = await deleteWish(hash);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Wish profile not found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Wish profile deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error deleting wish profile' },
      { status: 500 }
    );
  }
}
