import { supabase } from '@/lib/supabaseClient';

export default async function Reviews() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('display_order', { ascending: true });

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
            Client Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="break-inside-avoid rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              {review.media_type === 'video' ? (
                <div className="aspect-video">
                  <iframe
                    src={review.media_url}
                    title={review.caption || 'Client review'}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={review.media_url}
                  alt={review.caption || 'Client review'}
                  className="w-full object-cover"
                />
              )}
              {review.caption && (
                <p className="text-gray-500 text-sm p-4">{review.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
