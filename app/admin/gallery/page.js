import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gallery | MF Sports Injury Rehab',
};

export default async function GalleryPage() {
  const { data: items } = await supabase.from('gallery').select('*').order('display_order', { ascending: true });
  const images = (items || []).filter(i => i.media_type === 'image');
  const videos = (items || []).filter(i => i.media_type === 'video');

  return (
    <main className="bg-white">
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Inside the Clinic</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Gallery</h1>
        </div>

        {videos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="aspect-video">
                    <iframe src={video.url} title={video.caption || 'Video'} className="w-full h-full" allowFullScreen />
                  </div>
                  {video.caption && <p className="text-gray-500 text-sm p-4">{video.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image) => (
                <div key={image.id} className="break-inside-avoid rounded-2xl overflow-hidden border border-gray-200">
                  <img src={image.url} alt={image.caption || 'Gallery image'} className="w-full object-cover" />
                  {image.caption && <p className="text-gray-500 text-sm p-3 bg-gray-50">{image.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400"><p>Photos coming soon.</p></div>
        )}
      </section>
      <Footer />
    </main>
  );
}
