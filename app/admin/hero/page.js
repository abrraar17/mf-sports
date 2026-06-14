'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

export default function HeroAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [hero, setHero] = useState(null);
  const [bgImages, setBgImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('hero').select('*').single().then(({ data }) => setHero(data));
    supabase.from('hero_images').select('*').order('display_order').then(({ data }) => setBgImages(data || []));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('hero').update({
      heading: hero.heading,
      subheading: hero.subheading,
      cta_text: hero.cta_text,
      cta_link: hero.cta_link,
      secondary_cta_text: hero.secondary_cta_text,
      secondary_cta_link: hero.secondary_cta_link,
      founder_image_url: hero.founder_image_url,
      founder_name: hero.founder_name,
      founder_role: hero.founder_role,
      stat_1_value: hero.stat_1_value,
      stat_1_label: hero.stat_1_label,
      stat_2_value: hero.stat_2_value,
      stat_2_label: hero.stat_2_label,
      stat_3_value: hero.stat_3_value,
      stat_3_label: hero.stat_3_label,
      updated_at: new Date().toISOString(),
    }).eq('id', hero.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddBgImage = async (url) => {
    const { data } = await supabase.from('hero_images').insert([{
      image_url: url,
      display_order: bgImages.length + 1,
    }]).select().single();
    setBgImages([...bgImages, data]);
  };

  const handleDeleteBgImage = async (id, url) => {
    if (!confirm('Delete this background image?')) return;
    const path = url.split('/site-images/')[1];
    if (path) await supabase.storage.from('site-images').remove([path]);
    await supabase.from('hero_images').delete().eq('id', id);
    setBgImages(bgImages.filter(img => img.id !== id));
  };

  if (authLoading || !hero) return <div className="text-white p-8">Loading...</div>;

  const field = (label, key, placeholder = '') => (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>
      <input type="text" value={hero[key] || ''} onChange={e => setHero({ ...hero, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
    </div>
  );

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Hero Section</h1>
      <p className="text-slate-400 mb-8">Edit the homepage banner — text, founder photo, background images and stats.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left — text fields */}
        <div className="space-y-5">
          <div className="bg-navy-light rounded-2xl p-6 border border-white/5 space-y-5">
            <h2 className="text-white font-semibold">Main Text</h2>
            {field('Heading', 'heading', 'Expert Physical Therapists You Can Trust')}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Subheading</label>
              <textarea rows={3} value={hero.subheading || ''} onChange={e => setHero({ ...hero, subheading: e.target.value })}
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Primary Button Text', 'cta_text', 'Book Now')}
              {field('Primary Button Link', 'cta_link')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Secondary Button Text', 'secondary_cta_text', 'Learn More')}
              {field('Secondary Button Link', 'secondary_cta_link', '/about')}
            </div>
          </div>

          <div className="bg-navy-light rounded-2xl p-6 border border-white/5 space-y-5">
            <h2 className="text-white font-semibold">Stats Bar</h2>
            <div className="grid grid-cols-2 gap-4">
              {field('Stat 1 Value', 'stat_1_value', 'Same Day')}
              {field('Stat 1 Label', 'stat_1_label', 'Appointment Possible')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Stat 2 Value', 'stat_2_value', 'One-on-One')}
              {field('Stat 2 Label', 'stat_2_label', 'Care')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Stat 3 Value', 'stat_3_value', '12PM–9PM')}
              {field('Stat 3 Label', 'stat_3_label', 'Open Daily')}
            </div>
          </div>

          <div className="bg-navy-light rounded-2xl p-6 border border-white/5 space-y-4">
            <h2 className="text-white font-semibold">Founder (Right Side Photo)</h2>
            {field('Founder Name', 'founder_name', 'Mohammed Firdouse')}
            {field('Founder Role', 'founder_role', 'Founder & Sports Injury Therapist')}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Founder Photo</label>
              <ImageUploader currentUrl={hero.founder_image_url} folder="hero"
                onUploaded={url => setHero({ ...hero, founder_image_url: url })} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          {saved && <p className="text-accent text-sm mt-2">Saved successfully!</p>}
        </div>

        {/* Right — background images */}
        <div className="bg-navy-light rounded-2xl p-6 border border-white/5 space-y-5 h-fit">
          <h2 className="text-white font-semibold">Background Slideshow Images</h2>
          <p className="text-slate-400 text-sm">Upload multiple images — they'll cycle automatically in the background.</p>

          <ImageUploader folder="hero-bg" onUploaded={handleAddBgImage} />

          <div className="grid grid-cols-2 gap-3 mt-4">
            {bgImages.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden">
                <img src={img.image_url} alt="" className="w-full h-28 object-cover" />
                <button onClick={() => handleDeleteBgImage(img.id, img.image_url)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {bgImages.length === 0 && (
              <p className="text-slate-500 text-sm col-span-2">No background images yet. Upload some above.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}