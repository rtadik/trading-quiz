'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contact {
  id: string;
  email: string;
  firstName: string;
  personalityType: string;
  experienceLevel: string;
  performance: string;
  automationExperience: string;
  createdAt: string;
  emails: { emailNumber: number; status: string; scheduledAt: string; sentAt: string | null }[];
}

const TYPE_LABELS: Record<string, string> = {
  emotional_trader: ' Emotional',
  time_starved_trader: ' Time-Starved',
  inconsistent_executor: ' Inconsistent',
  overwhelmed_analyst: ' Overwhelmed',
};

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function SubmissionsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('');
  const [automationFilter, setAutomationFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (typeFilter) params.set('type', typeFilter);
    if (experienceFilter) params.set('experience', experienceFilter);
    if (performanceFilter) params.set('performance', performanceFilter);
    if (automationFilter) params.set('automation', automationFilter);
    if (search) params.set('search', search);

    fetch(`/api/admin/submissions?${params}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setContacts(data.contacts);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [page, typeFilter, experienceFilter, performanceFilter, automationFilter, search, router]);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Submissions ({total})
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:border-blue-500 transition-all placeholder:text-gray-500 w-64"
          />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="emotional_trader">🔥 Emotional Trader</option>
            <option value="time_starved_trader">⏰ Time-Starved Trader</option>
            <option value="inconsistent_executor">🎯 Inconsistent Executor</option>
            <option value="overwhelmed_analyst">🧠 Overwhelmed Analyst</option>
          </select>
          <select
            value={experienceFilter}
            onChange={(e) => { setExperienceFilter(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Experience</option>
            <option value="beginner">Beginner (&lt;6 months)</option>
            <option value="intermediate">Intermediate (6mo-2yr)</option>
            <option value="experienced">Experienced (2+ years)</option>
          </select>
          <select
            value={performanceFilter}
            onChange={(e) => { setPerformanceFilter(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Performance</option>
            <option value="struggling">Struggling</option>
            <option value="breaking_even">Breaking Even</option>
            <option value="inconsistent_profit">Inconsistent Profit</option>
            <option value="undisclosed">Undisclosed</option>
          </select>
          <select
            value={automationFilter}
            onChange={(e) => { setAutomationFilter(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Automation</option>
            <option value="automation_newbie">Newbie (Never tried)</option>
            <option value="automation_skeptic">Skeptic (Didn&apos;t work)</option>
            <option value="automation_ready">Ready (Interested)</option>
            <option value="automation_user">User (Currently using)</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Name</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Email</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Type</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Experience</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Performance</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Automation</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Emails</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-8">Loading...</td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-8">No submissions found</td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const sentCount = contact.emails.filter((e) => e.status === 'sent').length;
                    const totalEmails = contact.emails.length;
                    return (
                      <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white">{contact.firstName}</td>
                        <td className="px-4 py-3 text-gray-300">{contact.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-gray-300">{TYPE_LABELS[contact.personalityType] || contact.personalityType}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 capitalize">{contact.experienceLevel}</td>
                        <td className="px-4 py-3 text-gray-400">{contact.performance.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-gray-400">{contact.automationExperience.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {contact.emails.map((email) => (
                              <div
                                key={email.emailNumber}
                                className={`w-5 h-5 rounded text-xs flex items-center justify-center ${STATUS_COLORS[email.status] || 'bg-gray-500/20 text-gray-400'}`}
                                title={`Email ${email.emailNumber}: ${email.status}`}
                              >
                                {email.emailNumber}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{sentCount}/{totalEmails} sent</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-gray-400 hover:text-white disabled:opacity-30 text-sm"
              >
                Previous
              </button>
              <span className="text-gray-500 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-gray-400 hover:text-white disabled:opacity-30 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
