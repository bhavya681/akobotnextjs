"use client";

import Navbar from "@/components/Navbar";
import CreateAgentSection from "@/components/CreateAgentSection";
import AllModelsSection from "@/components/AllModelsSection";
import ImageToolsFeaturesSection from "@/components/ImageToolsFeaturesSection";
import VideoToolsFeaturesSection from "@/components/VideoToolsFeaturesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import DevelopersSection from "@/components/DevelopersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background dark:bg-transparent text-foreground overflow-x-hidden w-full relative">
      {/* Full-page black + grid pattern (same as top section) - visible in dark mode */}
      <div className="fixed inset-0 pointer-events-none z-0 dark:block hidden bg-black" />
      <div
        className="fixed inset-0 pointer-events-none z-0 hidden dark:block opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      {/* Neural Network Background - Theme Aware */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0 opacity-5 dark:opacity-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80')`,
          filter: 'blur(0.5px)',
        }}
      />
      
      {/* Additional overlay for better text readability - Theme Aware (lighter in dark so grid shows) */}
      <div className="fixed inset-0 bg-background/40 dark:bg-black/20 pointer-events-none z-0" />
      
      <div className="relative z-10">
        <Navbar />
        <CreateAgentSection />
        <AllModelsSection />
        <ImageToolsFeaturesSection />
        <VideoToolsFeaturesSection />
        <ShowcaseSection />
        <DevelopersSection />
        {/* <CTASection /> */}
        <Footer />
      </div>
    </main>
  );
};

export default Index;
