import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2 } from 'lucide-react';

export default async function Conditions() {
  const { data: conditions } = await supabase.from('conditions').select('*').order('display_order', { ascending: true });

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">We Can Help</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Conditions We Treat</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We're committed to helping our clients overcome pain and improve their quality of life with effective, evidence-based treatment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {(conditions || []).map((condition) => (
            <div key={condition.id} className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
              <CheckCircle2 className="text-accent shrink-0" size={20} />
              <span className="text-gray-800 font-medium">{condition.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
