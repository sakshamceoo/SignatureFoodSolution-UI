import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero-clear.webp";
import logo from "../assets/logo-clear.webp";
import heroVideo from "../assets/hero-video.mp4";
import graphicBr from "../assets/graphic-br-clear.webp";
import { ease, stagger } from "../motion";
import "./Hero.css";

const HERO_CLIP_END = 3;
const HERO_FADE_START = 2.55;

const lineVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 0.9,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.55, ease },
  }),
};

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fading = false;

    const onTimeUpdate = () => {
      if (video.currentTime >= HERO_FADE_START && video.currentTime < HERO_CLIP_END) {
        video.classList.add("is-fading");
        fading = true;
      }

      if (video.currentTime >= HERO_CLIP_END) {
        video.classList.add("is-fading");
        video.currentTime = 0.05;
        video.play().catch(() => {});

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            video.classList.remove("is-fading");
            fading = false;
          });
        });
      }
    };

    const onPlay = () => {
      if (!fading && video.currentTime < HERO_FADE_START) {
        video.classList.remove("is-fading");
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero__bg-video"
          src={heroVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
        />
        <div className="hero__bg-scrim" />
        <img
          src={graphicBr}
          alt=""
          className="hero__watermark-cover"
          width={768}
          height={512}
          decoding="async"
        />
      </div>

      <div className="hero__inner">
        <motion.div
          className="hero__copy"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <h1 className="hero__title">
            <motion.span className="hero__title-line" custom={0} variants={lineVariants}>
              Signature
            </motion.span>
            <motion.span
              className="hero__title-line hero__title-line--mid"
              custom={1}
              variants={lineVariants}
            >
              <motion.img
                src={logo}
                alt=""
                className="hero__logo"
                width={320}
                height={240}
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 140, damping: 14 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              />
              <span>Food</span>
            </motion.span>
            <motion.span className="hero__title-line" custom={2} variants={lineVariants}>
              Solutions<sup className="tm">TM</sup>
            </motion.span>
          </h1>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65, ease }}
          >
           Fresh Poultry, Meat & Seafood Delivered with Care.
          </motion.p>
 //new code
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/products" className="btn-primary">
                View Our Products
              </Link>
            </motion.div>
            <motion.a
              href="#bulk"
              className="btn-ghost"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Bulk Orders
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__media"
          initial={{ opacity: 0, x: 48, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.95, ease }}
        >
          <motion.img
            src={heroImg}
            alt="Gourmet roasted chicken meal in a Signature Food Solutions™ delivery box with fresh herbs, tomatoes, and artisan bread"
            className="hero__img"
            fetchPriority="high"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          />
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>Scroll</span>
        <motion.span
          className="hero__scroll-dot"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
