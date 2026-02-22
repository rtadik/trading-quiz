'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const PERSONALITY_TYPES = [
  'emotional_trader',
  'time_starved_trader',
  'inconsistent_executor',
  'overwhelmed_analyst',
];

interface QuestionData {
  questionKey: string;
  type: string;
  question: string;
  placeholder: string;
  options: { value: string; label: string }[];
  required: boolean;
  scoringWeight: number;
  scoringMap: Record<string, Record<string, number>>;
}

interface FormData {
  id: string;
  name: string;
  slug: string;
  locale: string;
  description: string | null;
  status: string;
  resultsPath: string;
  questions: {
    id: string;
    questionKey: string;
    type: string;
    question: string;
    placeholder: string | null;
    options: string | null;
    position: number;
    required: boolean;
    scoringWeight: number;
    scoringMap: string | null;
  }[];
}

function parseQuestion(q: FormData['questions'][0]): QuestionData {
  return {
    questionKey: q.questionKey,
    type: q.type,
    question: q.question,
    placeholder: q.placeholder || '',
    options: q.options ? JSON.parse(q.options) : [],
    required: q.required,
    scoringWeight: q.scoringWeight,
    scoringMap: q.scoringMap ? JSON.parse(q.scoringMap) : {},
  };
}

function newQuestion(position: number): QuestionData {
  return {
    questionKey: `question_${position}`,
    type: 'multiple_choice',
    question: '',
    placeholder: '',
    options: [{ value: 'option_1', label: 'Option 1' }],
    required: true,
    scoringWeight: 0,
    scoringMap: {},
  };
}

export default function FormEditorPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form metadata
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState('en');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [resultsPath, setResultsPath] = useState('/results');

  // Questions
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const fetchForm = useCallback(() => {
    fetch(`/api/admin/forms/${formId}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (res.status === 404) {
          router.push('/admin/forms');
          return null;
        }
        return res.json();
      })
      .then((data: FormData | null) => {
        if (data) {
          setName(data.name);
          setSlug(data.slug);
          setLocale(data.locale);
          setDescription(data.description || '');
          setStatus(data.status);
          setResultsPath(data.resultsPath);
          setQuestions(data.questions.map(parseQuestion));
        }
        setLoading(false);
      })
      .catch(() => router.push('/admin/login'));
  }, [formId, router]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save form metadata
      const metaRes = await fetch(`/api/admin/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, locale, description, status, resultsPath }),
      });

      if (!metaRes.ok) {
        const data = await metaRes.json();
        throw new Error(data.error || 'Failed to save form');
      }

      // Save questions
      const qRes = await fetch(`/api/admin/forms/${formId}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questions.map((q, i) => ({
            questionKey: q.questionKey,
            type: q.type,
            question: q.question,
            placeholder: q.placeholder || null,
            options: q.options.length > 0 ? JSON.stringify(q.options) : null,
            position: i,
            required: q.required,
            scoringWeight: q.scoringWeight,
            scoringMap: Object.keys(q.scoringMap).length > 0 ? JSON.stringify(q.scoringMap) : null,
          })),
        }),
      });

      if (!qRes.ok) {
        throw new Error('Failed to save questions');
      }

      setSuccess('Form saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    const newName = `${name} (Copy)`;
    const newSlug = `${slug}-copy`;
    const res = await fetch('/api/admin/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, slug: newSlug, locale, description, resultsPath, cloneFromId: formId }),
    });
    if (res.ok) {
      const form = await res.json();
      router.push(`/admin/forms/${form.id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to duplicate');
    }
  };

  const updateQuestion = (index: number, updates: Partial<QuestionData>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    setQuestions((prev) => {
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
    setExpandedQ(newIndex);
  };

  const removeQuestion = (index: number) => {
    if (!confirm('Remove this question?')) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setExpandedQ(null);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, newQuestion(prev.length)]);
    setExpandedQ(questions.length);
  };

  // Option helpers for a specific question
  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const num = q.options.length + 1;
    updateQuestion(qIndex, { options: [...q.options, { value: `option_${num}`, label: `Option ${num}` }] });
  };

  const updateOption = (qIndex: number, oIndex: number, field: 'value' | 'label', val: string) => {
    const q = questions[qIndex];
    const opts = q.options.map((o, i) => (i === oIndex ? { ...o, [field]: val } : o));
    updateQuestion(qIndex, { options: opts });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    updateQuestion(qIndex, { options: q.options.filter((_, i) => i !== oIndex) });
  };

  // Scoring map helpers
  const updateScoringMap = (qIndex: number, answerValue: string, personalityType: string, points: number) => {
    const q = questions[qIndex];
    const newMap = { ...q.scoringMap };
    if (!newMap[answerValue]) newMap[answerValue] = {};
    if (points === 0) {
      delete newMap[answerValue][personalityType];
      if (Object.keys(newMap[answerValue]).length === 0) delete newMap[answerValue];
    } else {
      newMap[answerValue][personalityType] = points;
    }
    updateQuestion(qIndex, { scoringMap: newMap });
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/forms" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
              &larr; Back to Forms
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Form</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/q/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Preview
            </a>
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Duplicate
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        {/* Form Metadata */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Form Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-sm">/q/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Locale</label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="en">English (en)</option>
                <option value="ru">Russian (ru)</option>
                <option value="es">Spanish (es)</option>
                <option value="de">German (de)</option>
                <option value="fr">French (fr)</option>
                <option value="pt">Portuguese (pt)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Results Path</label>
              <input
                type="text"
                value={resultsPath}
                onChange={(e) => setResultsPath(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Internal notes..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Questions ({questions.length})</h2>
            <button
              onClick={addQuestion}
              className="px-4 py-1.5 rounded-lg text-sm bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-colors"
            >
              + Add Question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const isExpanded = expandedQ === i;
              return (
                <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                  {/* Question header (always visible) */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setExpandedQ(isExpanded ? null : i)}
                  >
                    <span className="text-gray-500 text-sm font-mono w-6">{i + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{q.type}</span>
                    <span className="text-white flex-1 truncate">{q.question || '(empty question)'}</span>
                    <span className="text-gray-500 text-xs">{q.questionKey}</span>
                    {q.scoringWeight > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                        scored (w:{q.scoringWeight})
                      </span>
                    )}
                    <span className="text-gray-500">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                  </div>

                  {/* Expanded editor */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 bg-white/[0.02]">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Question Key</label>
                          <input
                            type="text"
                            value={q.questionKey}
                            onChange={(e) => updateQuestion(i, { questionKey: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                          <select
                            value={q.type}
                            onChange={(e) => updateQuestion(i, { type: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="text">Text Input</option>
                            <option value="email">Email Input</option>
                            <option value="multiple_choice">Multiple Choice</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Required</label>
                          <select
                            value={q.required ? 'yes' : 'no'}
                            onChange={(e) => updateQuestion(i, { required: e.target.value === 'yes' })}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Question Text</label>
                        <textarea
                          value={q.question}
                          onChange={(e) => updateQuestion(i, { question: e.target.value })}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {(q.type === 'text' || q.type === 'email') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={q.placeholder}
                            onChange={(e) => updateQuestion(i, { placeholder: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      {/* Options editor (multiple choice) */}
                      {q.type === 'multiple_choice' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-2">Options</label>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt.value}
                                  onChange={(e) => updateOption(i, oi, 'value', e.target.value)}
                                  placeholder="value"
                                  className="w-36 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                                />
                                <input
                                  type="text"
                                  value={opt.label}
                                  onChange={(e) => updateOption(i, oi, 'label', e.target.value)}
                                  placeholder="Label text"
                                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => removeOption(i, oi)}
                                  className="text-red-400 hover:text-red-300 text-sm px-1"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => addOption(i)}
                            className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            + Add option
                          </button>
                        </div>
                      )}

                      {/* Scoring config */}
                      <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center gap-4 mb-2">
                          <label className="block text-xs font-medium text-gray-400">Scoring Weight</label>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={q.scoringWeight}
                            onChange={(e) => updateQuestion(i, { scoringWeight: parseInt(e.target.value) || 0 })}
                            className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                          <span className="text-gray-500 text-xs">0 = not scored</span>
                        </div>

                        {q.scoringWeight > 0 && q.type === 'multiple_choice' && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-400 mb-2">
                              Scoring Map (answer &rarr; personality type &rarr; points)
                            </label>
                            <div className="space-y-2">
                              {q.options.map((opt) => (
                                <div key={opt.value} className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-gray-300 font-mono w-36 truncate">{opt.value}</span>
                                  {PERSONALITY_TYPES.map((pt) => (
                                    <div key={pt} className="flex items-center gap-1">
                                      <span className="text-xs text-gray-500 truncate w-16">{pt.split('_')[0]}</span>
                                      <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={q.scoringMap[opt.value]?.[pt] || 0}
                                        onChange={(e) =>
                                          updateScoringMap(i, opt.value, pt, parseInt(e.target.value) || 0)
                                        }
                                        className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-white text-xs text-center focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => moveQuestion(i, -1)}
                          disabled={i === 0}
                          className="px-3 py-1 rounded text-sm bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Move Up
                        </button>
                        <button
                          onClick={() => moveQuestion(i, 1)}
                          disabled={i === questions.length - 1}
                          className="px-3 py-1 rounded text-sm bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Move Down
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => removeQuestion(i)}
                          className="px-3 py-1 rounded text-sm bg-red-600/20 text-red-400 hover:bg-red-600/40"
                        >
                          Delete Question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {questions.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No questions yet. Click &ldquo;Add Question&rdquo; to start building your quiz.
            </p>
          )}
        </div>

        {/* Bottom save button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>
    </main>
  );
}
