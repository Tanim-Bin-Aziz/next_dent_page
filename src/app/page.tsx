import DoctorsSection from "@/components/DoctorsSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <DoctorsSection />
    </>
  );
};

export default Home;
