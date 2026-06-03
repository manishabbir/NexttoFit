"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "ELEVATE YOUR",
    subtitle: "EVERYDAY STYLE",
    description: "Premium craftsmanship meets modern sophistication. Discover our latest collection designed for the discerning gentleman.",
    cta: "Shop Men's Collection",
    href: "/men",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    align: "left",
  },
  {
    id: 2,
    title: "REDEFINING",
    subtitle: "FEMININE ELEGANCE",
    description: "From timeless classics to contemporary designs, explore fashion that celebrates your unique style.",
    cta: "Shop Women's Collection",
    href: "/women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    align: "right",
  },
  {
    id: 3,
    title: "NEW SEASON",
    subtitle: "NOW ARRIVING",
    description: "Be the first to explore our latest drops. Fresh styles, bold designs, and unmatched quality await.",
    cta: "View New Arrivals",
    href: "/new-arrivals",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
    align: "left",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[current];

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

  return (
    <section className="relative h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Slides */}
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
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div
              className={`absolute inset-0 ${
                slide.align === "left"
                  ? "bg-gradient-to-r from-black/80 via-black/50 to-transparent"
                  : "bg-gradient-to-l from-black/80 via-black/50 to-transparent"
              }`}
            />
          </div>

          {/* Content */}
          <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`flex h-full flex-col justify-center ${
                slide.align === "left" ? "items-start" : "items-end text-right"
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
                  slide.align === "right" ? "text-right" : ""
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
                  href={slide.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/25"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, index) => (
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