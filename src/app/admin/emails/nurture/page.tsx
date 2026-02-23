'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToastContainer, { showToast } from '@/components/admin/Toast';

interface NurtureTemplate {
  id: string;
  personalityType: string;
  emailNumber: number;
  locale: string;
  subject: string;
  body: string;
  updatedAt: string;
}

const PERSONALITY_LABELS: Record<string, string> = {
  emotional_trader: 'Emotional Trader',
  time_starved_trader: 'Time-Starved Trader',
  inconsistent_executor: 'Inconsistent Executor',
  overwhelmed_analyst: 'Overwhelmed Analyst',
};

const PERSONALITY_ORDER = [
  'emotional_trader',
  'time_starved_trader',
  'inconsistent_executor',
  'overwhelmed_analyst',
];

export default function NurtureSequencesPage() {
  const [templates, setTemplates] = useState<NurtureTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState<'en' | 'ru'>('en');
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/nurture-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      } else {
        showToast('Failed to load templates', 'error');
      }
    } catch {
      showToast('Failed to load templates', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (template: NurtureTemplate) => {
    setEditingId(template.id);
    setEditSubject(template.subject);
    setEditBody(template.body);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditSubject('');
    setEditBody('');
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/nurture-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, subject: editSubject, body: editBody }),
      });

      if (res.ok) {
        showToast('Template saved successfully', 'success');
        setEditingId(null);
        // Update local state
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, subject: editSubject, body: editBody } : t
          )
        );
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save template', 'error');
      }
    } catch {
      showToast('Failed to save template', 'error');
    }
    setSaving(false);
  };

  const filteredByLocale = templates.filter((t) => t.locale === activeLocale);

  const getTemplatesForType = (personalityType: string) =>
    filteredByLocale
      .filter((t) => t.personalityType === personalityType)
      .sort((a, b) => a.emailNumber - b.emailNumber);

  return (
    <div className="min-h-screen p-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/emails"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Email Campaigns
          </Link>
          <span className="text-gray-600">/</span>
          <h1 className="text-3xl font-bold text-white">Nurture Sequences</h1>
        </div>

        <p className="text-gray-400 mb-8">
          Edit the automated nurture emails sent to quiz takers. Changes apply only to{' '}
          <strong className="text-white">pending (unsent)</strong> emails — already-sent emails are
          unaffected. Use <code className="bg-gray-800 px-1 rounded text-blue-300">{'{{firstName}}'}</code>{' '}
          as a placeholder for the recipient's name.
        </p>

        {/* Locale Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {(['en', 'ru'] as const).map((locale) => (
            <button
              key={locale}
              onClick={() => {
                setActiveLocale(locale);
                setEditingId(null);
                setExpandedType(null);
              }}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeLocale === locale
                  ? 'text-white border-b-2 border-blue-400 -mb-px'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {locale === 'en' ? '🇬🇧 English' : '🇷🇺 Russian'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-gray-400 py-12 text-center">Loading templates…</div>
        ) : (
          <div className="space-y-4">
            {PERSONALITY_ORDER.map((personalityType) => {
              const typeTemplates = getTemplatesForType(personalityType);
              const isExpanded = expandedType === personalityType;

              return (
                <div
                  key={personalityType}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                >
                  {/* Section header */}
                  <button
                    onClick={() =>
                      setExpandedType(isExpanded ? null : personalityType)
                    }
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold text-lg">
                        {PERSONALITY_LABELS[personalityType] ?? personalityType}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                        {typeTemplates.length} emails
                      </span>
                    </div>
                    <span className="text-gray-400 text-xl">{isExpanded ? '−' : '+'}</span>
                  </button>

                  {/* Email rows */}
                  {isExpanded && (
                    <div className="border-t border-gray-800 divide-y divide-gray-800">
                      {typeTemplates.map((template) => {
                        const isEditing = editingId === template.id;
                        return (
                          <div key={template.id} className="px-6 py-4">
                            {isEditing ? (
                              /* ── Editor ── */
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-blue-400 font-medium text-sm">
                                    Email {template.emailNumber}
                                  </span>
                                  <span className="text-gray-500 text-sm">— editing</span>
                                </div>

                                {/* Subject */}
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                                    Subject
                                  </label>
                                  <input
                                    type="text"
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Email subject…"
                                  />
                                </div>

                                {/* Body */}
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                                    Body (HTML)
                                  </label>
                                  <textarea
                                    value={editBody}
                                    onChange={(e) => setEditBody(e.target.value)}
                                    rows={20}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500 resize-y"
                                    placeholder="Full HTML email body…"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Use{' '}
                                    <code className="bg-gray-800 px-1 rounded text-blue-300">
                                      {'{{firstName}}'}
                                    </code>{' '}
                                    where the recipient's name should appear.
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleSave(template.id)}
                                    disabled={saving}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                                  >
                                    {saving ? 'Saving…' : 'Save'}
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* ── Row ── */
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                  <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 text-sm font-bold">
                                    {template.emailNumber}
                                  </span>
                                  <span className="text-gray-200 text-sm truncate">
                                    {template.subject}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleEdit(template)}
                                  className="shrink-0 px-4 py-1.5 text-sm text-blue-400 border border-blue-800 hover:bg-blue-900/30 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
