'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';


function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function ServicesAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [services, setServices] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    setServices(data || []);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const updateField = (id, field, value) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (service) => {
    setSavingId(service.id);
    await supabase
      .from('services')
      .update({
        title: service.title,
        slug: service.slug,
        description: service.description,
        image_url: service.image_url,
        booking_link: service.booking_link,
        display_order: service.display_order,
      })
      .eq('id', service.id);
    setSavingId(null);
  };

  const handleAdd = async () => {
    const title = 'New Service';
    const slug = slugify(title) + '-' + Date.now().toString().slice(-4);
    const { data } = await supabase
      .from('services')
      .insert([{ title, slug, display_order: services.length + 1 }])
      .select()
      .single();
    setServices([...services, data]);
    setExpandedId(data.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    await supabase.from('services').delete().eq('id', id);
    setServices(services.filter((s) => s.id !== id));
  };

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Services</h1>
          <p className="text-slate-400">Add, edit, reorder or remove services.</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-5 py-2.5 rounded-full hover:bg-accent-light transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const expanded = expandedId === service.id;
          return (
            <div
              key={service.id}
              className="bg-navy-light rounded-2xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expanded ? null : service.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <span className="font-semibold">{service.title}</span>
                </div>
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {expanded && (
                <div className="p-5 pt-0 space-y-4 border-t border-white/5">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={service.title || ''}
                      onChange={(e) => updateField(service.id, 'title', e.target.value)}
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      URL Slug (used in page link)
                    </label>
                    <input
                      type="text"
                      value={service.slug || ''}
                      onChange={(e) => updateField(service.id, 'slug', slugify(e.target.value))}
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={service.description || ''}
                      onChange={(e) => updateField(service.id, 'description', e.target.value)}
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Image</label>
                    <ImageUploader
                      currentUrl={service.image_url}
                      folder="services"
                      onUploaded={(url) => updateField(service.id, 'image_url', url)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Booking Link</label>
                    <input
                      type="text"
                      value={service.booking_link || ''}
                      onChange={(e) => updateField(service.id, 'booking_link', e.target.value)}
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSave(service)}
                      disabled={savingId === service.id}
                      className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-5 py-2.5 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60"
                    >
                      {savingId === service.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold px-5 py-2.5 rounded-full hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
