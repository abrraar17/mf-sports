'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';


export default function AboutAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [about, setAbout] = useState(null);
  const [team, setTeam] = useState([]);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savedAbout, setSavedAbout] = useState(false);
  const [savingMemberId, setSavingMemberId] = useState(null);

  useEffect(() => {
    supabase.from('about').select('*').single().then(({ data }) => setAbout(data));
    supabase.from('team_members').select('*').order('display_order').then(({ data }) => setTeam(data || []));
  }, []);

  const saveAbout = async () => {
    setSavingAbout(true);
    await supabase.from('about').update({ ...about, updated_at: new Date().toISOString() }).eq('id', about.id);
    setSavingAbout(false);
    setSavedAbout(true);
    setTimeout(() => setSavedAbout(false), 2000);
  };

  const updateMember = (id, field, value) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const saveMember = async (member) => {
    setSavingMemberId(member.id);
    await supabase.from('team_members').update({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image_url: member.image_url,
      display_order: member.display_order,
    }).eq('id', member.id);
    setSavingMemberId(null);
  };

  const addMember = async () => {
    const { data } = await supabase
      .from('team_members')
      .insert([{ name: 'New Team Member', role: '', bio: '', display_order: team.length + 1 }])
      .select().single();
    setTeam([...team, data]);
  };

  const deleteMember = async (id) => {
    if (!confirm('Delete this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    setTeam(team.filter(m => m.id !== id));
  };

  if (authLoading || !about) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">About / Team</h1>
      <p className="text-slate-400 mb-8">Edit the about section content and manage team members.</p>

      {/* About section */}
      <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-2xl mb-10 space-y-5">
        <h2 className="text-lg font-semibold text-white">About Section</h2>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Section Title</label>
          <input type="text" value={about.title || ''} onChange={e => setAbout({ ...about, title: e.target.value })}
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Content</label>
          <textarea rows={4} value={about.content || ''} onChange={e => setAbout({ ...about, content: e.target.value })}
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Founder Name</label>
          <input type="text" value={about.founder_name || ''} onChange={e => setAbout({ ...about, founder_name: e.target.value })}
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Founder Role</label>
          <input type="text" value={about.founder_role || ''} onChange={e => setAbout({ ...about, founder_role: e.target.value })}
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Founder Bio</label>
          <textarea rows={3} value={about.founder_bio || ''} onChange={e => setAbout({ ...about, founder_bio: e.target.value })}
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Founder Photo</label>
          <ImageUploader currentUrl={about.founder_image_url} folder="team"
            onUploaded={url => setAbout({ ...about, founder_image_url: url })} />
        </div>

        <button onClick={saveAbout} disabled={savingAbout}
          className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
          {savingAbout ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {savingAbout ? 'Saving...' : 'Save About'}
        </button>
        {savedAbout && <p className="text-accent text-sm">Saved!</p>}
      </div>

      {/* Team members */}
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Team Members</h2>
          <button onClick={addMember}
            className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-4 py-2 rounded-full hover:bg-accent-light transition-colors text-sm">
            <Plus size={14} /> Add Member
          </button>
        </div>

        <div className="space-y-6">
          {team.map(member => (
            <div key={member.id} className="bg-navy-light rounded-2xl p-6 border border-white/5 space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Name</label>
                <input type="text" value={member.name || ''} onChange={e => updateMember(member.id, 'name', e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Role</label>
                <input type="text" value={member.role || ''} onChange={e => updateMember(member.id, 'role', e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Bio</label>
                <textarea rows={3} value={member.bio || ''} onChange={e => updateMember(member.id, 'bio', e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Photo</label>
                <ImageUploader currentUrl={member.image_url} folder="team"
                  onUploaded={url => updateMember(member.id, 'image_url', url)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => saveMember(member)} disabled={savingMemberId === member.id}
                  className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-5 py-2.5 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60 text-sm">
                  {savingMemberId === member.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
                <button onClick={() => deleteMember(member.id)}
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold px-5 py-2.5 rounded-full hover:bg-red-500/10 transition-colors text-sm">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
