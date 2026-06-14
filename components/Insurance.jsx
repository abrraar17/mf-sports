import { supabase } from '@/lib/supabaseClient';

export default async function Insurance() {
  const { data: logos } = await supabase
    .from('insurance_logos')
    .select('*')
    .order('display_order', { ascending: true });

  if (!logos || logos.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 animate-fade-up">
        <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
          We Accept
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Private Health Insurances</h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        {logos.map((logo) => (
          <img
            key={logo.id}
            src={logo.image_url}
            alt={logo.name || 'Insurance logo'}
            className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </section>
  );
}
