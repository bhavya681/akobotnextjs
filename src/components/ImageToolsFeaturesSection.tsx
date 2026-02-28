"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const imageModels = [
  {
    id: 1,
    title: "Text2Image",
    description: "Generate stunning images from text prompts using advanced AI models.",
    image: "/feeds/image2.jpg",
  },
  {
    id: 2,
    title: "Image2Image",
    description: "Transform and modify existing images with AI-powered image-to-image conversion.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  },
  {
    id: 3,
    title: "Background Removal",
    description: "Instantly remove backgrounds from images with precision and accuracy.",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  },
  {
    id: 4,
    title: "Avatar Generation",
    description: "Create unique AI-generated avatars and profile pictures in various styles.",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
  },
  {
    id: 5,
    title: "Upscale",
    description: "Enhance image resolution and quality with AI-powered upscaling technology.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  },
  {
    id: 6,
    title: "Watermark Removal",
    description: "Remove watermarks and unwanted elements from images seamlessly.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  },
  {
    id: 7,
    title: "Content Creation",
    description: "Create engaging visual content for social media, marketing, and more.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  },
];

// Removed hardcoded gradients - using CSS variables instead

const ImageToolsFeaturesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        scrollElement.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, []);

  // Sync ref with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Auto-scroll functionality
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    if (!scrollRef.current || isPaused) return;

    const scrollElement = scrollRef.current;
    
    const startAutoScroll = () => {
      if (!scrollElement || isPausedRef.current) return;

      const autoScroll = () => {
        if (!scrollElement || isPausedRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
        const maxScroll = scrollWidth - clientWidth;
        
        if (maxScroll <= 0) return; // No scroll needed
        
        // Calculate the width of one set of models
        const singleSetWidth = scrollWidth / 2;
        
        if (scrollLeft >= singleSetWidth - 5) {
          // Seamlessly loop back to start (invisible jump)
          scrollElement.scrollTo({ left: scrollLeft - singleSetWidth, behavior: "auto" });
        } else {
          // Continue scrolling smoothly - faster speed
          scrollElement.scrollBy({ left: 1.5, behavior: "auto" });
        }
      };

      autoScrollRef.current = window.setInterval(autoScroll, 16); // ~60fps for smoothness
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(startAutoScroll, 100);

    return () => {
      clearTimeout(timeoutId);
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [isPaused]);

  const handlePrev = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / imageModels.length;
      scrollRef.current.scrollBy({
        left: -cardWidth * 4,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / imageModels.length;
      scrollRef.current.scrollBy({
        left: cardWidth * 4,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-14 px-15 md:py-16 w-full overflow-x-clip bg-background">
      <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }} ></div>
      {/* Animated mesh and sparkles */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.16 }}
        transition={{ duration: 1 }}
        style={{
          background: `
            radial-gradient(900px 500px at 20% 30%, rgba(168,85,247,0.26) 0px, transparent 60%),
            radial-gradient(1200px 800px at 80% 90%, rgba(236,72,153,0.22) 0px, transparent 80%),
            radial-gradient(750px 550px at 65% 20%, rgba(250,204,21,0.12) 0px, transparent 70%)
          `,
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[2.8rem] md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-foreground drop-shadow-lg mb-2 relative">
              <span>
                Image Tool{" "}
                <span className="gradient-text">
                  Showcase
                </span>
              </span>
            </h2>
            <div className="hidden md:block">
              <p className="mt-2 ml-1 text-lg font-light text-muted-foreground max-w-3xl">
                Discover how cutting-edge AI transforms your creative workflow.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 self-start md:self-center"
          >
            <button
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 border-primary/50 bg-card/50 backdrop-blur-xl transition-all duration-150 flex items-center justify-center ring-2 ring-transparent focus:ring-primary/30 shadow-lg group
                ${!canScrollLeft
                  ? "opacity-45 cursor-not-allowed"
                  : "hover:border-primary hover:scale-110 cursor-pointer"}
              `}
            >
              <ChevronLeft className="w-7 h-7 text-foreground" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border-2 border-primary/50 bg-card/50 backdrop-blur-xl transition-all duration-150 flex items-center justify-center ring-2 ring-transparent focus:ring-primary/30 shadow-lg group
                ${!canScrollRight
                  ? "opacity-45 cursor-not-allowed"
                  : "hover:border-primary hover:scale-110 cursor-pointer"}
              `}
            >
              <ChevronRight className="w-7 h-7 text-foreground" />
            </button>
          </motion.div>
        </div>

        {/* Cards - Horizontal Scrollable */}
        <div className="relative">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Duplicate models for infinite scroll */}
            {[...imageModels, ...imageModels].map((model, index) => (
              <motion.div
                key={`${model.id}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.54, delay: (index % imageModels.length) * 0.14 }}
                className="group relative rounded-2xl overflow-hidden shadow-2xl bg-card backdrop-blur-md border border-border transition-transform duration-300 hover:scale-[1.035] hover:-translate-y-1 cursor-pointer flex-shrink-0 w-[320px] md:w-[360px]"
                style={{ zIndex: 1 }}
              >
                {/* Animated colorful rotating border - same as Video Tools */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none z-0"
                  style={{
                    padding: "3px",
                    background: "conic-gradient(from 0deg, #a78bfa, #f472b6, #60a5fa, #e879f9, #a78bfa)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                {/* Image with text overlay on top */}
                <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-lg">
                  <img
                    src={model.image}
                    alt={model.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[1.5deg] z-10 rounded-lg"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 rounded-lg" />
                  {/* Text overlay on top of image */}
                  <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                      {model.title}
                    </h3>
                    <p className="text-base text-white/90 leading-relaxed mb-2">
                      {model.description}
                    </p>
                  </div>
                </div>
                {/* Extra animated rainbow glow on hover */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl z-[2] opacity-0 group-hover:opacity-90 transition-all duration-700 bg-gradient-to-br from-[#a78bfa55] via-[#f472b655] to-[#60a5fa60] blur-3xl"
                  initial={false}
                  animate={{
                    opacity: [0, 0.8, 0.9, 0.8, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ mixBlendMode: "plus-lighter" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ImageToolsFeaturesSection;
