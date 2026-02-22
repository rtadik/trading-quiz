import QuizContainer from '@/components/quiz/QuizContainer';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/lib/quiz-questions';
import { prisma } from '@/lib/db';

async function loadFormFromDB() {
  try {
    const form = await prisma.quizForm.findUnique({
      where: { slug: 'en-default' },
      include: { questions: { orderBy: { position: 'asc' } } },
    });

    if (!form || form.status !== 'published' || form.questions.length === 0) {
      return null;
    }

    const questions: QuizQuestion[] = form.questions.map((q) => ({
      id: q.questionKey,
      type: q.type as QuizQuestion['type'],
      question: q.question,
      placeholder: q.placeholder || undefined,
      options: q.options ? JSON.parse(q.options) : undefined,
    }));

    return { questions, formId: form.id, resultsPath: form.resultsPath, locale: form.locale };
  } catch {
    return null;
  }
}

export default async function QuizPage() {
  const dbForm = await loadFormFromDB();

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {dbForm ? (
          <QuizContainer
            questions={dbForm.questions}
            resultsBasePath={dbForm.resultsPath}
            locale={dbForm.locale}
            formId={dbForm.formId}
          />
        ) : (
          <QuizContainer questions={QUIZ_QUESTIONS} />
        )}
      </div>
    </main>
  );
}
