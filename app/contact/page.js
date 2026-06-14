import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock, Car } from 'lucide-react';

export const revalidate = 0;
export const metadata = {
  title: 'Contact Us | MF Sports Injury Rehab',
  description: 'Get in touch with MF Sports Injury Rehab in Yagoona, Sydney. Call, email or send us a message.',
};

export default async function ContactPage() {
  const { data: contact } = await supabase.from('contact_info').select('*').single();

  return (
    <main>
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Reach Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Have a question or want to book an appointment? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="text-accent shrink-0 mt-1" size={22} />
              <div>
                <p className="text-white font-semibold mb-1">Phone</p>
                <a href={`tel:${contact?.phone_1}`} className="text-slate-300 hover:text-accent transition-colors block">
                  {contact?.phone_1 || '0492 996 268'}
                </a>
                {contact?.phone_2 && (
                  <a href={`tel:${contact.phone_2}`} className="text-slate-300 hover:text-accent transition-colors block">
                    {contact.phone_2}
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-accent shrink-0 mt-1" size={22} />
              <div>
                <p className="text-white font-semibold mb-1">Email</p>
                <a href={`mailto:${contact?.email}`} className="text-slate-300 hover:text-accent transition-colors">
                  {contact?.email || 'mfsportsinjuryrehab1@gmail.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-accent shrink-0 mt-1" size={22} />
              <div>
                <p className="text-white font-semibold mb-1">Address</p>
                <p className="text-slate-300">{contact?.address || '680, Hume Highway, Yagoona, NSW 2199'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-accent shrink-0 mt-1" size={22} />
              <div>
                <p className="text-white font-semibold mb-1">Hours</p>
                <p className="text-slate-300">{contact?.hours_weekdays}</p>
                <p className="text-slate-300">{contact?.hours_friday}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Car className="text-accent shrink-0 mt-1" size={22} />
              <div>
                <p className="text-white font-semibold mb-1">Parking</p>
                <p className="text-slate-300">On-site parking available</p>
              </div>
            </div>

            {/* Map */}
            {contact?.map_embed_url && (
              <div className="rounded-2xl overflow-hidden h-64 mt-4">
                <iframe
                  src={contact.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Clinic location"
                />
              </div>
            )}
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
