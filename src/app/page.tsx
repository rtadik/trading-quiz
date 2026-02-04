import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-6xl"></span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          What Type of Trader Are You?
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
          Take our free 2-minute quiz to discover your trading personality type
          and get a personalized report with strategies to improve your results.
        </p>
        <div className="space-y-4">
          <Link
            href="/quiz"
            className="inline-block bg-gradient-to-r from-pink-dark to-pink-light text-white font-semibold text-lg px-8 py-4 rounded-xl hover:from-[#EE01BC] hover:to-[#FF6BE8] transition-all duration-200 shadow-lg shadow-pink-dark/30 hover:shadow-pink-dark/50 hover:scale-105"
          >
            Take the Free Quiz
          </Link>
          <p className="text-sm text-gray-500">
            7 questions &bull; 2 minutes &bull; Free personalized PDF report
          </p>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '', label: 'Emotional Trader' },
            { emoji: '', label: 'Time-Starved Trader' },
            { emoji: '', label: 'Inconsistent Executor' },
            { emoji: '', label: 'Overwhelmed Analyst' },
          ].map((type) => (
            <div
              key={type.label}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="text-3xl mb-2">{type.emoji}</div>
              <div className="text-sm text-gray-400">{type.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
