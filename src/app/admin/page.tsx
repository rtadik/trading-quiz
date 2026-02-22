'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  totalContacts: number;
  todayContacts: number;
  emailsSent: number;
  emailsPending: number;
  emailsFailed: number;
  typeDistribution: { type: string; count: number }[];
  submissionsByDate: Record<string, number>;
  experienceDistribution: { level: string; count: number }[];
  automationDistribution: { experience: string; count: number }[];
  localeDistribution: { locale: string; count: number }[];
}

const TYPE_LABELS: Record<string, string> = {
  emotional_trader: ' Emotional Trader',
  time_starved_trader: ' Time-Starved Trader',
  inconsistent_executor: ' Inconsistent Executor',
  overwhelmed_analyst: ' Overwhelmed Analyst',
};

const TYPE_COLORS: Record<string, string> = {
  emotional_trader: 'bg-red-500',
  time_starved_trader: 'bg-blue-500',
  inconsistent_executor: 'bg-yellow-500',
  overwhelmed_analyst: 'bg-purple-500',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setStats(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!stats) return null;

  const totalTypes = stats.typeDistribution.reduce((sum, t) => sum + t.count, 0);
  const enCount = stats.localeDistribution.find((l) => l.locale === 'en')?.count ?? 0;
  const ruCount = stats.localeDistribution.find((l) => l.locale === 'ru')?.count ?? 0;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/forms"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
            >
              Quiz Forms
            </Link>
            <Link
              href="/admin/emails"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
            >
              Email Campaigns
            </Link>
            <Link
              href="/admin/submissions"
              className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Submissions
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Submissions</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalContacts}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Today</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{stats.todayContacts}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Emails Sent</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{stats.emailsSent}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Emails Pending</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.emailsPending}</p>
            {stats.emailsFailed > 0 && (
              <p className="text-red-400 text-xs mt-1">{stats.emailsFailed} failed</p>
            )}
          </div>
        </div>

        {/* EN / RU split */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
            <span className="text-3xl">🇬🇧</span>
            <div>
              <p className="text-gray-400 text-sm">English (EN)</p>
              <p className="text-2xl font-bold text-white mt-0.5">{enCount}</p>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-center gap-4">
            <span className="text-3xl">🇷🇺</span>
            <div>
              <p className="text-gray-400 text-sm">Russian /moscow (RU)</p>
              <p className="text-2xl font-bold text-blue-300 mt-0.5">{ruCount}</p>
            </div>
          </div>
        </div>

        {/* Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Personality Type Distribution</h2>
            {stats.typeDistribution.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              <div className="space-y-4">
                {stats.typeDistribution.map((t) => {
                  const pct = totalTypes > 0 ? (t.count / totalTypes) * 100 : 0;
                  return (
                    <div key={t.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{TYPE_LABELS[t.type] || t.type}</span>
                        <span className="text-gray-400">{t.count} ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                          className={`${TYPE_COLORS[t.type] || 'bg-gray-500'} h-3 rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Experience & Automation breakdown */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Experience Level</h2>
              <div className="space-y-2">
                {stats.experienceDistribution.map((e) => (
                  <div key={e.level} className="flex justify-between">
                    <span className="text-gray-300 capitalize">{e.level}</span>
                    <span className="text-gray-400">{e.count}</span>
                  </div>
                ))}
                {stats.experienceDistribution.length === 0 && (
                  <p className="text-gray-500 text-sm">No data yet</p>
                )}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Automation Interest</h2>
              <div className="space-y-2">
                {stats.automationDistribution.map((a) => (
                  <div key={a.experience} className="flex justify-between">
                    <span className="text-gray-300">{a.experience.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400">{a.count}</span>
                  </div>
                ))}
                {stats.automationDistribution.length === 0 && (
                  <p className="text-gray-500 text-sm">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Submissions (Last 30 Days)</h2>
          {Object.keys(stats.submissionsByDate).length === 0 ? (
            <p className="text-gray-500 text-sm">No submissions yet</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {Object.entries(stats.submissionsByDate).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(stats.submissionsByDate));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div
                    key={date}
                    className="flex-1 bg-blue-500/60 rounded-t hover:bg-blue-500 transition-colors group relative"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${date}: ${count} submissions`}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
