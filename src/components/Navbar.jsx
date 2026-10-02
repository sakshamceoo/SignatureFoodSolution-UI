import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  Package,
  Network,
  BookOpen,
  Boxes,
  Briefcase,
  PhoneCall,
} from "lucide-react";
import logo from "../assets/logo-clear.webp";
import { ease } from "../motion";
import "./Navbar.css";

const links = [
  { to: "/products", label: "Our Products", Icon: Package, page: true },
  { to: "/#network", label: "Our Networks", Icon: Network },
  { to: "/story", label: "Our Story", Icon: BookOpen, page: true },
  { to: "/#bulk", label: "Bulk Order", Icon: Boxes, cta: true },
  { to: "/#career", label: "Career", Icon: Briefcase },
  { to: "/#contact", label: "Contact Now", Icon: PhoneCall },
];

export default function Navbar() {
  const location = useLocation();
  const isInnerPage =
    location.pathname === "/story" || location.pathname === "/products";
  const [pastHero, setPastHero] = useState(isInnerPage);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 32, restDelta: 0.01 });

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isInnerPage) {
      setPastHero(true);
      return;
    }

    const hero = document.getElementById("home");
    if (!hero) {
      setPastHero(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting || entry.intersectionRatio < 0.35);
      },
      { threshold: [0, 0.2, 0.35, 0.55, 1], rootMargin: "-12% 0px -40% 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [isInnerPage, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Home sections such as Networks load after the route change, so keep
  // looking until the target is actually in the page.
  useEffect(() => {
    if (location.pathname !== "/") return;
    const hash = location.hash?.replace("#", "");
    if (!hash) return;

    let frame = 0;
    const started = performance.now();

    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (performance.now() - started < 4000) {
        frame = requestAnimationFrame(tryScroll);
      }
    };

    frame = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <motion.header
      className={`nav ${pastHero || isInnerPage ? "is-scrolled is-past-hero" : ""}`}
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease }}
    >
      <motion.div className="nav__progress" style={{ scaleX: progress }} />

      <div className="nav__inner">
        <AnimatePresence initial={false} mode="popLayout">
          {pastHero || isInnerPage ? (
            <motion.div
              key="brand"
              className="nav__brand-wrap"
              initial={{ opacity: 0, x: -24, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -18, scale: 0.94 }}
              transition={{ duration: 0.4, ease }}
            >
              <Link
                to="/"
                className="nav__brand"
                onClick={() => setOpen(false)}
              >
                <img
                  src={logo}
                  alt=""
                  className="nav__logo"
                  width={72}
                  height={56}
                />
                <span className="nav__name">
                  Signature
                  <br />
                  Food Solutions<sup className="tm">TM</sup>
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="brand-spacer"
              className="nav__brand-spacer"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        <nav className="nav__links" aria-label="Primary">
          {links.map(({ to, label, Icon, cta, page }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06, duration: 0.45, ease }}
            >
              <Link
                to={to}
                className={`nav__link ${cta ? "nav__link--cta" : ""} ${
                  page && location.pathname === to ? "is-active" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <button
          type="button"
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__drawer is-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!pastHero && !isInnerPage && (
              <Link
                to="/"
                className="nav__drawer-brand"
                onClick={() => setOpen(false)}
              >
                <img src={logo} alt="" className="nav__logo" />
                <span>Signature Food Solutions<sup className="tm">TM</sup></span>
              </Link>
            )}
            {links.map(({ to, label, Icon, cta, page }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
              >
                <Link
                  to={to}
                  className={`nav__drawer-link ${cta ? "is-cta" : ""} ${
                    page && location.pathname === to ? "is-active" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
