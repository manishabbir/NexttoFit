"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  order: number;
  isActive: boolean;
}

const defaultBanners: Banner[] = [
  {
    id: "default-1",
    title: "ELEVATE YOUR",
    subtitle: "EVERYDAY STYLE",
    description: "Premium craftsmanship meets modern sophistication.",
    linkText: "Shop Men's Collection",
    linkUrl: "/men",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    order: 1,
    isActive: true,
  },
  {
    id: "default-2",
    title: "REDEFINING",
    subtitle: "FEMININE ELEGANCE",
    description: "From timeless classics to contemporary designs.",
    linkText: "Shop Women's Collection",
    linkUrl: "/women",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    order: 2,
    isActive: true,
  },
  {
    id: "default-3",
    title: "NEW SEASON",
    subtitle: "NOW ARRIVING",
    description: "Be the first to explore our latest drops.",
    linkText: "View New Arrivals",
    linkUrl: "/new-arrivals",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
    order: 3,
    isActive: true,
  },
];

export function HeroSection() {
  const [slides, setSlides] = useState<Banner[]>((): Banner[] => {
    // Try localStorage cache first - instant load
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("nextfitt_banners");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultBanners;
  });
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    // Race between fetch and 3 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setLoaded(true); // Show whatever we have (cached or defaults) after 3s
    }, 3000);

    fetch("/api/banners", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timeoutId);
        if (Array.isArray(data) && data.length > 0) {
          const activeBanners = data
            .filter((b: Banner) => b.isActive)
            .sort((a: Banner, b: Banner) => a.order - b.order);
          if (activeBanners.length > 0) {
            setSlides(activeBanners);
            try { localStorage.setItem("nextfitt_banners", JSON.stringify(activeBanners)); } catch {}
          }
        }
      })
      .catch(() => {
        // Abort or network error - just show defaults/cached
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Show loading skeleton while fetching
  if (!loaded) {
    return (
      <section className="relative h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden bg-gradient-to-r from-luxury-950 via-luxury-900 to-luxury-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500" />
        </div>
      </section>
    );
  }

  const align = current % 2 === 0 ? "left" : "right";

  return (
    <section className="relative h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div
              className={`absolute inset-0 ${
                align === "left"
                  ? "bg-gradient-to-r from-black/80 via-black/50 to-transparent"
                  : "bg-gradient-to-l from-black/80 via-black/50 to-transparent"
              }`}
            />
          </div>

          <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`flex h-full flex-col justify-center ${
                align === "left" ? "items-start" : "items-end text-right"
              }`}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-4 text-xs font-semibold tracking-[0.3em] uppercase text-gold-400"
              >
                NEXTFITT Premium
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
              >
                {slide.title}
                <br />
                <span className="text-gradient-gold">{slide.subtitle}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={`mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg ${
                  align === "right" ? "text-right" : ""
                }`}
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  href={slide.linkUrl}
                  className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/25"
                >
                  {slide.linkText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === current
                ? "w-8 bg-gold-500"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}