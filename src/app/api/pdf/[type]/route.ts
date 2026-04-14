import { NextRequest, NextResponse } from 'next/server';
import { getPersonalityTypeFromSlug } from '@/lib/personality-types';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const personalityType = getPersonalityTypeFromSlug(params.type);

    if (!personalityType) {
      return NextResponse.json({ error: 'Invalid personality type' }, { status: 404 });
    }

    const locale = request.nextUrl.searchParams.get('locale') === 'ru' ? 'ru' : 'en';
    const filename = `${params.type}-${locale}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'pdfs', filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const pdfBuffer = fs.readFileSync(filePath);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Trading-Personality-Report-${params.type}.pdf"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('PDF serve error:', error);
    return NextResponse.json({ error: 'Failed to serve PDF' }, { status: 500 });
  }
}
