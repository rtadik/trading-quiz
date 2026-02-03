import { NextRequest, NextResponse } from 'next/server';
import { getPersonalityTypeFromSlug } from '@/lib/personality-types';
import { generatePDF } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const personalityType = getPersonalityTypeFromSlug(params.type);

    if (!personalityType) {
      return NextResponse.json({ error: 'Invalid personality type' }, { status: 404 });
    }

    const name = request.nextUrl.searchParams.get('name') || 'Trader';
    const pdfBuffer = await generatePDF(personalityType, name);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Trading-Personality-Report-${params.type}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
