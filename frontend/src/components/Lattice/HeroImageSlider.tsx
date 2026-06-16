import React, { useState, useEffect, useCallback, useRef } from 'react';

const SLIDES = [
  {
    image: "https://picsum.photos/seed/africa1/1600/900",
    title: "Keynote Plenaries",
    description: "Gathering global AI pioneers on the Lagos stage."
  },
  {
    image: "https://picsum.photos/seed/africa2/1600/900",
    title: "NLP & Dialect Workshops",
    description: "Developing LLMs for regional African dialects."
  },
  {
    image: "https://picsum.photos/seed/africa3/1600/900",
    title: "Afro-Tech Hack Arena",
    description: "Engineering off-grid edge solutions."
  }
];

export const HeroImageSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIdx(idx);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  // Viewport visibility observer to avoid running timers in the background
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Auto-advance every 6 seconds; reset timer on manual navigation & pause on hover or out-of-viewport
  useEffect(() => {
    if (isPaused || !isVisible) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIdx, isPaused, isVisible]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    goTo((currentIdx - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    goTo((currentIdx + 1) % SLIDES.length);
  };

  return (
    <div 
      ref={containerRef}
      className="hero-bg-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images Track */}
      <div 
        className="hero-slider-track"
        style={{
          transform: `translateX(-${currentIdx * 100}%)`
        }}
      >
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.image}
            className={`hero-bg-slide slide-${idx + 1} ${idx === currentIdx ? 'active' : ''}`}
            aria-hidden={idx !== currentIdx}
          />
        ))}
      </div>

      {/* Dark overlay so text reads clearly */}
      <div className="hero-bg-overlay" />

      {/* Caption strip at bottom */}
      <div className="hero-bg-caption animate-fade-in" key={currentIdx}>
        <span className="hero-bg-caption-tag">{SLIDES[currentIdx].title}</span>
        <span className="hero-bg-caption-desc">{SLIDES[currentIdx].description}</span>
      </div>

      {/* Left / Right Arrow Buttons */}
      <button
        className="hero-slider-arrow prev"
        onClick={handlePrev}
        aria-label="Previous slide"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="hero-slider-arrow next"
        onClick={handleNext}
        aria-label="Next slide"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="hero-slider-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`hero-slider-dot ${idx === currentIdx ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default HeroImageSlider;
