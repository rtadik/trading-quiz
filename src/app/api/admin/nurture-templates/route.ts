import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

// GET — list all nurture templates
export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await prisma.nurtureTemplate.findMany({
      orderBy: [{ locale: 'asc' }, { personalityType: 'asc' }, { emailNumber: 'asc' }],
    });
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching nurture templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// PUT — update one template
export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, subject, body } = await request.json();

    if (!id || !subject || !body) {
      return NextResponse.json({ error: 'id, subject, and body are required' }, { status: 400 });
    }

    const template = await prisma.nurtureTemplate.update({
      where: { id },
      data: { subject, body },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating nurture template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}
