import { supabase } from '@/lib/supabaseClient';
import { Star } from 'lucide-react';

export default async function Reviews() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-up">
        <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">What Our Clients Say</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-navy-light rounded-2xl p-6 border border-white/5 animate-fade-up"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? 'fill-accent text-accent' : 'text-slate-600'}
                />
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              "{review.review_text}"
            </p>
            <p className="text-white font-semibold text-sm">{review.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
