import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2 } from 'lucide-react';

export default async function Conditions() {
  const { data: conditions } = await supabase
    .from('conditions')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
          We Can Help
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Conditions We Treat</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We're committed to helping our clients overcome pain and improve their quality of
          life with effective, evidence-based treatment.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {(conditions || []).map((condition) => (
          <div
            key={condition.id}
            className="flex items-center gap-3 bg-navy-light rounded-xl px-5 py-4 animate-fade-up"
          >
            <CheckCircle2 className="text-accent shrink-0" size={20} />
            <span className="text-slate-200 font-medium">{condition.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
