import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No audio file selected' },
        { status: 400 }
      );
    }

    // Limit size to 50MB for audio files
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Audio file exceeds 50MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';

    // Attempt to write to public/uploads directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${cleanFileName}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${fileName}`;
    } catch (writeErr) {
      console.warn('⚠️ Could not write to public/uploads directory (read-only filesystem), converting to Data URL:', writeErr);
      const mimeType = file.type || 'audio/mp3';
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process audio upload' },
      { status: 500 }
    );
  }
}
