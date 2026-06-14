'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2, Plus, Loader2 } from 'lucide-react';


export default function InsuranceAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [logos, setLogos] = useState([]);
  const [newName, setNewName] = useState('');
  const [pendingUrl, setPendingUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('insurance_logos').select('*').order('display_order');
    setLogos(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!pendingUrl) return;
    setAdding(true);
    await supabase.from('insurance_logos').insert([{
      name: newName,
      image_url: pendingUrl,
      display_order: logos.length + 1,
    }]);
    setNewName('');
    setPendingUrl('');
    await fetch();
    setAdding(false);
  };

  const handleDelete = async (id, url) => {
    if (!confirm('Delete this logo?')) return;
    const path = url.split('/site-images/')[1];
    if (path) await supabase.storage.from('site-images').remove([path]);
    await supabase.from('insurance_logos').delete().eq('id', id);
    setLogos(logos.filter(l => l.id !== id));
  };

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Insurance Logos</h1>
      <p className="text-slate-400 mb-8">Upload insurance provider logos shown on the website.</p>

      {/* Add new */}
      <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl mb-10 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Add Logo</h2>
        <div>
          <label className="block text-sm text-slate-300 mb-2">Insurance Provider Name</label>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Bupa"
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-2">Logo Image</label>
          <ImageUploader folder="insurance" onUploaded={url => setPendingUrl(url)} />
        </div>
        {pendingUrl && (
          <button onClick={handleAdd} disabled={adding}
            className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {adding ? 'Adding...' : 'Add Logo'}
          </button>
        )}
      </div>

      {/* Logos grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {logos.map(logo => (
          <div key={logo.id} className="group bg-navy-light rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-3">
            <img src={logo.image_url} alt={logo.name} className="h-12 object-contain" />
            {logo.name && <p className="text-slate-400 text-xs text-center">{logo.name}</p>}
            <button onClick={() => handleDelete(logo.id, logo.image_url)}
              className="text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
