import { notFound } from 'next/navigation';
import { getPersonalityTypeFromSlug, getPersonalityTypeInfo } from '@/lib/personality-types';
import ResultsCard from '@/components/results/ResultsCard';

interface ResultsPageProps {
  params: { type: string };
  searchParams: { name?: string };
}

export default function ResultsPage({ params, searchParams }: ResultsPageProps) {
  const personalityType = getPersonalityTypeFromSlug(params.type);

  if (!personalityType) {
    notFound();
  }

  const typeInfo = getPersonalityTypeInfo(personalityType);
  const name = searchParams.name || 'Trader';

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ResultsCard typeInfo={typeInfo} name={name} />
      </div>
    </main>
  );
}
