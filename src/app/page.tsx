import { AvailabilitySection } from "@/components/AvailabilitySection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import DoctorsSection from "@/components/DoctorsSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <DoctorsSection />
      <ServicesSection />
      <CaseStudiesSection />
      <AvailabilitySection />
      <Footer />
    </>
  );
};

export default Home;
