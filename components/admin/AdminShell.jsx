'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  LayoutDashboard, Home, User, Wrench, ClipboardList,
  Star, Image as ImageIcon, ShieldCheck, Phone, Inbox, LogOut,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Hero Section', href: '/admin/hero', icon: Home },
  { label: 'About / Team', href: '/admin/about', icon: User },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Conditions', href: '/admin/conditions', icon: ClipboardList },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Insurance Logos', href: '/admin/insurance', icon: ShieldCheck },
  { label: 'Contact Info', href: '/admin/contact-info', icon: Phone },
  { label: 'Form Submissions', href: '/admin/submissions', icon: Inbox },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#111111', color: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col flex-shrink-0" style={{ backgroundColor: '#1A1A1A', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-bold text-white">MF Sports Admin</p>
          <p className="text-xs mt-1" style={{ color: '#64748B' }}>Content Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 16px', borderRadius: '8px', fontSize: '14px',
                  fontWeight: '500', textDecoration: 'none',
                  backgroundColor: active ? 'rgba(204,0,0,0.15)' : 'transparent',
                  color: active ? '#CC0000' : '#94A3B8',
                }}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px', borderRadius: '8px', fontSize: '14px',
              fontWeight: '500', color: '#F87171', background: 'none',
              border: 'none', cursor: 'pointer', width: '100%',
            }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto" style={{ color: '#F1F5F9' }}>
        {children}
      </main>
    </div>
  );
}
