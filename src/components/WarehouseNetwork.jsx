import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Phone, Navigation } from "lucide-react";
import mapArt from "../assets/map.webp";
import graphicTl from "../assets/graphic-tl-clear.webp";
import graphicBr from "../assets/graphic-br-clear.webp";
import { ease, viewportOnce } from "../motion";
import "./WarehouseNetwork.css";

const warehouses = [
  {
    id: "shahdara",
    name: "Shahdara",
    region: "East Delhi",
    address: "Warehouse Complex, GT Road, Shahdara, Delhi 110032",
    phone: "+91 11 4567 8901",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Shahdara+Delhi+Warehouse",
    x: 65.3,
    y: 33.3,
  },
  {
    id: "najafgarh",
    name: "Najafgarh",
    region: "East Delhi",
    address: "Plot 18, Vikas Marg, Najafgarh, Delhi 110092",
    phone: "+91 11 4567 8902",
    mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Najafgarh+Delhi",
    x: 38.8,
    y: 55.7,
  },
  {
    id: "noida",
    name: "Noida",
    region: "Uttar Pradesh",
    address: "Sector 63 Industrial Area, Noida, UP 201301",
    phone: "+91 120 456 8903",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Noida+Sector+63",
    x: 69.5,
    y: 62.9,
  },
  {
    id: "faridabad",
    name: "Faridabad",
    region: "Haryana",
    address: "Industrial Area, Mathura Road, Faridabad, HR 121003",
    phone: "+91 129 456 8904",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Faridabad+Industrial+Area",
    x: 57.6,
    y: 77,
  },
];

function LeafAccent() {
  return (
    <svg
      className="wh-net__leaf"
      viewBox="0 0 120 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 34c18-2 34-10 48-22 6 14 4 26-2 36"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M56 18c14-8 28-12 44-14-6 12-14 22-26 30-8 6-14 12-18 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="52" cy="14" r="2.2" fill="currentColor" opacity="0.45" />
      <circle cx="88" cy="10" r="1.8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export default function WarehouseNetwork() {
  const [activeId, setActiveId] = useState(warehouses[0].id);
  const active = warehouses.find((w) => w.id === activeId) ?? warehouses[0];

  return (
    <section id="network" className="wh-net">
      <div className="wh-net__shell">
        <div className="wh-net__botanicals" aria-hidden="true">
          <img
            src={graphicTl}
            alt=""
            className="wh-net__graphic wh-net__graphic--tl"
            loading="lazy"
            decoding="async"
          />
          <img
            src={graphicBr}
            alt=""
            className="wh-net__graphic wh-net__graphic--br"
            loading="lazy"
            decoding="async"
          />
        </div>

        <motion.header
          className="wh-net__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease }}
        >
          <p className="wh-net__eyebrow"></p>
          <h2 className="wh-net__title">
            Our Warehouse <span>Network</span>
          </h2>
          <p className="wh-net__sub">Delivering Freshness Across Delhi NCR</p>
          <LeafAccent />
        </motion.header>

        <div className="wh-net__layout">
          <motion.div
            className="wh-net__map"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease }}
          >
            <img
              src={mapArt}
              alt="Illustrated map of Delhi NCR"
              className="wh-net__map-img"
              draggable={false}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />

            {warehouses.map((wh) => {
              const isActive = activeId === wh.id;
              return (
                <div
                  key={wh.id}
                  className="wh-net__pin-wrap"
                  style={{ left: `${wh.x}%`, top: `${wh.y}%` }}
                >
                  <motion.button
                    type="button"
                    className={`wh-net__pin ${isActive ? "is-active" : ""}`}
                    aria-label={`${wh.name} warehouse`}
                    aria-pressed={isActive}
                    onClick={() => setActiveId(wh.id)}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    <span className="wh-net__pin-ring" aria-hidden="true" />
                    <span className="wh-net__pin-dot" aria-hidden="true" />
                    <span className="wh-net__pin-label">{wh.name}</span>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>

          <div className="wh-net__aside">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id}
                className="wh-net__card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <p className="wh-net__card-region">{active.region}</p>
                <h3 className="wh-net__card-name">{active.name}</h3>

                <div className="wh-net__card-row">
                  <MapPin size={18} strokeWidth={1.8} aria-hidden="true" />
                  <p>{active.address}</p>
                </div>

                <div className="wh-net__card-row">
                  <Phone size={18} strokeWidth={1.8} aria-hidden="true" />
                  <a href={`tel:${active.phone.replace(/\s/g, "")}`}>
                    {active.phone}
                  </a>
                </div>

                <a
                  className="btn-primary wh-net__directions"
                  href={active.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation size={16} strokeWidth={2} aria-hidden="true" />
                  Get Directions
                </a>
              </motion.article>
            </AnimatePresence>

            <div className="wh-net__chips" role="tablist" aria-label="Warehouses">
              {warehouses.map((wh) => (
                <button
                  key={wh.id}
                  type="button"
                  role="tab"
                  aria-selected={activeId === wh.id}
                  className={`wh-net__chip ${activeId === wh.id ? "is-active" : ""}`}
                  onClick={() => setActiveId(wh.id)}
                >
                  {wh.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
