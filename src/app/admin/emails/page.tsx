'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category?: string;
  status: string;
}

interface UserSegment {
  type: string;
  label: string;
  count?: number;
}

export default function EmailAdminPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Email composition
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Recipient selection
  const [segmentType, setSegmentType] = useState<string>('all');
  const [personalityTypes, setPersonalityTypes] = useState<string[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);

  // UI states
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Available personality types
  const availableTypes = [
    'ANALYTICAL_TRADER',
    'AGGRESSIVE_TRADER',
    'CONSERVATIVE_TRADER',
    'ADAPTIVE_TRADER'
  ];

  // Load templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Update recipient count when segment changes
  useEffect(() => {
    updateRecipientCount();
  }, [segmentType, personalityTypes]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/email-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const updateRecipientCount = async () => {
    try {
      const params = new URLSearchParams({
        segmentType,
        personalityTypes: personalityTypes.join(',')
      });
      const res = await fetch(`/api/admin/recipients/count?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRecipientCount(data.count);
      }
    } catch (error) {
      console.error('Failed to get recipient count:', error);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSaveTemplate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTemplate,
          name: subject.substring(0, 50), // Use subject as name
          subject,
          body,
          status: 'draft'
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Template saved!' });
        fetchTemplates();
      } else {
        setMessage({ type: 'error', text: 'Failed to save template' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving template' });
    }
    setLoading(false);
  };

  const handleSendEmail = async () => {
    if (!subject || !body) {
      setMessage({ type: 'error', text: 'Subject and body are required' });
      return;
    }

    if (recipientCount === 0) {
      setMessage({ type: 'error', text: 'No recipients selected' });
      return;
    }

    const confirmed = confirm(
      `Send email to ${recipientCount} recipient(s)?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setSending(true);
    try {
      const res = await fetch('/api/admin/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          segmentType,
          segmentFilter: {
            personalityTypes: segmentType === 'personality_type' ? personalityTypes : undefined
          }
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Email sent to ${data.sentCount} recipients!`
        });
        // Clear form
        setSubject('');
        setBody('');
        setSelectedTemplate(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sending email' });
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Email Campaign Manager</h1>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/30 text-green-300 border border-green-500/30' : 'bg-red-900/30 text-red-300 border border-red-500/30'
            }`}
          >
            {message.text}
            <button onClick={() => setMessage(null)} className="float-right font-bold">×</button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Email Composer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selector */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">1. Choose Template (Optional)</h2>
              <select
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTemplate || ''}
                onChange={(e) => handleLoadTemplate(e.target.value)}
              >
                <option value="" className="bg-gray-800">Start from scratch</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id} className="bg-gray-800">
                    {template.name} - {template.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Composer */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">2. Compose Email</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject Line</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your email subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Body</label>
                  <textarea
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={16}
                    placeholder="Write your email here...&#10;&#10;You can use these variables:&#10;{{firstName}} - Recipient's first name&#10;{{personalityType}} - Their personality type&#10;{{email}} - Their email"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    HTML is supported. Use variables like {'{{firstName}}'} for personalization.
                  </p>
                </div>

                <button
                  onClick={handleSaveTemplate}
                  disabled={loading}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save as Template'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recipients & Actions */}
          <div className="space-y-6">
            {/* Recipient Selector */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">3. Select Recipients</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Segment Type</label>
                  <select
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={segmentType}
                    onChange={(e) => {
                      setSegmentType(e.target.value);
                      setPersonalityTypes([]);
                    }}
                  >
                    <option value="all" className="bg-gray-800">All Users</option>
                    <option value="personality_type" className="bg-gray-800">By Personality Type</option>
                  </select>
                </div>

                {segmentType === 'personality_type' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Personality Types</label>
                    <div className="space-y-2">
                      {availableTypes.map(type => (
                        <label key={type} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={personalityTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPersonalityTypes([...personalityTypes, type]);
                              } else {
                                setPersonalityTypes(personalityTypes.filter(t => t !== type));
                              }
                            }}
                            className="mr-2 w-4 h-4"
                          />
                          <span className="text-sm text-gray-300">{type.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <strong>{recipientCount}</strong> recipient(s) will receive this email
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">4. Send Email</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  {showPreview ? 'Hide Preview' : 'Preview Email'}
                </button>

                <button
                  onClick={handleSendEmail}
                  disabled={sending || !subject || !body || recipientCount === 0}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {sending ? 'Sending...' : `Send to ${recipientCount} Recipients`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPreview(false)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Email Preview</h3>
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500">Subject:</p>
                <p className="font-semibold">{subject || '(No subject)'}</p>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: body
                    .replace(/{{firstName}}/g, '<strong>[First Name]</strong>')
                    .replace(/{{personalityType}}/g, '<strong>[Personality Type]</strong>')
                    .replace(/{{email}}/g, '<strong>[Email]</strong>')
                }}
              />
              <button
                onClick={() => setShowPreview(false)}
                className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close Preview
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
