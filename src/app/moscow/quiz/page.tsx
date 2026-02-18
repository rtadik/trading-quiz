import QuizContainer from '@/components/quiz/QuizContainer';
import { QUIZ_QUESTIONS_RU } from '@/lib/quiz-questions-ru';

export default function MoscowQuizPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <QuizContainer
          questions={QUIZ_QUESTIONS_RU}
          resultsBasePath="/moscow/results"
          locale="ru"
        />
      </div>
    </main>
  );
}
