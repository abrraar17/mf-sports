import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 0;

export const metadata = {
  title: 'Gallery | MF Sports Injury Rehab',
  description: 'See our clinic, team and treatments at MF Sports Injury Rehab in Yagoona, Sydney.',
};

export default async function GalleryPage() {
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true });

  const images = (items || []).filter(i => i.media_type === 'image');
  const videos = (items || []).filter(i => i.media_type === 'video');

  return (
    <main>
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Inside the Clinic</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Gallery</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Take a look inside MF Sports Injury Rehab — our facilities, team, and treatments.
          </p>
        </div>

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="rounded-2xl overflow-hidden bg-navy-light border border-white/5">
                  <div className="aspect-video">
                    <iframe
                      src={video.url}
                      title={video.caption || 'Video'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {video.caption && (
                    <p className="text-slate-400 text-sm p-4">{video.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Photos</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image) => (
                <div key={image.id} className="break-inside-avoid rounded-2xl overflow-hidden border border-white/5">
                  <img
                    src={image.url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full object-cover"
                  />
                  {image.caption && (
                    <p className="text-slate-400 text-sm p-3 bg-navy-light">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p>Photos coming soon.</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
