'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import { Save, Loader2 } from 'lucide-react';


export default function ContactInfoAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [contact, setContact] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('contact_info').select('*').single().then(({ data }) => setContact(data));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('contact_info').update({
      phone_1: contact.phone_1,
      phone_2: contact.phone_2,
      email: contact.email,
      address: contact.address,
      hours_weekdays: contact.hours_weekdays,
      hours_friday: contact.hours_friday,
      map_embed_url: contact.map_embed_url,
      updated_at: new Date().toISOString(),
    }).eq('id', contact.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (authLoading || !contact) return <div className="text-white p-8">Loading...</div>;

  const field = (label, key, placeholder = '') => (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>
      <input type="text" value={contact[key] || ''} onChange={e => setContact({ ...contact, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
    </div>
  );

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Contact Info</h1>
      <p className="text-slate-400 mb-8">Update the clinic's contact details shown across the website.</p>

      <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl space-y-5">
        {field('Phone 1', 'phone_1', '0492 996 268')}
        {field('Phone 2 (optional)', 'phone_2')}
        {field('Email', 'email', 'mfsportsinjuryrehab1@gmail.com')}
        {field('Address', 'address', '680, Hume Highway, Yagoona, NSW 2199')}
        {field('Hours (Weekdays)', 'hours_weekdays', 'All days 12pm to 9pm')}
        {field('Hours (Friday)', 'hours_friday', 'Friday 4:00pm to 9pm')}

        <div>
          <label className="block text-sm text-slate-300 mb-2">Google Maps Embed URL</label>
          <textarea rows={3} value={contact.map_embed_url || ''}
            onChange={e => setContact({ ...contact, map_embed_url: e.target.value })}
            placeholder="Paste the Google Maps embed URL here"
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none text-sm" />
          <p className="text-slate-500 text-xs mt-1">Go to Google Maps → Share → Embed a map → copy the src URL from the iframe code</p>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <p className="text-accent text-sm">Saved successfully!</p>}
      </div>
    </AdminShell>
  );
}
