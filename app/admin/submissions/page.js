'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import { Trash2, Mail, Phone, CheckCircle } from 'lucide-react';

export default function SubmissionsAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [submissions, setSubmissions] = useState([]);

  const fetch = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id) => {
    await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true } : s));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission?')) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    setSubmissions(submissions.filter(s => s.id !== id));
  };

  const unread = submissions.filter(s => !s.is_read).length;

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">Form Submissions</h1>
        {unread > 0 && (
          <span className="bg-accent text-navy-deep text-xs font-bold px-2.5 py-1 rounded-full">{unread} new</span>
        )}
      </div>
      <p className="text-slate-400 mb-8">Messages submitted through the website contact form.</p>

      {submissions.length === 0 ? (
        <p className="text-slate-500">No submissions yet.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {submissions.map(sub => (
            <div key={sub.id}
              className={`rounded-2xl p-5 border transition-colors ${sub.is_read ? 'bg-navy-light border-white/5' : 'bg-navy-light border-accent/30'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold flex items-center gap-2">
                    {sub.first_name}
                    {!sub.is_read && <span className="w-2 h-2 bg-accent rounded-full inline-block" />}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {new Date(sub.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!sub.is_read && (
                    <button onClick={() => markRead(sub.id)} title="Mark as read"
                      className="text-accent hover:text-accent-light transition-colors">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(sub.id)}
                    className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm mb-3">
                <a href={`tel:${sub.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-accent transition-colors">
                  <Phone size={14} /> {sub.phone}
                </a>
                {sub.email && (
                  <a href={`mailto:${sub.email}`} className="flex items-center gap-2 text-slate-300 hover:text-accent transition-colors">
                    <Mail size={14} /> {sub.email}
                  </a>
                )}
              </div>

              {sub.message && (
                <p className="text-slate-400 text-sm bg-navy rounded-lg px-4 py-3">{sub.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
