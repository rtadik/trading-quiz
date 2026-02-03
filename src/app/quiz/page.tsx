import QuizContainer from '@/components/quiz/QuizContainer';

export default function QuizPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <QuizContainer />
      </div>
    </main>
  );
}
