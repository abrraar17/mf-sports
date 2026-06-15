import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Services | MF Sports Injury Rehab',
  description: 'Explore our full range of sports injury and remedial therapy services in Yagoona, Sydney.',
};

export default async function ServicesPage() {
  const { data: services } = await supabase.from('services').select('*').order('display_order', { ascending: true });

  return (
    <main className="bg-white">
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">We offer a comprehensive range of sports injury rehabilitation and therapeutic services tailored to your recovery and performance goals.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services || []).map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-accent/40 hover:shadow-lg transition-all">
              {service.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-gray-900 font-semibold text-xl mb-2">{service.title}</h2>
                {service.description && <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.description}</p>}
                <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold">Learn more <ArrowRight size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
