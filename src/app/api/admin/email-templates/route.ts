import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all email templates
export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create or update template
export async function POST(request: Request) {
  try {
    const { id, name, subject, body, category, status } = await request.json();

    if (!name || !subject || !body) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }

    let template;

    if (id) {
      // Update existing template
      template = await prisma.emailTemplate.update({
        where: { id },
        data: { name, subject, body, category, status }
      });
    } else {
      // Create new template
      template = await prisma.emailTemplate.create({
        data: { name, subject, body, category, status: status || 'draft' }
      });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}
