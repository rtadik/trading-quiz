import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const forms = await prisma.quizForm.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      forms.map((f) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        locale: f.locale,
        status: f.status,
        resultsPath: f.resultsPath,
        description: f.description,
        questionCount: f._count.questions,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      }))
    );
  } catch (error) {
    console.error('Forms list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, locale, description, resultsPath, cloneFromId } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: 'Slug must be lowercase alphanumeric with hyphens' }, { status: 400 });
    }

    // Check uniqueness
    const existing = await prisma.quizForm.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A form with this slug already exists' }, { status: 400 });
    }

    const form = await prisma.quizForm.create({
      data: {
        name,
        slug,
        locale: locale || 'en',
        description: description || null,
        resultsPath: resultsPath || '/results',
        status: 'draft',
      },
    });

    // Clone questions from existing form if requested
    if (cloneFromId) {
      const sourceQuestions = await prisma.quizFormQuestion.findMany({
        where: { formId: cloneFromId },
        orderBy: { position: 'asc' },
      });

      if (sourceQuestions.length > 0) {
        await prisma.quizFormQuestion.createMany({
          data: sourceQuestions.map((q) => ({
            formId: form.id,
            questionKey: q.questionKey,
            type: q.type,
            question: q.question,
            placeholder: q.placeholder,
            options: q.options,
            position: q.position,
            required: q.required,
            scoringWeight: q.scoringWeight,
            scoringMap: q.scoringMap,
          })),
        });
      }
    }

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Form create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
