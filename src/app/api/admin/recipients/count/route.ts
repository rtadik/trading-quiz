import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const segmentType = searchParams.get('segmentType') || 'all';
    const personalityTypesParam = searchParams.get('personalityTypes') || '';

    let whereClause: any = {};

    if (segmentType === 'personality_type' && personalityTypesParam) {
      const personalityTypes = personalityTypesParam.split(',').filter(Boolean);
      if (personalityTypes.length > 0) {
        whereClause.personalityType = {
          in: personalityTypes
        };
      }
    }

    const count = await prisma.contact.count({
      where: whereClause
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting recipients:', error);
    return NextResponse.json(
      { error: 'Failed to count recipients' },
      { status: 500 }
    );
  }
}
