import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default async function Footer() {
  const { data: services } = await supabase.from('services').select('title, slug').order('display_order', { ascending: true });
  const { data: contact } = await supabase.from('contact_info').select('*').single();

  return (
    <footer style={{ backgroundColor: '#111111' }} className="text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <img src="/images/logo.png" alt="MF Sports Injury Rehab" className="h-14 object-contain mb-4" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Expert sports injury rehab, remedial massage and recovery therapy in Yagoona, Sydney.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Quick Links</p>
          <div className="flex flex-col gap-2 text-sm">
            {[['/', 'Home'], ['/about', 'About Us'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} className="text-gray-400 hover:text-red-500 transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Services</p>
          <div className="flex flex-col gap-2 text-sm">
            {(services || []).slice(0, 6).map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="text-gray-400 hover:text-red-500 transition-colors">{s.title}</Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Contact Us</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <p>{contact?.phone_1}</p>
            <p>{contact?.email}</p>
            <p>{contact?.address}</p>
            <p>{contact?.hours_weekdays}</p>
            <p>{contact?.hours_friday}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 text-center text-gray-500 text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        © {new Date().getFullYear()} MF Sports Injury Rehab. All rights reserved.
      </div>
    </footer>
  );
}
