import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./ProductCarousel.css";

const slides = [
  {
    id: "meat",
    label: "Premium Cuts",
    src: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "eggs",
    label: "Farm Eggs",
    src: "https://images.unsplash.com/photo-1582722873440-3d0daa0cdad0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chicken",
    label: "Fresh Poultry",
    src: "https://images.unsplash.com/photo-1587593810167-a84920ea0311?auto=format&fit=crop&w=900&q=80",
  },
];

function CarouselSlide({ slide }) {
  return (
    <motion.div
      className="carousel__slide"
      initial={{ opacity: 0, scale: 0.92, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.94, x: -36 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="carousel__glow" />
      <img
        src={slide.src}
        alt={slide.label}
        loading="lazy"
        decoding="async"
        className="carousel__img"
      />
      <span className="carousel__caption">{slide.label}</span>
    </motion.div>
  );
}

export default function ProductCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="carousel" role="region" aria-label="Featured products">
      <AnimatePresence mode="wait">
        <CarouselSlide key={slides[index].id} slide={slides[index]} />
      </AnimatePresence>

      <div className="carousel__dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`carousel__dot ${i === index ? "is-active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.label}`}
          />
        ))}
      </div>
    </div>
  );
}
