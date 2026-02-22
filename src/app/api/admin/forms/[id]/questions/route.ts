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
    const questions = await prisma.quizFormQuestion.findMany({
      where: { formId: params.id },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Questions list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Bulk update: replace all questions for a form
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { questions } = await request.json();

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'Questions must be an array' }, { status: 400 });
    }

    // Verify form exists
    const form = await prisma.quizForm.findUnique({ where: { id: params.id } });
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Delete all existing questions and recreate
    await prisma.quizFormQuestion.deleteMany({ where: { formId: params.id } });

    if (questions.length > 0) {
      await prisma.quizFormQuestion.createMany({
        data: questions.map((q: {
          questionKey: string;
          type: string;
          question: string;
          placeholder?: string;
          options?: string;
          position: number;
          required?: boolean;
          scoringWeight?: number;
          scoringMap?: string;
        }, index: number) => ({
          formId: params.id,
          questionKey: q.questionKey || `question_${index}`,
          type: q.type || 'text',
          question: q.question || '',
          placeholder: q.placeholder || null,
          options: q.options || null,
          position: q.position ?? index,
          required: q.required ?? true,
          scoringWeight: q.scoringWeight ?? 0,
          scoringMap: q.scoringMap || null,
        })),
      });
    }

    const updated = await prisma.quizFormQuestion.findMany({
      where: { formId: params.id },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Questions update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
