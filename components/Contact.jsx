import { supabase } from '@/lib/supabaseClient';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from './ContactForm';

export default async function Contact() {
  const { data: contact } = await supabase.from('contact_info').select('*').single();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-up">
        <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
          Get In Touch
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Have Anything to Ask? Let's Talk
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6 animate-fade-up">
          <div className="flex items-start gap-4">
            <Phone className="text-accent shrink-0 mt-1" size={22} />
            <div>
              <p className="text-white font-semibold">Phone</p>
              <p className="text-slate-400">{contact?.phone_1 || '0492 996 268'}</p>
              {contact?.phone_2 && <p className="text-slate-400">{contact.phone_2}</p>}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="text-accent shrink-0 mt-1" size={22} />
            <div>
              <p className="text-white font-semibold">Email</p>
              <p className="text-slate-400">
                {contact?.email || 'mfsportsinjuryrehab1@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-accent shrink-0 mt-1" size={22} />
            <div>
              <p className="text-white font-semibold">Location</p>
              <p className="text-slate-400">
                {contact?.address || '680, Hume Highway, Yagoona, NSW 2199'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-accent shrink-0 mt-1" size={22} />
            <div>
              <p className="text-white font-semibold">Hours</p>
              <p className="text-slate-400">{contact?.hours_weekdays}</p>
              <p className="text-slate-400">{contact?.hours_friday}</p>
            </div>
          </div>

          {contact?.map_embed_url && (
            <div className="rounded-2xl overflow-hidden mt-6 h-64">
              <iframe
                src={contact.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Clinic location map"
              />
            </div>
          )}
        </div>

        {/* Form */}
        <div className="animate-fade-up">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
