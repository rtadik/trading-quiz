'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import HelpTooltip from '@/components/admin/HelpTooltip';
import ToastContainer, { showToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

const PERSONALITY_TYPES = [
  { key: 'emotional_trader', label: 'Emotional Trader' },
  { key: 'time_starved_trader', label: 'Time-Starved Trader' },
  { key: 'inconsistent_executor', label: 'Inconsistent Executor' },
  { key: 'overwhelmed_analyst', label: 'Overwhelmed Analyst' },
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 40);
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

// Test scoring simulator
function simulateScoring(
  questions: QuestionData[],
  testAnswers: Record<string, string>
): { type: string; scores: Record<string, number> } | null {
  const scores: Record<string, number> = {
    emotional_trader: 0,
    time_starved_trader: 0,
    inconsistent_executor: 0,
    overwhelmed_analyst: 0,
  };

  let hasScoredQuestion = false;
  let highestWeightQuestion: { key: string; weight: number } | null = null;

  for (const q of questions) {
    if (q.scoringWeight === 0 || q.type !== 'multiple_choice') continue;
    hasScoredQuestion = true;

    const answer = testAnswers[q.questionKey];
    if (!answer) continue;

    const answerScores = q.scoringMap[answer];
    if (!answerScores) continue;

    for (const [pt, points] of Object.entries(answerScores)) {
      if (pt in scores) scores[pt] += points;
    }

    if (!highestWeightQuestion || q.scoringWeight > highestWeightQuestion.weight) {
      highestWeightQuestion = { key: q.questionKey, weight: q.scoringWeight };
    }
  }

  if (!hasScoredQuestion) return null;

  let maxScore = 0;
  let maxType = 'emotional_trader';
  let hasTie = false;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
      hasTie = false;
    } else if (score === maxScore && score > 0) {
      hasTie = true;
    }
  }

  if (hasTie && highestWeightQuestion) {
    const tieAnswer = testAnswers[highestWeightQuestion.key];
    if (tieAnswer) {
      const tieQ = questions.find((q) => q.questionKey === highestWeightQuestion!.key);
      if (tieQ) {
        const tieScores = tieQ.scoringMap[tieAnswer];
        if (tieScores) {
          let tieMax = 0;
          for (const [type, points] of Object.entries(tieScores)) {
            if (points > tieMax && type in scores) {
              tieMax = points;
              maxType = type;
            }
          }
        }
      }
    }
  }

  return { type: maxType, scores };
}

export default function FormEditorPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  // Advanced toggles
  const [showAdvanced, setShowAdvanced] = useState<Record<number, boolean>>({});
  const [showInternalIds, setShowInternalIds] = useState(false);

  // Confirm modal state
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Test scoring state
  const [showTestScoring, setShowTestScoring] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});

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

    try {
      const metaRes = await fetch(`/api/admin/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, locale, description, status, resultsPath }),
      });

      if (!metaRes.ok) {
        const data = await metaRes.json();
        throw new Error(data.error || 'Failed to save form');
      }

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

      showToast('Quiz saved successfully!', 'success');
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
      showToast('Quiz duplicated!', 'success');
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
    setConfirmAction({
      title: 'Delete this question?',
      message: 'This question and its scoring settings will be removed. You can undo by not saving the form.',
      onConfirm: () => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
        setExpandedQ(null);
        setConfirmAction(null);
        showToast('Question removed.', 'info');
      },
    });
  };

  const duplicateQuestion = (index: number) => {
    const original = questions[index];
    const copy: QuestionData = {
      ...original,
      questionKey: `${original.questionKey}_copy`,
      question: original.question ? `${original.question} (copy)` : '',
    };
    setQuestions((prev) => {
      const arr = [...prev];
      arr.splice(index + 1, 0, copy);
      return arr;
    });
    setExpandedQ(index + 1);
    showToast('Question duplicated!', 'success');
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, newQuestion(prev.length)]);
    setExpandedQ(questions.length);
  };

  // Option helpers
  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const num = q.options.length + 1;
    updateQuestion(qIndex, { options: [...q.options, { value: `option_${num}`, label: `Option ${num}` }] });
  };

  const updateOption = (qIndex: number, oIndex: number, field: 'value' | 'label', val: string) => {
    const q = questions[qIndex];
    const opts = q.options.map((o, i) => {
      if (i !== oIndex) return o;
      const updated = { ...o, [field]: val };
      // Auto-generate internal ID from label if label is being changed
      if (field === 'label' && !showInternalIds) {
        updated.value = slugify(val) || `option_${oIndex + 1}`;
      }
      return updated;
    });
    updateQuestion(qIndex, { options: opts });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    updateQuestion(qIndex, { options: q.options.filter((_, i) => i !== oIndex) });
  };

  // Scoring helpers
  const setScoringEnabled = (qIndex: number, enabled: boolean) => {
    if (enabled) {
      updateQuestion(qIndex, { scoringWeight: 2 }); // Default to "Secondary"
    } else {
      updateQuestion(qIndex, { scoringWeight: 0, scoringMap: {} });
    }
  };

  const setScoringImportance = (qIndex: number, importance: string) => {
    const weights: Record<string, number> = { primary: 3, secondary: 2, minor: 1 };
    updateQuestion(qIndex, { scoringWeight: weights[importance] || 2 });
  };

  const getImportanceFromWeight = (weight: number): string => {
    if (weight >= 3) return 'primary';
    if (weight === 2) return 'secondary';
    return 'minor';
  };

  const updateAnswerScoring = (qIndex: number, answerValue: string, personalityType: string, points: number) => {
    const q = questions[qIndex];
    const newMap = { ...q.scoringMap };

    // Clear previous personality type for this answer (only allow one type per answer for simplicity)
    if (!newMap[answerValue]) newMap[answerValue] = {};

    if (personalityType === '' || points === 0) {
      // Clear scoring for this answer
      delete newMap[answerValue];
    } else {
      // Set the personality type for this answer
      newMap[answerValue] = { [personalityType]: points };
    }
    updateQuestion(qIndex, { scoringMap: newMap });
  };

  const getAnswerPersonalityType = (q: QuestionData, answerValue: string): string => {
    const mapping = q.scoringMap[answerValue];
    if (!mapping) return '';
    const entries = Object.entries(mapping);
    if (entries.length === 0) return '';
    return entries[0][0];
  };

  const getAnswerPoints = (q: QuestionData, answerValue: string): number => {
    const mapping = q.scoringMap[answerValue];
    if (!mapping) return 3;
    const entries = Object.entries(mapping);
    if (entries.length === 0) return 3;
    return entries[0][1];
  };

  // Auto-generate question key from question text
  const autoGenerateKey = (qIndex: number, questionText: string) => {
    if (!showAdvanced[qIndex]) {
      const key = slugify(questionText) || `question_${qIndex}`;
      updateQuestion(qIndex, { question: questionText, questionKey: key });
    } else {
      updateQuestion(qIndex, { question: questionText });
    }
  };

  // Test scoring result
  const testResult = showTestScoring ? simulateScoring(questions, testAnswers) : null;

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
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/forms" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
              &larr; Back to Quiz Forms
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Quiz</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/q/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Preview Quiz
            </a>
            <button
              onClick={() => setShowTestScoring(!showTestScoring)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                showTestScoring
                  ? 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Test Scoring
            </button>
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
              {saving ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>
        </div>

        {/* Help banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-5 py-4 mb-6">
          <p className="text-blue-300 text-sm">
            Set up your quiz details below, then add and configure questions. When you&apos;re done, click <strong>Save Quiz</strong> and set visibility to <strong>Live</strong> to make it accessible.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Test Scoring Panel */}
        {showTestScoring && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Test Your Scoring</h2>
            <p className="text-gray-400 text-sm mb-4">
              Select answers below to see which personality type they would produce. This uses the scoring you&apos;ve configured on each question.
            </p>
            {questions.filter((q) => q.scoringWeight > 0 && q.type === 'multiple_choice').length === 0 ? (
              <p className="text-yellow-400 text-sm">No questions are set up for scoring yet. Enable &quot;Does this question affect the result?&quot; on at least one multiple choice question.</p>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {questions.map((q, i) => {
                    if (q.scoringWeight === 0 || q.type !== 'multiple_choice') return null;
                    return (
                      <div key={i}>
                        <p className="text-sm text-gray-300 mb-1">{q.question || `Question ${i + 1}`}</p>
                        <select
                          value={testAnswers[q.questionKey] || ''}
                          onChange={(e) => setTestAnswers((prev) => ({ ...prev, [q.questionKey]: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        >
                          <option value="">-- Select an answer --</option>
                          {q.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
                {testResult && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white font-medium mb-2">
                      Result: <span className="text-purple-300">{PERSONALITY_TYPES.find((pt) => pt.key === testResult.type)?.label || testResult.type}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {PERSONALITY_TYPES.map((pt) => (
                        <div key={pt.key} className="flex justify-between text-sm">
                          <span className="text-gray-400">{pt.label}</span>
                          <span className={testResult.type === pt.key ? 'text-purple-300 font-medium' : 'text-gray-500'}>
                            {testResult.scores[pt.key] || 0} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!testResult && Object.keys(testAnswers).length > 0 && (
                  <p className="text-gray-500 text-sm">Select answers above to see the result.</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Quiz Settings */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quiz Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Quiz Name
                <HelpTooltip text="The name of this quiz. Only visible to admins, not quiz takers." />
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL Path
                <HelpTooltip text="The web address for this quiz. People will access it at yoursite.com/q/this-value" />
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
                <HelpTooltip text="Determines which language email templates are used for follow-up emails." />
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Results Page URL
                <HelpTooltip text="Where users go after finishing the quiz (e.g., /results for English, /moscow/results for Russian)." />
              </label>
              <input
                type="text"
                value={resultsPath}
                onChange={(e) => setResultsPath(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Visibility
                <HelpTooltip text="Live = anyone can access the quiz. Hidden = only visible to admins." />
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="draft">Hidden (only you can see)</option>
                <option value="published">Live (anyone can access)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Internal Notes
                <HelpTooltip text="Optional notes for your reference. Quiz takers won't see this." />
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 'For Twitter ad campaign'"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Questions ({questions.length})</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInternalIds}
                  onChange={(e) => setShowInternalIds(e.target.checked)}
                  className="rounded"
                />
                Show internal IDs
              </label>
              <button
                onClick={addQuestion}
                className="px-4 py-1.5 rounded-lg text-sm bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-colors"
              >
                + Add Question
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const isExpanded = expandedQ === i;
              const isScored = q.scoringWeight > 0;
              return (
                <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                  {/* Question header (collapsed) */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setExpandedQ(isExpanded ? null : i)}
                  >
                    <span className="text-gray-500 text-sm font-mono w-6">{i + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {q.type === 'multiple_choice' ? 'Choice' : q.type === 'email' ? 'Email' : 'Text'}
                    </span>
                    <span className="text-white flex-1 truncate">{q.question || '(empty question)'}</span>
                    {isScored ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                        Affects result
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-500/20 text-gray-500">
                        Info only
                      </span>
                    )}
                    <span className="text-gray-500">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                  </div>

                  {/* Expanded editor */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 bg-white/[0.02]">
                      <div className="grid grid-cols-3 gap-4">
                        {showAdvanced[i] && (
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Question ID
                              <HelpTooltip text="A unique identifier used behind the scenes. Auto-generated from your question text." />
                            </label>
                            <input
                              type="text"
                              value={q.questionKey}
                              onChange={(e) => updateQuestion(i, { questionKey: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Answer Type
                            <HelpTooltip text="Text = free typing. Email = email address input. Multiple Choice = pick from a list of options." />
                          </label>
                          <select
                            value={q.type}
                            onChange={(e) => updateQuestion(i, { type: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="text">Text (free typing)</option>
                            <option value="email">Email address</option>
                            <option value="multiple_choice">Multiple Choice</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Must answer?
                            <HelpTooltip text="If yes, quiz takers must answer this question before they can continue." />
                          </label>
                          <select
                            value={q.required ? 'yes' : 'no'}
                            onChange={(e) => updateQuestion(i, { required: e.target.value === 'yes' })}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="yes">Yes, required</option>
                            <option value="no">No, optional</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Question
                          <HelpTooltip text="This is what quiz takers see. Write it in the language of this quiz." />
                        </label>
                        <textarea
                          value={q.question}
                          onChange={(e) => autoGenerateKey(i, e.target.value)}
                          rows={2}
                          placeholder="e.g. What's your biggest trading challenge?"
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {(q.type === 'text' || q.type === 'email') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Example text
                            <HelpTooltip text="Gray text shown inside the input before they type. Gives users a hint of what to enter (e.g., 'John' for a name field)." />
                          </label>
                          <input
                            type="text"
                            value={q.placeholder}
                            onChange={(e) => updateQuestion(i, { placeholder: e.target.value })}
                            placeholder="e.g. John"
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      {/* Options editor (multiple choice) */}
                      {q.type === 'multiple_choice' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-2">
                            Answer Options
                            <HelpTooltip text="These are the choices quiz takers can pick from. The answer text is what they see." />
                          </label>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs w-5">{oi + 1}.</span>
                                {showInternalIds && (
                                  <input
                                    type="text"
                                    value={opt.value}
                                    onChange={(e) => updateOption(i, oi, 'value', e.target.value)}
                                    placeholder="internal_id"
                                    className="w-36 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                                  />
                                )}
                                <input
                                  type="text"
                                  value={opt.label}
                                  onChange={(e) => updateOption(i, oi, 'label', e.target.value)}
                                  placeholder="Answer text (what users see)"
                                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => removeOption(i, oi)}
                                  className="text-red-400 hover:text-red-300 text-sm px-1"
                                  title="Remove this answer"
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
                            + Add answer option
                          </button>
                        </div>
                      )}

                      {/* Scoring config — simplified */}
                      {q.type === 'multiple_choice' && (
                        <div className="border-t border-white/10 pt-4">
                          <div className="flex items-center gap-3 mb-3">
                            <label className="text-xs font-medium text-gray-400">
                              Does this question affect the personality result?
                            </label>
                            <select
                              value={isScored ? 'yes' : 'no'}
                              onChange={(e) => setScoringEnabled(i, e.target.value === 'yes')}
                              className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                              <option value="no">No — info only</option>
                              <option value="yes">Yes — affects the result</option>
                            </select>
                          </div>

                          {isScored && (
                            <>
                              <div className="flex items-center gap-3 mb-4">
                                <label className="text-xs font-medium text-gray-400">
                                  How important is this question?
                                  <HelpTooltip text="Primary = most important for determining the result. Secondary = supports the primary. Minor = small influence." />
                                </label>
                                <select
                                  value={getImportanceFromWeight(q.scoringWeight)}
                                  onChange={(e) => setScoringImportance(i, e.target.value)}
                                  className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                >
                                  <option value="primary">Primary (most important)</option>
                                  <option value="secondary">Secondary</option>
                                  <option value="minor">Minor</option>
                                </select>
                              </div>

                              <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-xs font-medium text-gray-400 mb-3">
                                  For each answer, which personality type does it suggest?
                                  <HelpTooltip text="When someone picks this answer, it adds points toward the selected personality type. Higher points = stronger signal." />
                                </p>
                                <div className="space-y-3">
                                  {q.options.map((opt) => {
                                    const currentType = getAnswerPersonalityType(q, opt.value);
                                    const currentPoints = getAnswerPoints(q, opt.value);
                                    return (
                                      <div key={opt.value} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-300 min-w-[140px] truncate" title={opt.label}>
                                          {opt.label}
                                        </span>
                                        <span className="text-gray-600 text-xs">suggests</span>
                                        <select
                                          value={currentType}
                                          onChange={(e) => {
                                            const newType = e.target.value;
                                            if (newType === '') {
                                              updateAnswerScoring(i, opt.value, '', 0);
                                            } else {
                                              updateAnswerScoring(i, opt.value, newType, currentPoints);
                                            }
                                          }}
                                          className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                        >
                                          <option value="">None (no effect)</option>
                                          {PERSONALITY_TYPES.map((pt) => (
                                            <option key={pt.key} value={pt.key}>{pt.label}</option>
                                          ))}
                                        </select>
                                        {currentType && (
                                          <>
                                            <span className="text-gray-600 text-xs">with</span>
                                            <input
                                              type="number"
                                              min={1}
                                              max={5}
                                              value={currentPoints}
                                              onChange={(e) => {
                                                const pts = parseInt(e.target.value) || 1;
                                                updateAnswerScoring(i, opt.value, currentType, pts);
                                              }}
                                              className="w-14 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-blue-500"
                                            />
                                            <span className="text-gray-600 text-xs">points</span>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

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
                        <button
                          onClick={() => duplicateQuestion(i)}
                          className="px-3 py-1 rounded text-sm bg-white/10 text-white hover:bg-white/20"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => setShowAdvanced((prev) => ({ ...prev, [i]: !prev[i] }))}
                          className="px-3 py-1 rounded text-sm bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
                        >
                          {showAdvanced[i] ? 'Hide Advanced' : 'Advanced'}
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => removeQuestion(i)}
                          className="px-3 py-1 rounded text-sm bg-red-600/20 text-red-400 hover:bg-red-600/40"
                        >
                          Delete
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
            {saving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>
    </main>
  );
}
