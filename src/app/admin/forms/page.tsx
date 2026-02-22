'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuizForm {
  id: string;
  name: string;
  slug: string;
  locale: string;
  status: string;
  resultsPath: string;
  description: string | null;
  questionCount: number;
  createdAt: string;
}

export default function AdminFormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<QuizForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchForms = () => {
    fetch('/api/admin/forms')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setForms(data);
        setLoading(false);
      })
      .catch(() => router.push('/admin/login'));
  };

  useEffect(() => {
    fetchForms();
  }, [router]);

  const toggleStatus = async (form: QuizForm) => {
    const newStatus = form.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/admin/forms/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchForms();
  };

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/admin/forms/${id}`, { method: 'DELETE' });
    fetchForms();
    setDeleting(null);
  };

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/q/${slug}`;
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Quiz Forms</h1>
          </div>
          <Link
            href="/admin/forms/new"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
          >
            + Create New Form
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">No quiz forms yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-white">{form.name}</h2>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          form.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {form.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 uppercase">
                        {form.locale}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Slug: <code className="text-gray-300">/q/{form.slug}</code></span>
                      <span>{form.questionCount} questions</span>
                      <span>Results: <code className="text-gray-300">{form.resultsPath}</code></span>
                    </div>
                    {form.description && (
                      <p className="text-gray-500 text-sm mt-1">{form.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleStatus(form)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      {form.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => copyUrl(form.slug)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      Copy URL
                    </button>
                    <Link
                      href={`/admin/forms/${form.id}`}
                      className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id)}
                      disabled={deleting === form.id}
                      className="px-3 py-1.5 rounded-lg text-sm bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors disabled:opacity-50"
                    >
                      {deleting === form.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
