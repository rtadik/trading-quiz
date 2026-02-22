import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await prisma.quizForm.findUnique({
      where: { id: params.id },
      include: {
        questions: { orderBy: { position: 'asc' } },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Form get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, locale, description, resultsPath, status } = body;

    // If slug is changing, validate format and uniqueness
    if (slug) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return NextResponse.json({ error: 'Slug must be lowercase alphanumeric with hyphens' }, { status: 400 });
      }

      const existing = await prisma.quizForm.findFirst({
        where: { slug, id: { not: params.id } },
      });
      if (existing) {
        return NextResponse.json({ error: 'A form with this slug already exists' }, { status: 400 });
      }
    }

    const form = await prisma.quizForm.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(locale !== undefined && { locale }),
        ...(description !== undefined && { description }),
        ...(resultsPath !== undefined && { resultsPath }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Form update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.quizForm.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
