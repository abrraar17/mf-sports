'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import AdminShell from '@/components/admin/AdminShell';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2, Plus, Youtube } from 'lucide-react';

export default function ReviewsAdmin() {
  const { loading: authLoading } = useRequireAuth();
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('image');
  const [caption, setCaption] = useState('');
  const [pendingUrl, setPendingUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [adding, setAdding] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('reviews').select('*').order('display_order');
    setReviews(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleAddImage = async () => {
    if (!pendingUrl) return;
    setAdding(true);
    await supabase.from('reviews').insert([{
      media_url: pendingUrl,
      media_type: 'image',
      caption,
      display_order: reviews.length + 1,
    }]);
    setPendingUrl('');
    setCaption('');
    await fetch();
    setAdding(false);
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;
    setAdding(true);
    let embedUrl = videoUrl;
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
    await supabase.from('reviews').insert([{
      media_url: embedUrl,
      media_type: 'video',
      caption: videoCaption,
      display_order: reviews.length + 1,
    }]);
    setVideoUrl('');
    setVideoCaption('');
    await fetch();
    setAdding(false);
  };

  const handleDelete = async (id, url, type) => {
    if (!confirm('Delete this review?')) return;
    if (type === 'image') {
      const path = url.split('/site-images/')[1];
      if (path) await supabase.storage.from('site-images').remove([path]);
    }
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(reviews.filter(r => r.id !== id));
  };

  const images = reviews.filter(r => r.media_type === 'image');
  const videos = reviews.filter(r => r.media_type === 'video');

  if (authLoading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Reviews</h1>
      <p className="text-slate-400 mb-8">Upload screenshot reviews or add YouTube video testimonials.</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => setTab('image')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${tab === 'image' ? 'bg-accent text-white' : 'bg-navy-light text-slate-300 hover:text-white'}`}>
          Screenshot Reviews
        </button>
        <button onClick={() => setTab('video')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${tab === 'video' ? 'bg-accent text-white' : 'bg-navy-light text-slate-300 hover:text-white'}`}>
          <Youtube size={16} /> Video Reviews
        </button>
      </div>

      {tab === 'image' && (
        <div>
          <div className="bg-navy-light rounded-2xl p-6 border border-white/5 max-w-xl mb-8 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Upload Screenshot Review</h2>
            <ImageUploader folder="reviews" onUploaded={url => setPendingUrl(url)} />
            <div>
              <label className="block text-sm text-slate-300 mb-2">Caption (optional)</label>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="e.g. Google Review — 5 stars"
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
            </div>
            {pendingUrl && (
              <button onClick={handleAddImage} disabled={adding}
                className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
                <Plus size={16} /> {adding ? 'Adding...' : 'Add Review'}
              </button>
            )}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 max-w-4xl">
            {images.map(review => (
              <div key={review.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-white/5">
                <img src={review.media_url} alt={review.caption || ''} className="w-full object-cover" />
                {review.caption && <p className="text-slate-400 text-sm p-3 bg-navy-light">{review.caption}</p>}
                <button onClick={() => handleDelete(review.id, review.media_url, 'image')}
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
            <h2 className="text-sm font-semibold text-slate-300">Add YouTube Video Review</h2>
            <div>
              <label className="block text-sm text-slate-300 mb-2">YouTube URL</label>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Caption (optional)</label>
              <input type="text" value={videoCaption} onChange={e => setVideoCaption(e.target.value)}
                placeholder="e.g. John recovered from knee injury in 3 weeks"
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent" />
            </div>
            <button onClick={handleAddVideo} disabled={adding || !videoUrl.trim()}
              className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
              <Plus size={16} /> {adding ? 'Adding...' : 'Add Video'}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {videos.map(review => (
              <div key={review.id} className="bg-navy-light rounded-2xl overflow-hidden border border-white/5">
                <div className="aspect-video">
                  <iframe src={review.media_url} className="w-full h-full" allowFullScreen title={review.caption || 'Review'} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="text-slate-400 text-sm">{review.caption || 'No caption'}</p>
                  <button onClick={() => handleDelete(review.id, review.media_url, 'video')}
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