'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

const BOOKING_LINK = 'https://mf-sports-injury-rehab.au2.cliniko.com/bookings#service';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-navy/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
         <img
           src="/images/logo.png"
           alt="MF Sports Injury Rehab"
           className="h-16 object-contain"
         />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-navy-deep font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-accent-light transition-colors"
          >
            Book Now
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 bg-navy">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-navy-deep font-semibold text-center px-5 py-3 rounded-full"
          >
            Book Now
          </a>
        </nav>
      )}
    </header>
  );
}
