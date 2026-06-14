import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default async function Footer() {
  const { data: services } = await supabase
    .from('services')
    .select('title, slug')
    .order('display_order', { ascending: true });

  const { data: contact } = await supabase.from('contact_info').select('*').single();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="text-white font-bold text-lg mb-3">
            MF Sports <span className="text-accent">Injury Rehab</span>
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your partners in recovery and performance enhancement. Expert sports injury rehab in
            Yagoona, Sydney.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Quick Links</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="text-slate-400 hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-slate-400 hover:text-accent transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-slate-400 hover:text-accent transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Services</p>
          <div className="flex flex-col gap-2 text-sm">
            {(services || []).slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="text-slate-400 hover:text-accent transition-colors"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Contact Us</p>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <p>{contact?.phone_1}</p>
            <p>{contact?.email}</p>
            <p>{contact?.address}</p>
            <p>{contact?.hours_weekdays}</p>
            <p>{contact?.hours_friday}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} MF Sports Injury Rehab. All rights reserved.
      </div>
    </footer>
  );
}
