import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Conditions from '@/components/Conditions';
import Reviews from '@/components/Reviews';
import Insurance from '@/components/Insurance';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const revalidate = 0;
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Conditions />
      <Reviews />
      <Insurance />
      <Contact />
      <Footer />
    </main>
  );
}
