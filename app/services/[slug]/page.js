import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { data: service } = await supabase
    .from('services')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} | MF Sports Injury Rehab`,
    description: service.description || `Learn about ${service.title} at MF Sports Injury Rehab in Yagoona, Sydney.`,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!service) notFound();

  const bookingLink = service.booking_link || 'https://mf-sports-injury-rehab.au2.cliniko.com/bookings#service';

  return (
    <main>
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-4xl mx-auto">
        <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-accent transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Services
        </Link>

        {service.image_url && (
          <div className="rounded-2xl overflow-hidden h-72 mb-10">
            <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Service</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{service.title}</h1>

        {service.description && (
          <p className="text-slate-300 text-lg leading-relaxed mb-10">{service.description}</p>
        )}

        <a
          href={bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-navy-deep font-semibold px-8 py-4 rounded-full text-lg hover:bg-accent-light transition-colors"
        >
          Book This Service
        </a>
      </section>
      <Footer />
    </main>
  );
}
