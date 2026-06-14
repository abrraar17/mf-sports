'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactForm() {
  const [form, setForm] = useState({ first_name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const { error } = await supabase.from('contact_submissions').insert([form]);

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ first_name: '', phone: '', email: '', message: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-navy-light rounded-2xl p-8 space-y-4">
      <div>
        <label className="block text-sm text-slate-300 mb-2">First Name *</label>
        <input
          type="text"
          name="first_name"
          required
          value={form.first_name}
          onChange={handleChange}
          className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Phone Number *</label>
        <input
          type="tel"
          name="phone"
          required
          value={form.phone}
          onChange={handleChange}
          className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Message</label>
        <textarea
          name="message"
          rows={4}
          maxLength={180}
          value={form.message}
          onChange={handleChange}
          className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
        />
        <p className="text-xs text-slate-500 mt-1">{form.message.length} / 180</p>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-accent text-navy-deep font-semibold py-3 rounded-full hover:bg-accent-light transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Submit'}
      </button>

      {status === 'success' && (
        <p className="text-accent text-sm text-center">
          Thanks! We've received your message and will get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">
          Something went wrong. Please try again or call us directly.
        </p>
      )}
    </form>
  );
}
