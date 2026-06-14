'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2, Plus, Image as ImageIcon, Youtube } from 'lucide-react';


export default function GalleryAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('image'); // 'image' | 'video'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [addingVideo, setAddingVideo] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('gallery').select('*').order('display_order');
    setItems(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleImageUploaded = async (url) => {
    await supabase.from('gallery').insert([{
      media_type: 'image',
      url,
      display_order: items.length + 1,
    }]);
    await fetch();
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;
    setAddingVideo(true);
    // Convert youtube.com/watch?v=ID to embed URL
    let embedUrl = videoUrl;
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;

    await supabase.from('gallery').insert([{
      media_type: 'video',
      url: embedUrl,
      caption: videoCaption,
      display_order: items.length + 1,
    }]);
    setVideoUrl('');
    setVideoCaption('');
    await fetch();
    setAddingVideo(false);
  };

  const handleDelete = async (id, url, type) => {
    if (!confirm('Delete this item?')) return;
    if (type === 'image') {
      // Extract filename and delete from storage
      const path = url.split('/site-images/')[1];
      if (path) await supabase.storage.from('site-images').remove([path]);
    }
    await supabase.from('gallery').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
  };

  const images = items.filter(i => i.media_type === 'image');
  const videos = items.filter(i => i.media_type === 'video');

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Gallery</h1>
      <p className="text-slate-400 mb-8">Upload photos and add YouTube videos to the gallery.</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => setTab('image')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${tab === 'image' ? 'bg-accent text-navy-deep' : 'bg-navy-light text-slate-300 hover:text-white'}`}>
          <ImageIcon size={16} /> Photos
        </button>
        <button onClick={() => setTab('video')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${tab === 'video' ? 'bg-accent text-navy-deep' : 'bg-navy-light text-slate-300 hover:text-white'}`}>
          <Youtube size={16} /> Videos
        </button>
      </div>

      {tab === 'image' && (
        <div>
          <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl mb-8">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Upload Photo</h2>
            <ImageUploader folder="gallery" onUploaded={handleImageUploaded} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(item => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-white/5">
                <img src={item.url} alt={item.caption || ''} className="w-full h-48 object-cover" />
                <button onClick={() => handleDelete(item.id, item.url, 'image')}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'video' && (
        <div>
          <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl mb-8 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Add YouTube Video</h2>
            <div>
              <label className="block text-sm text-slate-300 mb-2">YouTube URL</label>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Caption (optional)</label>
              <input type="text" value={videoCaption} onChange={e => setVideoCaption(e.target.value)}
                placeholder="e.g. Dry needling session"
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
            </div>
            <button onClick={handleAddVideo} disabled={addingVideo || !videoUrl.trim()}
              className="inline-flex items-center gap-2 bg-accent text-navy-deep font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
              <Plus size={16} /> {addingVideo ? 'Adding...' : 'Add Video'}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {videos.map(item => (
              <div key={item.id} className="bg-navy-light rounded-2xl overflow-hidden border border-white/5">
                <div className="aspect-video">
                  <iframe src={item.url} className="w-full h-full" allowFullScreen title={item.caption || 'Video'} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="text-slate-400 text-sm">{item.caption || 'No caption'}</p>
                  <button onClick={() => handleDelete(item.id, item.url, 'video')}
                    className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
