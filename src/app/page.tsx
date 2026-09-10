import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { WhyZenSection } from '@/components/landing/WhyZenSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyZenSection />
      <HowItWorksSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
