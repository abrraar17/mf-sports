import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Services() {
  const { data: services } = await supabase.from('services').select('*').order('display_order', { ascending: true });

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">What We Offer</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Services at MF Sports Injury Rehab</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(services || []).map((service) => (
          <Link key={service.id} href={`/services/${service.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-accent/40 hover:shadow-lg transition-all">
            {service.image_url && (
              <div className="h-48 overflow-hidden">
                <img src={service.image_url} alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-gray-900 font-semibold text-lg mb-2">{service.title}</h3>
              {service.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
              )}
              <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold">
                Learn more <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
