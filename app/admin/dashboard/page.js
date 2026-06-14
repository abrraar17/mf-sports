'use client';

import { useRequireAuth } from '@/lib/useRequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';
import { Home, User, Wrench, ClipboardList, Star, Image as ImageIcon, ShieldCheck, Phone, Inbox } from 'lucide-react';


const CARDS = [
  { label: 'Hero Section', href: '/admin/hero', icon: Home, desc: 'Edit homepage banner text & image' },
  { label: 'About / Team', href: '/admin/about', icon: User, desc: 'Edit about content & team members' },
  { label: 'Services', href: '/admin/services', icon: Wrench, desc: 'Add, edit or remove services' },
  { label: 'Conditions', href: '/admin/conditions', icon: ClipboardList, desc: 'Manage conditions treated list' },
  { label: 'Reviews', href: '/admin/reviews', icon: Star, desc: 'Add or remove client reviews' },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon, desc: 'Upload photos & videos' },
  { label: 'Insurance Logos', href: '/admin/insurance', icon: ShieldCheck, desc: 'Manage accepted insurance logos' },
  { label: 'Contact Info', href: '/admin/contact-info', icon: Phone, desc: 'Update phone, email, address & hours' },
  { label: 'Form Submissions', href: '/admin/submissions', icon: Inbox, desc: 'View messages from website visitors' },
];

export default function Dashboard() {
  const { loading } = useRequireAuth();

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-2">Welcome back 👋</h1>
      <p className="text-slate-400 mb-8">
        Manage every section of the MF Sports Injury Rehab website from here.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-navy-light border border-white/5 rounded-2xl p-6 hover:border-accent/40 transition-colors"
            >
              <Icon className="text-accent mb-3" size={24} />
              <p className="font-semibold mb-1">{card.label}</p>
              <p className="text-slate-400 text-sm">{card.desc}</p>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
