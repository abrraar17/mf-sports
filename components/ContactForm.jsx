'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactForm() {
  const [form, setForm] = useState({ first_name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_submissions').insert([form]);
    if (error) { setStatus('error'); } else { setStatus('success'); setForm({ first_name: '', phone: '', email: '', message: '' }); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-4 border border-gray-200 shadow-sm">
      {[
        { label: 'First Name *', name: 'first_name', type: 'text', required: true },
        { label: 'Phone Number *', name: 'phone', type: 'tel', required: true },
        { label: 'Email Address', name: 'email', type: 'email', required: false },
      ].map(({ label, name, type, required }) => (
        <div key={name}>
          <label className="block text-sm text-gray-600 mb-2">{label}</label>
          <input type={type} name={name} required={required} value={form[name]} onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-accent transition-colors" />
        </div>
      ))}

      <div>
        <label className="block text-sm text-gray-600 mb-2">Message</label>
        <textarea name="message" rows={4} maxLength={180} value={form.message} onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-accent transition-colors resize-none" />
        <p className="text-xs text-gray-400 mt-1">{form.message.length} / 180</p>
      </div>

      <button type="submit" disabled={status === 'sending'}
        className="w-full bg-accent text-white font-semibold py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60">
        {status === 'sending' ? 'Sending...' : 'Submit'}
      </button>

      {status === 'success' && <p className="text-green-600 text-sm text-center">Thanks! We'll get back to you soon.</p>}
      {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
    </form>
  );
}
