import { supabase } from '@/lib/supabaseClient';
import { Phone, Mail, MapPin, Clock, Car } from 'lucide-react';
import ContactForm from './ContactForm';

export default async function Contact() {
  const { data: contact } = await supabase.from('contact_info').select('*').single();

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Have Anything to Ask? Let's Talk</h2>
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

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
