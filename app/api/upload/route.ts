import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const fileNameHeader = req.headers.get('x-filename');
    const rawFileName = fileNameHeader ? decodeURIComponent(fileNameHeader) : `audio-${Date.now()}.mp3`;

    // Read binary body stream directly
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No audio data received' },
        { status: 400 }
      );
    }

    let publicUrl = '';

    // Save file to public/uploads directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${cleanFileName}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${fileName}`;
    } catch (writeErr) {
      console.warn('⚠️ Disk write fallback to Data URL:', writeErr);
      const mimeType = req.headers.get('content-type') || 'audio/mp3';
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: rawFileName,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process audio upload' },
      { status: 500 }
    );
  }
}
