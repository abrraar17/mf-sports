import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock, Car } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us | MF Sports Injury Rehab',
};

export default async function ContactPage() {
  const { data: contact } = await supabase.from('contact_info').select('*').single();

  return (
    <main className="bg-white">
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Reach Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Have a question or want to book an appointment? We're here to help.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { icon: Phone, label: 'Phone', values: [contact?.phone_1, contact?.phone_2].filter(Boolean) },
              { icon: Mail, label: 'Email', values: [contact?.email] },
              { icon: MapPin, label: 'Address', values: [contact?.address] },
              { icon: Clock, label: 'Hours', values: [contact?.hours_weekdays, contact?.hours_friday].filter(Boolean) },
              { icon: Car, label: 'Parking', values: ['On-site parking available'] },
            ].map(({ icon: Icon, label, values }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="bg-accent/10 p-2.5 rounded-xl">
                  <Icon className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold mb-1">{label}</p>
                  {values.map((v, i) => <p key={i} className="text-gray-500">{v}</p>)}
                </div>
              </div>
            ))}

            {contact?.map_embed_url && (
              <div className="rounded-2xl overflow-hidden h-64 border border-gray-200">
                <iframe src={contact.map_embed_url} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Clinic location" />
              </div>
            )}
          </div>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
