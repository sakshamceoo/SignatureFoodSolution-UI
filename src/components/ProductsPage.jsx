import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import graphicTl from "../assets/graphic-tl-clear.webp";
import graphicBr from "../assets/graphic-br-clear.webp";
import { ease, viewportOnce } from "../motion";
import "./ProductsPage.css";

/**
 * Lazy product loaders — files are NOT bundled into the initial page JS.
 * Each image downloads only when first requested (visible / selected / prefetched).
 */
const productLoaders = import.meta.glob("../assets/Products/*.{webp,png,PNG,jpg,jpeg}");

/** Prefer WebP when the same product exists in multiple formats. */
const loaderByKey = {};
for (const [path, loader] of Object.entries(productLoaders)) {
  const file = path.replace(/\\/g, "/").split("/").pop() || "";
  const key = file.replace(/\.(png|jpe?g|webp)$/i, "").toLowerCase().trim();
  const isWebp = /\.webp$/i.test(file);
  if (!loaderByKey[key] || isWebp) loaderByKey[key] = loader;
}

/**
 * Filename aliases when upload name ≠ product label.
 * Keys/values are lowercase productKey() strings.
 */
const PRODUCT_IMAGE_ALIASES = {
  // Chicken — plural/singular drumstick filenames
  "chicken drumstick with skin": "chicken drumsticks with skin",
  "chicken drumstick skinless": "chicken drumsticks skinless",

  // Seafood / RTE — filename spelling / punctuation differences
  sardine: "sardines",
  "chicken hariyali tikka": "chicken haryali tikka",
  "fish tikka (surmai)": "fish tikka(surmai)",
};

/** In-memory cache so the same product is never re-fetched. */
const imageCache = new Map();

function productKey(name) {
  return name.toLowerCase().trim();
}

function resolveLoader(name) {
  const key = productKey(name);
  const aliased = PRODUCT_IMAGE_ALIASES[key] || key;
  return loaderByKey[aliased] || loaderByKey[key] || null;
}

function fallbackImg(name) {
  const n = name.toLowerCase();
  // Never use stock photos for chicken once local catalogue exists —
  // return empty so UI shows stage skeleton instead of wrong Unsplash meat.
  if (
    n.includes("chicken") ||
    n.includes("gizzard") ||
    (n.includes("whole") && n.includes("leg") && !n.includes("mutton"))
  ) {
    return null;
  }

  const q = "auto=format&fit=crop&w=720&q=70";
  if (n.includes("kebab") || n.includes("seekh"))
    return `https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?${q}`;
  if (n.includes("tikka") || n.includes("tandoori"))
    return `https://images.unsplash.com/photo-1603360946369-dc9bb6258143?${q}`;
  if (n.includes("soup"))
    return `https://images.unsplash.com/photo-1547592166-23ac45744acd?${q}`;
  if (n.includes("prawn"))
    return `https://images.unsplash.com/photo-1565680018434-b513d5ea5ce0?${q}`;
  if (n.includes("crab"))
    return `https://images.unsplash.com/photo-1559339352-11d035aa65de?${q}`;
  if (
    n.includes("surmai") ||
    n.includes("pomfret") ||
    n.includes("salmon") ||
    n.includes("tuna") ||
    n.includes("tilapia") ||
    n.includes("sardine") ||
    n.includes("sole") ||
    n.includes("singhara") ||
    n.includes("fish")
  ) {
    return `https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?${q}`;
  }
  if (n.includes("mutton") || n.includes("paya") || n.includes("liver") || n.includes("kidney")) {
    return `https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?${q}`;
  }
  return null;
}

function loadProductSrc(name) {
  const key = productKey(name);
  if (imageCache.has(key)) return imageCache.get(key);

  const loader = resolveLoader(name);
  const promise = loader
    ? loader().then((mod) => ({ src: mod.default, local: true }))
    : Promise.resolve({
        src: fallbackImg(name),
        local: false,
      }).then((result) => {
        if (!result.src) return { src: null, local: false, missing: true };
        return result;
      });

  imageCache.set(key, promise);
  return promise;
}

function prefetchProduct(name) {
  loadProductSrc(name).catch(() => {});
}

/** Loads a single product image only when the stage is near the viewport. */
function ProductStage({ name, priority = false }) {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(priority);
  const [img, setImg] = useState(null);
  const hasLocalImage = Boolean(name && resolveLoader(name));

  useEffect(() => {
    if (priority) {
      setActive(true);
      return undefined;
    }
    const node = wrapRef.current;
    if (!node) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        io.disconnect();
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!active || !name) return undefined;
    let cancelled = false;
    setImg(null);

    loadProductSrc(name).then((next) => {
      if (!cancelled) setImg(next);
    });

    return () => {
      cancelled = true;
    };
  }, [active, name]);

  const showImg = img?.src;

  return (
    <div className="prod-cat__media" ref={wrapRef}>
      <div className={`prod-cat__stage ${hasLocalImage ? "is-local" : ""}`}>
        {!showImg && <div className="prod-cat__skeleton" aria-hidden="true" />}
        <AnimatePresence mode="wait">
          {showImg && (
            <motion.img
              key={name}
              src={img.src}
              alt={name}
              className={`prod-cat__img ${img.local ? "prod-cat__img--local" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease }}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "low"}
              width={640}
              height={640}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="prod-cat__shadow" aria-hidden="true" />
    </div>
  );
}

const categories = [
  {
    id: "chicken",
    pill: "Chicken",
    title: "Fresh Chicken",
    description: "Fresh, hygienically processed chicken sourced from trusted farms.",
    tone: "chicken",
    products: [
      "Chicken Thigh Boneless",
      "Whole Chicken with Skin",
      "Whole Chicken Skinless",
      "Chicken Curry Cut",
      "Whole Chicken Deboned",
      "Chicken Drumsticks with Skin",
      "Chicken Drumsticks Skinless",
      "Whole Chicken Leg",
      "Chicken Wings with Skin",
      "Chicken Wings Skinless",
      "Chicken Breast Boneless",
      "Chicken Gizzard",
    ],
  },
  {
    id: "mutton",
    pill: "Mutton",
    title: "Premium Mutton",
    description: "Premium quality mutton cuts prepared with exceptional freshness.",
    tone: "mutton",
    products: [
      "Mutton Curry Cut",
      "Mutton Whole Leg",
      "Mutton Paya",
      "Mutton Paya Skinless",
      "Mutton Liver",
      "Mutton Kidney",
    ],
  },
  {
    id: "seafood",
    pill: "Seafood",
    title: "Seafood",
    description: "Fresh seafood sourced for premium quality and taste.",
    tone: "seafood",
    products: [
      "Surmai Steaks",
      "Sole Fillet",
      "Surmai Fillet",
      "White Pomfret",
      "Black Pomfret",
      "Tuna",
      "Atlantic Salmon",
      "Sardine",
      "Mud Crab",
      "Small Prawns",
      "Medium Prawns",
      "Jumbo Prawns",
      "Tilapia Fillet",
      "Singhara Fish (Single Bone Cut)",
      "Singhara Boneless",
    ],
  },
  {
    id: "rte",
    pill: "Ready To Eat",
    title: "Ready To Eat",
    description: "Chef-prepared ready-to-cook and ready-to-eat favorites.",
    tone: "rte",
    products: [
      "Chicken Seekh Kebab",
      "Chicken Tandoori Tikka",
      "Chicken Malai Tikka",
      "Chicken Hariyali Tikka",
      "Mutton Seekh Kebab",
      "Chicken Soup",
      "Fish Tikka (Surmai)",
    ],
  },
];

const headingReveal = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.02, duration: 0.14, ease: "easeOut" },
  }),
};

const slideVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.12, ease: "easeOut" },
  },
  exit: (dir) => ({
    x: dir >= 0 ? -28 : 28,
    opacity: 0,
    transition: { duration: 0.08, ease: "easeIn" },
  }),
};

const SWIPE_OFFSET = 40;
const SWIPE_VELOCITY = 280;

function ProductLeaf({ className }) {
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

function CategorySection({
  category,
  selected,
  onSelect,
  query,
  priority = false,
  direction = 0,
  flip = false,
  onSwipe,
}) {
  const q = query.trim().toLowerCase();
  const matches = (name) => !q || name.toLowerCase().includes(q);
  const visible = category.products.filter(matches);

  if (q && visible.length === 0) return null;

  const activeName =
    (selected[category.id] && visible.includes(selected[category.id])
      ? selected[category.id]
      : visible[0]) || category.products[0];

  return (
    <motion.section
      id={`cat-${category.id}`}
      className={`prod-cat prod-cat--${category.tone}${flip ? " is-flip" : ""}`}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;
        if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) onSwipe?.(1);
        else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) onSwipe?.(-1);
      }}
      style={{ touchAction: "pan-y" }}
    >
      <ProductStage name={activeName} priority={priority} />

      <div className="prod-cat__content">
        <motion.h2 className="prod-cat__title" variants={headingReveal} initial="hidden" animate="show">
          {category.title}
        </motion.h2>
        <motion.p
          className="prod-cat__desc"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
        >
          {category.description}
        </motion.p>

        <motion.div
          className="prod-cat__chips"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
        >
          {visible.map((name) => {
            const isActive = name === activeName;
            const isHit = Boolean(q && matches(name));
            return (
              <button
                key={name}
                type="button"
                className={`prod-chip ${isActive ? "is-active" : ""} ${isHit ? "is-hit" : ""}`}
                onClick={() => onSelect(category.id, name)}
                onMouseEnter={() => prefetchProduct(name)}
                onFocus={() => prefetchProduct(name)}
              >
                <span>{name}</span>
                <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </button>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("chicken");
  const [direction, setDirection] = useState(0);
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(categories.map((c) => [c.id, c.products[0]])),
  );
  const searchInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.classList.remove("products-snap");
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const matchMap = useMemo(() => {
    if (!normalizedQuery) {
      return Object.fromEntries(categories.map((c) => [c.id, c.products]));
    }
    return Object.fromEntries(
      categories.map((c) => [
        c.id,
        c.products.filter((p) => p.toLowerCase().includes(normalizedQuery)),
      ]),
    );
  }, [normalizedQuery]);

  const filteredCount = useMemo(() => {
    if (!normalizedQuery) return null;
    return Object.values(matchMap).reduce((sum, list) => sum + list.length, 0);
  }, [matchMap, normalizedQuery]);

  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) return categories;
    return categories.filter((c) => matchMap[c.id]?.length > 0);
  }, [matchMap, normalizedQuery]);

  const activeIndex = Math.max(
    0,
    visibleCategories.findIndex((c) => c.id === activeCat),
  );
  const activeCategory = visibleCategories[activeIndex] || visibleCategories[0] || null;

  // Keep selection + jump to first matching category while searching
  useEffect(() => {
    if (!normalizedQuery) return;

    setSelected((prev) => {
      const next = { ...prev };
      categories.forEach((cat) => {
        const hits = matchMap[cat.id] || [];
        if (hits.length) next[cat.id] = hits[0];
      });
      return next;
    });

    const first = categories.find((c) => (matchMap[c.id] || []).length > 0);
    if (!first) return;
    setDirection(0);
    setActiveCat(first.id);
  }, [normalizedQuery, matchMap]);

  // If active category is filtered out, snap to first visible
  useEffect(() => {
    if (!visibleCategories.length) return;
    if (visibleCategories.some((c) => c.id === activeCat)) return;
    setDirection(0);
    setActiveCat(visibleCategories[0].id);
  }, [visibleCategories, activeCat]);

  // Prefetch neighboring category images
  useEffect(() => {
    if (!visibleCategories.length) return;
    const neighbors = [
      visibleCategories[activeIndex],
      visibleCategories[activeIndex + 1],
      visibleCategories[activeIndex - 1],
    ].filter(Boolean);
    neighbors.forEach((cat) => {
      const name = selected[cat.id] || cat.products[0];
      if (name) prefetchProduct(name);
    });
  }, [activeIndex, visibleCategories, selected]);

  const goToIndex = (nextIndex, dir) => {
    if (!visibleCategories.length) return;
    const len = visibleCategories.length;
    const wrapped = ((nextIndex % len) + len) % len;
    setDirection(dir);
    setActiveCat(visibleCategories[wrapped].id);
  };

  const goToCategory = (id) => {
    const nextIndex = visibleCategories.findIndex((c) => c.id === id);
    if (nextIndex < 0) return;
    const dir = nextIndex === activeIndex ? 0 : nextIndex > activeIndex ? 1 : -1;
    setDirection(dir);
    setActiveCat(id);
  };

  const onSwipe = (dir) => {
    if (visibleCategories.length < 2) return;
    goToIndex(activeIndex + dir, dir);
  };

  const onSelect = (catId, name) => {
    setSelected((prev) => ({ ...prev, [catId]: name }));
  };

  const onSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <main id="main-content" className={`products-page tone-${activeCat}`}>
      <div className="products-page__botanicals" aria-hidden="true">
        <img
          src={graphicTl}
          alt=""
          className="products-page__graphic products-page__graphic--tl"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src={graphicBr}
          alt=""
          className="products-page__graphic products-page__graphic--br"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <ProductLeaf className="products-page__leaf products-page__leaf--a" />
        <ProductLeaf className="products-page__leaf products-page__leaf--b" />
      </div>

      <header className="prod-hero">
        <motion.p
          className="prod-hero__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          Our Products
        </motion.p>
        <motion.h1
          className="prod-hero__title"
          initial="hidden"
          animate="show"
          variants={headingReveal}
        >
          Premium Poultry, Meat & Seafood
        </motion.h1>
        <motion.p
          className="prod-hero__sub"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
        >
          Freshly sourced. Expertly processed. Delivered with uncompromising quality.
        </motion.p>

        <label
          className="prod-search"
          htmlFor="product-search"
          onClick={() => searchInputRef.current?.focus()}
        >
          <Search size={18} strokeWidth={2} aria-hidden="true" />
          <input
            ref={searchInputRef}
            id="product-search"
            type="text"
            value={query}
            onChange={onSearchChange}
            placeholder="Search products..."
            autoComplete="off"
            spellCheck={false}
          />
          {filteredCount !== null && (
            <span className="prod-search__count">
              {filteredCount} match{filteredCount === 1 ? "" : "es"}
            </span>
          )}
        </label>
        {normalizedQuery && filteredCount === 0 && (
          <p className="prod-search__none">No products found for “{query.trim()}”.</p>
        )}
      </header>

      <nav className="prod-pills" aria-label="Product categories">
        <div className="prod-pills__inner">
          {categories.map((cat) => {
            const disabled = normalizedQuery && !(matchMap[cat.id]?.length > 0);
            return (
              <button
                key={cat.id}
                type="button"
                className={`prod-pill ${activeCat === cat.id ? "is-active" : ""} ${disabled ? "is-disabled" : ""}`}
                onClick={() => !disabled && goToCategory(cat.id)}
                disabled={disabled}
              >
                {cat.pill}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="prod-carousel" aria-roledescription="carousel">
        {visibleCategories.length > 1 && (
          <button
            type="button"
            className="prod-carousel__nav prod-carousel__nav--prev"
            aria-label="Previous category"
            onClick={() => onSwipe(-1)}
          >
            <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
        )}

        <div className="prod-carousel__viewport">
          <AnimatePresence initial={false} custom={direction}>
            {activeCategory && (
              <CategorySection
                key={activeCategory.id}
                category={activeCategory}
                selected={selected}
                onSelect={onSelect}
                query={query}
                priority
                direction={direction}
                flip={activeIndex % 2 === 1}
                onSwipe={onSwipe}
              />
            )}
          </AnimatePresence>
        </div>

        {visibleCategories.length > 1 && (
          <button
            type="button"
            className="prod-carousel__nav prod-carousel__nav--next"
            aria-label="Next category"
            onClick={() => onSwipe(1)}
          >
            <ChevronRight size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
        )}

        {visibleCategories.length > 1 && (
          <div className="prod-carousel__dots" role="tablist" aria-label="Category slides">
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={cat.id === activeCat}
                aria-label={cat.pill}
                className={`prod-carousel__dot ${cat.id === activeCat ? "is-active" : ""}`}
                onClick={() => goToCategory(cat.id)}
              />
            ))}
          </div>
        )}

        <p className="prod-carousel__hint">Swipe to browse categories</p>
      </div>

      <motion.section
        className="prod-cta"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease }}
      >
        <p className="prod-cta__eyebrow">Bulk Orders</p>
        <h2 className="prod-cta__title">Need Bulk Supply?</h2>
        <p className="prod-cta__lead">
          Whether you&apos;re a restaurant, hotel, caterer, retailer, or wholesaler, we can
          deliver fresh products tailored to your business.
        </p>
        <div className="prod-cta__actions">
          <Link to="/#bulk" className="prod-cta__btn prod-cta__btn--primary">
            Bulk Order
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          <Link to="/#network" className="prod-cta__btn prod-cta__btn--ghost">
            View Warehouse
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
