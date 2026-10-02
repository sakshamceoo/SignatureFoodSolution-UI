import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sprout,
  ShieldCheck,
  Snowflake,
  Heart,
  Check,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import logo from "../assets/logo-clear.webp";
import bulkImg from "../assets/bulk.webp";
import LazyVideo from "./LazyVideo";
import {
  WaveDivider,
} from "./Botanical";
import {
  fadeUp,
  pop,
  scaleIn,
  slideRight,
  stagger,
  viewportOnce,
  ease,
} from "../motion";
import "./Sections.css";

const whoChecks = [
  "Trusted Allied Farms",
  "Hygienic Processing",
  "Farm Fresh Every Day",
  "Quality Assured",
];

const whoFeatures = [
  {
    title: "Trusted Farms",
    desc: "Responsibly sourced from carefully selected allied farms.",
    Icon: Sprout,
  },
  {
    title: "Quality Checked",
    desc: "Every batch undergoes strict quality inspection.",
    Icon: ShieldCheck,
  },
  {
    title: "Fresh Daily",
    desc: "Processed and delivered to preserve freshness.",
    Icon: Snowflake,
  },
  {
    title: "Customer First",
    desc: "Delivering products families can trust.",
    Icon: Heart,
  },
];

function LeafCorner({ className }) {
  return (
    <svg
      className={`who-leaf-spin ${className}`}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M58 128c2-28 6-52 18-74 10-18 24-32 40-42-4 22-14 42-28 58-12 14-22 28-30 58Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M62 122c-8-22-22-40-40-54-8-6-16-12-22-14 12 18 20 38 24 60 2 12 4 22 6 32"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhoAreWe() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease }}
      >
        <WaveDivider />
      </motion.div>
      <section id="who" className="band band--who">
        <LeafCorner className="who-leaf who-leaf--br" />
        <div className="section who">
          <motion.div
            className="who__header"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.span className="who__rule" variants={scaleIn} aria-hidden="true" />
            <motion.h2 className="who__title" variants={fadeUp}>
              From Trusted Farms to Every Family
            </motion.h2>
            <motion.p className="who__subtitle" variants={fadeUp} custom={1}>
              Freshness Begins at the Farm.
            </motion.p>
            <motion.span className="who__rule" variants={scaleIn} custom={1} aria-hidden="true" />
          </motion.div>

          <div className="who__split">
            <motion.div
              className="who__video"
              initial={{ opacity: 0, x: -64 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.85, ease }}
            >
              <div className="who__video-aura" aria-hidden="true" />
              <div className="who__video-frame">
                <LazyVideo
                  className="who__video-el"
                  loader={() => import("../assets/video1.mp4")}
                  aria-label="Poultry farm footage from Signature Food Solutions™"
                />
              </div>
            </motion.div>

            <motion.div
              className="who__copy"
              initial={{ opacity: 0, x: 64 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.85, ease, delay: 0.12 }}
            >
              <p className="who__lead">
              At Signature Food Solutions™, we source premium poultry, meat, and seafood from trusted partners, ensuring every product is hygienically processed and delivered with uncompromising freshness and quality.
              </p>
              <ul className="who__checks">
                {whoChecks.map((item) => (
                  <li key={item}>
                    <span className="who__check-icon" aria-hidden="true">
                      <Check size={14} strokeWidth={2.6} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/story" className="btn-primary">
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="who-features"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            {whoFeatures.map((feat, i) => (
              <motion.article
                key={feat.title}
                className="who-feature"
                variants={pop}
                custom={i}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="who-feature__icon"
                  aria-hidden="true"
                  whileHover={{ scale: 1.12, rotate: -4 }}
                >
                  <feat.Icon size={28} strokeWidth={1.7} />
                </motion.div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export function BulkOrder() {
  return (
    <section id="bulk" className="band band--paper band--bulk">
      <div className="bulk__leaf-texture" aria-hidden="true">
        <svg className="bulk__vine bulk__vine--tl" viewBox="0 0 220 200" fill="none">
          <path
            d="M20 180c30-40 48-78 52-120"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M72 70c-18-8-34-6-48 4 10 16 26 26 46 28-2-12-2-22 2-32Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            d="M78 98c-22 2-38 14-46 32 18 8 38 6 52-6-4-8-6-16-6-26Z"
            fill="currentColor"
            opacity="0.28"
          />
          <path
            d="M70 52c12-22 28-36 50-42-2 22-12 40-30 52-8 4-14 4-20-10Z"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <path
            d="M88 120c16-4 32 2 44 16-14 12-32 16-48 8 2-8 4-16 4-24Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.45"
          />
        </svg>
        <svg className="bulk__vine bulk__vine--br" viewBox="0 0 220 200" fill="none">
          <path
            d="M200 20c-34 36-50 78-54 124"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M146 134c20 10 38 8 54-2-8-18-24-30-48-32 4 12 2 24-6 34Z"
            fill="currentColor"
            opacity="0.32"
          />
          <path
            d="M152 98c24 0 42-12 52-30-20-10-42-8-56 6 2 8 4 16 4 24Z"
            fill="currentColor"
            opacity="0.26"
          />
          <path
            d="M140 150c-10 24-28 40-52 48 4-24 16-42 36-54 8-4 12-2 16 6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.5"
          />
          <circle cx="128" cy="72" r="3" fill="currentColor" opacity="0.35" />
          <circle cx="168" cy="118" r="2.2" fill="currentColor" opacity="0.3" />
        </svg>
        <div className="bulk__leaf-scatter" />
      </div>
      <div className="section bulk">
        <motion.div
          className="bulk__copy"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
        >
          <motion.p className="section-label" variants={fadeUp}>
            Bulk Order
          </motion.p>
          <motion.h2 className="section-title" variants={fadeUp} custom={1}>
            Supplying Businesses That Serve Thousands
          </motion.h2>
          <motion.p className="section-lead" variants={fadeUp} custom={2}>
            Built for restaurants, cafés, hotels, caterers, cloud kitchens,
            supermarkets, and institutional buyers seeking uncompromising quality
            and dependable service.
          </motion.p>
          <motion.a
            href="https://wa.me/919999889036?text=Hello%20Signature%20Food%20Solutions%E2%84%A2%20I%20want%20to%20enquire%20about%20bulk%20orders"
            className="btn-primary bulk__cta"
            target="_blank"
            rel="noopener noreferrer"
            variants={pop}
            custom={3}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Start a Bulk Enquiry
          </motion.a>
        </motion.div>
        <motion.div
          className="bulk__visual"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={slideRight}
        >
          <img
            src={bulkImg}
            alt="Signature Food Solutions™ bulk delivery box filled with fresh poultry, red meat, eggs, and herbs"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  );
}

export function Career() {
  const roles = [
    { title: "Logistics Coordinator", loc: "On-site · Full-time" },
    { title: "Quality Specialist", loc: "Hybrid · Full-time" },
    { title: "Sales Account Manager", loc: "Field · Full-time" },
  ];

  return (
    <section id="career" className="band band--beige">
      <motion.div
        className="section"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
      >
        <motion.p className="section-label" variants={fadeUp}>
          Career
        </motion.p>
        <motion.h2 className="section-title" variants={fadeUp} custom={1}>
          Build the future of food supply
        </motion.h2>
        <motion.p className="section-lead" variants={fadeUp} custom={2}>
          Join a team obsessed with reliability, craft, and care for every delivery.
        </motion.p>

        <div className="career-list">
          {roles.map((r, i) => (
            <motion.a
              key={r.title}
              href="#contact"
              className="career-row"
              variants={fadeUp}
              custom={i}
              whileHover={{ x: 8, backgroundColor: "rgba(161, 42, 48, 0.04)" }}
            >
              <div>
                <h3>{r.title}</h3>
                <span>{r.loc}</span>
              </div>
              <span className="career-row__cta">Apply</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

const contactChips = [
  "Fast Response",
  "Bulk Supply",
  "Trusted Quality",
  "Delhi NCR Delivery",
];

const contactCards = [
  {
    id: "call",
    Icon: Phone,
    title: "Call Us",
    phones: [
      { label: "+91 9999889036", href: "tel:+919999889036" },
      { label: "+91 9667919993", href: "tel:+919667919993" },
    ],
    action: "Call Now",
    href: "tel:+919999889036",
    offset: "contact-card--a",
  },
  {
    id: "whatsapp",
    Icon: MessageCircle,
    title: "WhatsApp",
    detail: "Typically replies within minutes",
    action: "Start Chat",
    href: "https://wa.me/919999889036?text=Hi%20Signature%20Food%20Solutions%E2%84%A2%20i%20have%20the%20enquiry%20regarding%20the%20products%20you%20are%20offering%20",
    offset: "contact-card--b",
  },
  {
    id: "email",
    Icon: Mail,
    title: "Email",
    detail: "vortexventures.india@gmail.com, signaturefoodsolutions@gmail.com",
    action: "Send Email",
    href: "mailto:vortexventures.india@gmail.com, signaturefoodsolutions@gmail.com",
    offset: "contact-card--c",
  },
  {
    id: "warehouse",
    Icon: MapPin,
    title: "Warehouse",
    detail: "Shahdara, Delhi",
    action: "Get Directions",
    href: "https://maps.google.com/?q=Shahdara,Delhi",
    offset: "contact-card--d",
  },
];

const contactReveal = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

const contactHeading = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease, delay: 0.08 },
  },
};

const contactCardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.18 + i * 0.12, duration: 0.65, ease },
  }),
};

function ContactLeaf({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M58 128c2-28 6-52 18-74 10-18 24-32 40-42-4 22-14 42-28 58-12 14-22 28-30 58Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M62 122c-8-22-22-40-40-54-8-6-16-12-22-14 12 18 20 38 24 60 2 12 4 22 6 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Contact() {
  const sectionRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const contact = sectionRef.current;
    if (!contact) return;

    let contactVisible = false;
    let footerVisible = false;

    const update = () => {
      setShowSticky(contactVisible && !footerVisible);
    };

    const contactIo = new IntersectionObserver(
      ([entry]) => {
        contactVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.12 },
    );
    contactIo.observe(contact);

    const footer = document.querySelector(".footer");
    let footerIo;
    if (footer) {
      footerIo = new IntersectionObserver(
        ([entry]) => {
          footerVisible = entry.isIntersecting;
          update();
        },
        { threshold: 0.01, rootMargin: "40px 0px 0px 0px" },
      );
      footerIo.observe(footer);
    }

    return () => {
      contactIo.disconnect();
      footerIo?.disconnect();
    };
  }, []);

  return (
    <section id="contact" className="band band--contact" ref={sectionRef}>
      <div className="contact-bg" aria-hidden="true">
        <span className="contact-bg__glow" />
        <ContactLeaf className="contact-bg__leaf contact-bg__leaf--tl" />
        <ContactLeaf className="contact-bg__leaf contact-bg__leaf--br" />
      </div>

      <motion.div
        className="section contact"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={contactReveal}
      >
        <motion.div
          className="contact__copy"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
        >
          <motion.p className="contact__eyebrow" variants={fadeUp}>
            Contact
          </motion.p>
          <motion.h2 className="contact__title" variants={contactHeading}>
            Freshness Begins with a Conversation.
          </motion.h2>
          <motion.p className="contact__lead" variants={fadeUp} custom={1}>
            Whether you&apos;re a restaurant, hotel, caterer, retailer, household or wholesaler,
            our team is ready to help you find the perfect poultry solution.
          </motion.p>

          <motion.ul className="contact__chips" variants={stagger}>
            {contactChips.map((chip) => (
              <motion.li key={chip} className="contact__chip" variants={pop}>
                <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                {chip}
              </motion.li>
            ))}
          </motion.ul>

          <motion.a
            href="https://wa.me/919999889036?text=Hi%20Signature%20Food%20Solutions%E2%84%A2%20i%20have%20the%20enquiry%20regarding%20"
            className="contact__whatsapp-cta"
            target="_blank"
            rel="noreferrer"
            variants={pop}
            custom={2}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
            Chat on WhatsApp
            <span className="contact__cta-arrow" aria-hidden="true">
              <ArrowRight size={18} strokeWidth={2.2} />
            </span>
          </motion.a>
        </motion.div>

        <div className="contact__cards-wrap">
          <img
            src={logo}
            alt=""
            className="contact__logo-watermark"
            aria-hidden="true"
          />
          <div className="contact__cards">
            {contactCards.map((card, i) => {
              const CardTag = card.phones ? motion.div : motion.a;
              const linkProps = card.phones
                ? {}
                : {
                    href: card.href,
                    target: card.href.startsWith("http") ? "_blank" : undefined,
                    rel: card.href.startsWith("http") ? "noreferrer" : undefined,
                  };

              return (
                <CardTag
                  key={card.id}
                  className={`contact-card ${card.offset}`}
                  custom={i}
                  variants={contactCardReveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  whileHover="hover"
                  {...linkProps}
                >
                  <motion.span
                    className="contact-card__icon"
                    variants={{
                      hover: { rotate: -8, scale: 1.08 },
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                  >
                    <card.Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </motion.span>
                  <h3 className="contact-card__title">{card.title}</h3>
                  {card.phones ? (
                    <p className="contact-card__detail">
                      {card.phones.map((phone) => (
                        <a
                          key={phone.href}
                          href={phone.href}
                          className="contact-card__phone"
                        >
                          {phone.label}
                        </a>
                      ))}
                    </p>
                  ) : (
                    <p className="contact-card__detail">{card.detail}</p>
                  )}
                  {card.phones ? (
                    <a href={card.href} className="contact-card__action">
                      {card.action}
                      <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="contact-card__action">
                      {card.action}
                      <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                  )}
                </CardTag>
              );
            })}
          </div>
        </div>
      </motion.div>

      <a
        href="https://wa.me/919999889036?text=Hi%20Signature%20Food%20Solutions%E2%84%A2%20i%20have%20the%20enquiry%20regarding%20the%20products%20you%20are%20offering%20"
        className={`contact__sticky-wa ${showSticky ? "is-visible" : ""}`}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" />
        Chat on WhatsApp
      </a>
    </section>
  );
}

export function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.65, ease }}
    >
      <div className="footer__inner">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Link to="/" className="footer__brand">
            <img
              src={logo}
              alt="Signature Food Solutions™"
              className="footer__logo"
            />
            <span className="footer__name">Signature Food Solutions<sup className="tm">TM</sup></span>
          </Link>
        </motion.div>
        <p>
          © {new Date().getFullYear()} Signature Food Solutions™. All rights reserved.
          <br />
          A Vortex Ventures Enterprise.
        </p>
      </div>
    </motion.footer>
  );
}

const faqs = [
  {
    q: "What products does Signature Food Solutions™ supply?",
    a: "We supply fresh chicken, premium mutton, seafood, and ready-to-eat products for households and bulk buyers such as restaurants, hotels, caterers, retailers, and wholesalers.",
  },
  {
    q: "Where does Signature Food Solutions™ deliver?",
    a: "We deliver across Delhi NCR with cold-chain handling to preserve freshness from warehouse to door.",
  },
  {
    q: "Do you support bulk and wholesale orders?",
    a: "Yes. Signature Food Solutions™ specializes in bulk poultry and seafood supply tailored for HoReCa and wholesale buyers.",
  },
  {
    q: "Where is your warehouse located?",
    a: "Our warehouse is located in Shahdara, Delhi.",
  },
  {
    q:"Does the food contain any preservatives?",
    a: "Our fresh meat contains no preservatives or antibiotics. Only marinated and ready-to-eat items contain natural preservatives.",
  }
];
//hello
export function Faq() {
  return (
    <section id="faq" className="band faq" aria-labelledby="faq-heading">
      <div className="faq__inner">
        <p className="faq__eyebrow">FAQ</p>
        <h2 id="faq-heading" className="section-title">
          Frequently Asked Questions
        </h2>
        <p className="faq__lead">
          Quick answers about our poultry, seafood, and bulk supply across Delhi NCR.
        </p>
        <div className="faq__list">
          {faqs.map((item) => (
            <details key={item.q} className="faq__item">
              <summary className="faq__question">{item.q}</summary>
              <p className="faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
