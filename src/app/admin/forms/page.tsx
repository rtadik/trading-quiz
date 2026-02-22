'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToastContainer, { showToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

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

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  pt: 'Portuguese',
};

export default function AdminFormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<QuizForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<QuizForm | null>(null);

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
    showToast(
      newStatus === 'published' ? 'Quiz is now live!' : 'Quiz is now hidden.',
      'success'
    );
    fetchForms();
  };

  const deleteForm = async (form: QuizForm) => {
    setDeleting(form.id);
    await fetch(`/api/admin/forms/${form.id}`, { method: 'DELETE' });
    showToast('Quiz form deleted.', 'success');
    fetchForms();
    setDeleting(null);
    setConfirmDelete(null);
  };

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/q/${slug}`;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!', 'success');
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
      <ToastContainer />
      {confirmDelete && (
        <ConfirmModal
          title="Delete this quiz?"
          message={`"${confirmDelete.name}" and all its questions will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteForm(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
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
            + Create New Quiz
          </Link>
        </div>

        {/* Help banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-5 py-4 mb-6">
          <p className="text-blue-300 text-sm">
            This is where you manage your quiz forms. Each form is a different version of the quiz with its own questions, language, and scoring. Click <strong>Edit</strong> to change a form, or <strong>Create New Quiz</strong> to start fresh.
          </p>
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
                        {form.status === 'published' ? 'Live' : 'Hidden'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {LOCALE_LABELS[form.locale] || form.locale}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Quiz link: <code className="text-gray-300">/q/{form.slug}</code></span>
                      <span>{form.questionCount} questions</span>
                      <span>Results page: <code className="text-gray-300">{form.resultsPath}</code></span>
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
                      {form.status === 'published' ? 'Hide' : 'Make Live'}
                    </button>
                    <button
                      onClick={() => copyUrl(form.slug)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      Copy Link
                    </button>
                    <Link
                      href={`/admin/forms/${form.id}`}
                      className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(form)}
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
