import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import LazyVideo from "./LazyVideo";
import { Faq } from "./Sections";
import graphicTl from "../assets/graphic-tl-clear.webp";
import graphicBr from "../assets/graphic-br-clear.webp";
import { ease } from "../motion";
import "./OurStory.css";

const chapters = [
  {
    id: "trust",
    label: "01",
    title: "Built on Trust.",
    body: "At Signature Food Solutions™, freshness begins long before our products reach your kitchen. We partner with trusted allied farms committed to responsible farming, hygiene, and uncompromising quality.",
    position: "center",
  },
  {
    id: "care",
    label: "02",
    title: "Raised with Care.",
    body: "Healthy birds thrive in clean, carefully managed environments where animal welfare, biosecurity, and nutrition remain our highest priorities.",
    position: "top",
  },
  {
    id: "quality",
    label: "03",
    title: "Quality in Every Step.",
    body: "Every product undergoes careful inspection, hygienic processing, and strict quality control before packaging.",
    position: "bottom",
  },
  {
    id: "fresh",
    label: "04",
    title: "Delivered Fresh.",
    body: "From farm to your table, every order is handled with care to preserve freshness, taste, and quality.",
    position: "center",
  },
];

const loadStoryVideo = () => import("../assets/video2.mp4");

export default function OurStory() {
  const shellRef = useRef(null);
  const panelRefs = useRef([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: shellRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 32,
    restDelta: 0.01,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const nodes = panelRefs.current.filter(Boolean);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number(visible.target.dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      },
      { threshold: [0.4, 0.6], rootMargin: "-10% 0px -10% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="main-content" className="story" ref={shellRef}>
      <div className="story__botanicals" aria-hidden="true">
        <img
          src={graphicTl}
          alt=""
          className="story__graphic story__graphic--tl"
          loading="lazy"
          decoding="async"
        />
        <img
          src={graphicBr}
          alt=""
          className="story__graphic story__graphic--br"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="story__layout">
        <aside className="story__media">
          <div className="story__media-sticky">
            <div className="story__progress" aria-hidden="true">
              <motion.span
                className="story__progress-fill"
                style={{ scaleY: progress }}
              />
            </div>

            <div className="story__video-wrap">
              <LazyVideo
                className="story__video is-active"
                loader={loadStoryVideo}
                style={{ objectPosition: chapters[active].position }}
                aria-label="Farm story footage"
              />
            </div>

            <div className="story__chapter-meta">
              <h1 className="story__chapter-label">Our Story</h1>
              <span className="story__chapter-index">
                {String(active + 1).padStart(2, "0")}
                <span> / {String(chapters.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>
        </aside>

        <div className="story__panels">
          {chapters.map((chapter, i) => {
            const isActive = active === i;
            return (
              <section
                key={chapter.id}
                className={`story__panel ${isActive ? "is-active" : ""}`}
                data-index={i}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
              >
                <div
                  className={`story__panel-inner ${isActive ? "is-active" : ""}`}
                >
                  <p className="story__eyebrow">{chapter.label}</p>
                  <h2 className="story__title">{chapter.title}</h2>
                  <p className="story__body">{chapter.body}</p>
                  {i === chapters.length - 1 && (
                    <Link to="/#contact" className="btn-primary story__cta">
                      Talk to Us
                    </Link>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="story__footer-bar">
        <Link to="/" className="story__back">
          Back to Home
        </Link>
      </div>
      <Faq />
    </main>
  );
}
