import { notFound } from 'next/navigation';
import { getPersonalityTypeFromSlugRu, getPersonalityTypeInfoRu } from '@/lib/personality-types-ru';
import ResultsCard from '@/components/results/ResultsCard';

interface ResultsPageProps {
  params: { type: string };
  searchParams: { name?: string };
}

export default function MoscowResultsPage({ params, searchParams }: ResultsPageProps) {
  const personalityType = getPersonalityTypeFromSlugRu(params.type);

  if (!personalityType) {
    notFound();
  }

  const typeInfo = getPersonalityTypeInfoRu(personalityType);
  const name = searchParams.name || 'Трейдер';

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ResultsCard typeInfo={typeInfo} name={name} />
      </div>
    </main>
  );
}
