import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 0;
export const metadata = {
  title: 'About Us | MF Sports Injury Rehab',
  description: 'Meet the team at MF Sports Injury Rehab — expert sports therapists in Yagoona, Sydney.',
};

export default async function AboutPage() {
  const { data: about } = await supabase.from('about').select('*').single();
  const { data: team } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <main>
      <Navbar />
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {about?.title || 'About Us'}
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
            {about?.content || 'At MF Sports Injury Rehab, we\'re more than just physiotherapists — we\'re your partners in recovery and performance enhancement.'}
          </p>
        </div>

        {/* Founder */}
        <div className="bg-navy-light rounded-2xl p-8 md:p-12 mb-10 border border-white/5">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex justify-center">
              {about?.founder_image_url ? (
                <img
                  src={about.founder_image_url}
                  alt={about.founder_name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-accent/30"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-4xl border-4 border-accent/30">
                  {(about?.founder_name || 'MF').split(' ').map(w => w[0]).join('')}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">Founder</p>
              <h2 className="text-2xl font-bold text-white mb-1">{about?.founder_name || 'Mohammed Firdouse'}</h2>
              <p className="text-accent mb-4">{about?.founder_role || 'Sports Injury Therapist & Remedial Massage Therapist'}</p>
              <p className="text-slate-300 leading-relaxed">{about?.founder_bio || 'Trained as a physiotherapist overseas, then studied Remedial & Sports Massage Therapy in Sydney. Combines international training with local expertise.'}</p>
            </div>
          </div>
        </div>

        {/* Team */}
        {team && team.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.id} className="bg-navy-light rounded-2xl p-6 border border-white/5 text-center">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-accent/30" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-2xl mx-auto mb-4">
                      {member.name.split(' ').map(w => w[0]).join('')}
                    </div>
                  )}
                  <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                  <p className="text-accent text-sm mb-3">{member.role}</p>
                  {member.bio && <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
