'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Users, Clock } from 'lucide-react';

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    supabase.from('hero').select('*').single().then(({ data }) => setHero(data));
    supabase.from('hero_images').select('*').order('display_order').then(({ data }) => setImages(data || []));
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const ctaLink = hero?.cta_link || 'https://mf-sports-injury-rehab.au2.cliniko.com/bookings#service';
  const ctaText = hero?.cta_text || 'Book Now';
  const secondaryLink = hero?.secondary_cta_link || '/about';
  const secondaryText = hero?.secondary_cta_text || 'Learn More';

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-24" style={{ backgroundColor: '#111111' }}>
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-10">
        {images.map((img, i) => (
          <img key={img.id} src={img.image_url} alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === currentImage ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.2), transparent)' }} />
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 w-full flex items-center py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              {hero?.heading || 'Expert Physical Therapists You Can Trust'}
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#E2E8F0' }}>
              {hero?.subheading || 'Where your journey to optimal health and vitality begins.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={ctaLink} target="_blank" rel="noopener noreferrer"
                className="font-semibold px-8 py-4 rounded-full transition-colors"
                style={{ backgroundColor: '#CC0000', color: 'white' }}>
                {ctaText}
              </a>
              <a href={secondaryLink}
                className="font-semibold px-8 py-4 rounded-full transition-colors"
                style={{ border: '2px solid white', color: 'white' }}>
                {secondaryText}
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            {hero?.founder_image_url ? (
              <div className="relative">
                <img src={hero.founder_image_url} alt={hero?.founder_name || 'Founder'}
                  className="w-72 h-96 object-cover object-top rounded-3xl"
                  style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-3 text-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                  <p className="text-white font-semibold">{hero?.founder_name || 'Mohammed Firdouse'}</p>
                  <p className="text-sm" style={{ color: '#CC0000' }}>{hero?.founder_role || 'Founder & Sports Injury Therapist'}</p>
                </div>
              </div>
            ) : (
              <div className="w-72 h-96 rounded-3xl flex items-center justify-center text-sm text-center p-6"
                style={{ border: '2px dashed rgba(255,255,255,0.2)', color: '#94A3B8' }}>
                Upload founder photo from admin panel
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Calendar style={{ color: '#CC0000' }} size={24} />
            <p className="text-gray-900 font-bold text-lg">{hero?.stat_1_value || 'Same Day'}</p>
            <p className="text-gray-500 text-sm">{hero?.stat_1_label || 'Appointment Possible'}</p>
          </div>
          <div className="flex flex-col items-center gap-1" style={{ borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}>
            <Users style={{ color: '#CC0000' }} size={24} />
            <p className="text-gray-900 font-bold text-lg">{hero?.stat_2_value || 'One-on-One'}</p>
            <p className="text-gray-500 text-sm">{hero?.stat_2_label || 'Care'}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock style={{ color: '#CC0000' }} size={24} />
            <p className="text-gray-900 font-bold text-lg">{hero?.stat_3_value || '12PM–9PM'}</p>
            <p className="text-gray-500 text-sm">{hero?.stat_3_label || 'Open Daily'}</p>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrentImage(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: i === currentImage ? '#CC0000' : 'rgba(255,255,255,0.4)' }} />
          ))}
        </div>
      )}
    </section>
  );
}
