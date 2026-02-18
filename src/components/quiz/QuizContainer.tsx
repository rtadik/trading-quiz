'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/lib/quiz-questions';
import TextInputStep from './TextInputStep';
import EmailInputStep from './EmailInputStep';
import MultipleChoiceStep from './MultipleChoiceStep';
import ProgressBar from './ProgressBar';

type QuizState = 'questions' | 'submitting';

interface QuizContainerProps {
  questions?: QuizQuestion[];
  resultsBasePath?: string;
  locale?: string;
}

export default function QuizContainer({
  questions = QUIZ_QUESTIONS,
  resultsBasePath = '/results',
  locale = 'en',
}: QuizContainerProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>('questions');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');


  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit({ ...answers, [questionId]: value });
    }
  };

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setState('submitting');
    setError('');

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...finalAnswers, locale }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      const data = await res.json();
      const slug = data.personalityType.replace(/_/g, '-');
      router.push(`${resultsBasePath}/${slug}?name=${encodeURIComponent(finalAnswers.first_name)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setState('questions');
    }
  };


  if (state === 'submitting') {
    return (
      <div className="text-center max-w-lg mx-auto">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">
          {locale === 'ru' ? 'Анализируем ваши ответы...' : 'Analyzing your responses...'}
        </h2>
        <p className="text-gray-400">
          {locale === 'ru' ? 'Определяем ваш тип торговой личности' : 'Calculating your trading personality type'}
        </p>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div>
      <ProgressBar current={currentStep + 1} total={questions.length} />

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {question.type === 'text' && (
          <TextInputStep
            key={question.id}
            question={question.question}
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onSubmit={(value) => handleAnswer(question.id, value)}
            stepNumber={currentStep}
          />
        )}
        {question.type === 'email' && (
          <EmailInputStep
            key={question.id}
            question={question.question}
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onSubmit={(value) => handleAnswer(question.id, value)}
            stepNumber={currentStep}
          />
        )}
        {question.type === 'multiple_choice' && question.options && (
          <MultipleChoiceStep
            key={question.id}
            question={question.question}
            options={question.options}
            value={answers[question.id] || ''}
            onSubmit={(value) => handleAnswer(question.id, value)}
            stepNumber={currentStep}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
