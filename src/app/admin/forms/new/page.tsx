'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HelpTooltip from '@/components/admin/HelpTooltip';

interface FormSummary {
  id: string;
  name: string;
  slug: string;
  locale: string;
}

export default function NewFormPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState('en');
  const [resultsPath, setResultsPath] = useState('/results');
  const [description, setDescription] = useState('');
  const [cloneFromId, setCloneFromId] = useState('');
  const [existingForms, setExistingForms] = useState<FormSummary[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/forms')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setExistingForms(data);
      });
  }, [router]);

  const autoSlug = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, locale, resultsPath, description, cloneFromId: cloneFromId || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create form');
      }

      const form = await res.json();
      router.push(`/admin/forms/${form.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/forms" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
          &larr; Back to Quiz Forms
        </Link>
        <h1 className="text-3xl font-bold text-white mb-4">Create New Quiz</h1>

        {/* Help banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-5 py-4 mb-8">
          <p className="text-blue-300 text-sm">
            Fill in the basics below, then you&apos;ll be taken to the editor to add questions and set up scoring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quiz Name
              <HelpTooltip text="Give your quiz a name (e.g., 'English Trading Quiz'). Only you see this — quiz takers won't." />
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => autoSlug(e.target.value)}
              placeholder="e.g. Crypto Traders Quiz"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL Path
              <HelpTooltip text="This becomes the quiz link: yoursite.com/q/this-value. Use lowercase letters and hyphens only. It's auto-generated from the name above." />
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">/q/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="crypto-traders"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">Auto-generated from the name. You can change it if needed.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
                <HelpTooltip text="The language this quiz is in. This determines which email templates are used for follow-up emails." />
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Results Page URL
                <HelpTooltip text="After completing the quiz, users are redirected here to see their results. Usually '/results' for English or '/moscow/results' for Russian." />
              </label>
              <input
                type="text"
                value={resultsPath}
                onChange={(e) => setResultsPath(e.target.value)}
                placeholder="/results"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Internal Notes
              <HelpTooltip text="Optional notes for your reference. Quiz takers won't see this." />
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 'Quiz targeting crypto traders, running on Twitter ads'"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Copy questions from an existing quiz
              <HelpTooltip text="Start with a copy of another quiz's questions instead of starting from scratch. You can change anything afterwards." />
            </label>
            <select
              value={cloneFromId}
              onChange={(e) => setCloneFromId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Start with a blank quiz (no questions)</option>
              {existingForms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.locale})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving || !name || !slug}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </main>
  );
}
