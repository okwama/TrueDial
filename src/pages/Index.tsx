import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedWatches from "@/components/FeaturedWatches";
import ValueProposition from "@/components/ValueProposition";
import PhilosophySection from "@/components/PhilosophySection";
import TrustSection from "@/components/TrustSection";
import LocationSection from "@/components/LocationSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedWatches />
        <ValueProposition />
        <PhilosophySection />
        <TrustSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;