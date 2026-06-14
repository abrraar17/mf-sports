'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';


export default function ConditionsAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [conditions, setConditions] = useState([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetch = async () => {
    const { data } = await supabase.from('conditions').select('*').order('display_order');
    setConditions(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    await supabase.from('conditions').insert([{ name: newName.trim(), display_order: conditions.length + 1 }]);
    setNewName('');
    await fetch();
    setAdding(false);
  };

  const handleUpdate = (id, value) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, name: value } : c));
  };

  const handleSave = async (condition) => {
    setSavingId(condition.id);
    await supabase.from('conditions').update({ name: condition.name }).eq('id', condition.id);
    setSavingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this condition?')) return;
    await supabase.from('conditions').delete().eq('id', id);
    setConditions(conditions.filter(c => c.id !== id));
  };

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Conditions Treated</h1>
      <p className="text-slate-400 mb-8">Manage the list of conditions shown on the website.</p>

      {/* Add new */}
      <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl mb-8">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Add New Condition</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. Wrist pain"
            className="flex-1 bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
          />
          <button onClick={handleAdd} disabled={adding || !newName.trim()}
            className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-5 py-2.5 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-w-xl space-y-3">
        {conditions.map(condition => (
          <div key={condition.id} className="flex items-center gap-3 bg-navy-light rounded-xl px-4 py-3 border border-white/5">
            <input
              type="text"
              value={condition.name}
              onChange={e => handleUpdate(condition.id, e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-white"
            />
            <button onClick={() => handleSave(condition)} disabled={savingId === condition.id}
              className="text-accent hover:text-accent-light transition-colors">
              {savingId === condition.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
            <button onClick={() => handleDelete(condition.id)}
              className="text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
