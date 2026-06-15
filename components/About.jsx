import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default async function About() {
  const { data: about } = await supabase.from('about').select('*').single();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">About Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {about?.title || 'Your Partners in Recovery'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            {about?.content || "At MF Sports Injury Rehab, we're more than just physiotherapists—we're your partners in recovery and performance enhancement."}
          </p>
          <Link href="/about"
            className="inline-block border-2 border-accent text-accent font-semibold px-6 py-3 rounded-full hover:bg-accent hover:text-white transition-colors">
            Read More
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-4">
            {about?.founder_image_url ? (
              <img src={about.founder_image_url} alt={about?.founder_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-accent/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                {(about?.founder_name || 'MF').split(' ').map(w => w[0]).join('')}
              </div>
            )}
            <div>
              <p className="text-gray-900 font-semibold text-lg">{about?.founder_name || 'Mohammed Firdouse'}</p>
              <p className="text-accent text-sm">{about?.founder_role || 'Founder'}</p>
            </div>
          </div>
          {about?.founder_bio && (
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">{about.founder_bio}</p>
          )}
        </div>
      </div>
    </section>
  );
}
