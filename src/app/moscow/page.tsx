import Link from 'next/link';

export default function MoscowHome() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-6xl">📈</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Какой вы трейдер?
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
          Пройдите наш бесплатный 2-минутный тест, чтобы узнать ваш тип торговой личности
          и получить персональный отчёт со стратегиями для улучшения результатов.
        </p>
        <div className="space-y-4">
          <Link
            href="/moscow/quiz"
            className="inline-block bg-gradient-to-r from-pink-dark to-pink-light text-white font-semibold text-lg px-8 py-4 rounded-xl hover:from-[#EE01BC] hover:to-[#FF6BE8] transition-all duration-200 shadow-lg shadow-pink-dark/30 hover:shadow-pink-dark/50 hover:scale-105"
          >
            Пройти бесплатный тест
          </Link>
          <p className="text-sm text-gray-500">
            7 вопросов &bull; 2 минуты &bull; Бесплатный персональный PDF-отчёт
          </p>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🎭', label: 'Эмоциональный трейдер' },
            { emoji: '⏰', label: 'Трейдер без времени' },
            { emoji: '⚡', label: 'Непоследовательный исполнитель' },
            { emoji: '📊', label: 'Перегруженный аналитик' },
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
