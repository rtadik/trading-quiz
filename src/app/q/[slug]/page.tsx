import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import QuizContainer from '@/components/quiz/QuizContainer';
import { QuizQuestion } from '@/lib/quiz-questions';

interface Props {
  params: { slug: string };
}

export default async function DynamicQuizPage({ params }: Props) {
  const form = await prisma.quizForm.findUnique({
    where: { slug: params.slug },
    include: { questions: { orderBy: { position: 'asc' } } },
  });

  if (!form || form.status !== 'published') {
    notFound();
  }

  const questions: QuizQuestion[] = form.questions.map((q) => ({
    id: q.questionKey,
    type: q.type as QuizQuestion['type'],
    question: q.question,
    placeholder: q.placeholder || undefined,
    options: q.options ? JSON.parse(q.options) : undefined,
  }));

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <QuizContainer
          questions={questions}
          resultsBasePath={form.resultsPath}
          locale={form.locale}
          formId={form.id}
        />
      </div>
    </main>
  );
}
