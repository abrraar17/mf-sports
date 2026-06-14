'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import { Plus, Trash2, Star } from 'lucide-react';


export default function ReviewsAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 5, review_text: '' });
  const [adding, setAdding] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.review_text.trim()) return;
    setAdding(true);
    await supabase.from('reviews').insert([form]);
    setForm({ name: '', rating: 5, review_text: '' });
    await fetch();
    setAdding(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(reviews.filter(r => r.id !== id));
  };

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Reviews</h1>
      <p className="text-slate-400 mb-8">Add or remove client testimonials shown on the website.</p>

      {/* Add new */}
      <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl mb-10 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Add New Review</h2>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Client Name</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. John Smith"
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setForm({ ...form, rating: n })}>
                <Star size={24} className={n <= form.rating ? 'fill-accent text-accent' : 'text-slate-600'} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Review</label>
          <textarea rows={4} value={form.review_text} onChange={e => setForm({ ...form, review_text: e.target.value })}
            placeholder="Write the client's review here..."
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none" />
        </div>

        <button onClick={handleAdd} disabled={adding || !form.name.trim() || !form.review_text.trim()}
          className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
          <Plus size={16} /> {adding ? 'Adding...' : 'Add Review'}
        </button>
      </div>

      {/* Reviews list */}
      <div className="max-w-xl space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-navy-light rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-semibold">{review.name}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={14} className={n <= review.rating ? 'fill-accent text-accent' : 'text-slate-600'} />
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(review.id)} className="text-red-400 hover:text-red-300 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">"{review.review_text}"</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
