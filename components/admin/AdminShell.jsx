'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  LayoutDashboard,
  Home,
  User,
  Wrench,
  ClipboardList,
  Star,
  Image as ImageIcon,
  ShieldCheck,
  Phone,
  Inbox,
  LogOut,
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
   <div className="min-h-screen flex" style={{backgroundColor: '#0D0D0D', color: '#F1F5F9'}}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col" style={{backgroundColor: '#1A1A1A'}}>
        <div className="p-6 border-b border-white/5">
          <p className="text-white font-bold">MF Sports Admin</p>
          <p className="text-slate-500 text-xs mt-1">Content Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto text-white">{children}</main>
    </div>
  );
}
