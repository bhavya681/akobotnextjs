"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, ArrowRight, Play, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const videoCards = [
  { id: 1, label: "T2Video", video: "/feeds/video1.mp4" },
  { id: 2, label: "Editing", video: "/feeds/video4.mp4" },
  { id: 3, label: "Upscale", video: "/feeds/video7.mp4" },
  { id: 4, label: "Motion", video: "/feeds/video14.mp4" },
];

interface VideoCardProps {
  card: { id: number; label: string; video: string };
  index: number;
}

const VideoCard = ({ card, index }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err: unknown) => {
        console.warn("Autoplay prevented:", err);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0.3, 0, 1],
      }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-square cursor-pointer"
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted border border-border/50 shadow-2xl">
        <video
          ref={videoRef}
          src={card.video}
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
            <Play size={12} className="fill-current" />
            {card.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const VideoToolsFeaturesSection = () => {
  return (
    <section className="py-10 px-15 lg:py-12 relative overflow-x-clip w-full bg-background">
      {/* Background Grid - Kept exactly as requested */}
      <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }} ></div>

      <div className="container mx-auto relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Panel - Enhanced with more content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary px-3 py-1 bg-primary/10 rounded-full">
                EXPLORE AI VIDEO
              </span>
              
              {/* Title - Kept exactly as requested */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                Video Tool <span className="gradient-text">Features</span>
              </h2>
              
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                Experience the next generation of video creation. Our AI-driven suite 
                allows you to generate, upscale, and edit cinematic content with simple 
                prompts and intuitive hover controls.
              </p>
            </div>

            {/* Added Feature List - Reference Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { icon: Zap, text: "Instant AI Previews" },
                 { icon: Shield, text: "Secure Cloud Storage" },
                 { icon: CheckCircle2, text: "Professional Metadata" },
                 { icon: Globe, text: "Global CDN Export" }
               ].map((feature, i) => (
                 <div key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                   <feature.icon className="w-5 h-5 text-primary" />
                   <span className="text-lg">{feature.text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Panel - Grid (Unchanged) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 relative">
            {/* Subtle glow effect behind grid */}
            <div className="absolute -inset-10 bg-primary/5 blur-[100px] -z-10 rounded-full" />
            
            {videoCards.map((card, index) => (
              <VideoCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoToolsFeaturesSection;