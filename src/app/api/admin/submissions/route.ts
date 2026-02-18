import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;
    const experienceLevel = searchParams.get('experience') || undefined;
    const performance = searchParams.get('performance') || undefined;
    const automationExperience = searchParams.get('automation') || undefined;
    const locale = searchParams.get('locale') || undefined;

    const where: Record<string, unknown> = {};
    if (type) where.personalityType = type;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (performance) where.performance = performance;
    if (automationExperience) where.automationExperience = automationExperience;
    if (locale) where.locale = locale;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          emails: {
            orderBy: { emailNumber: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
