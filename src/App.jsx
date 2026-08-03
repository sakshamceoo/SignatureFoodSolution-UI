import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import {
  WhoAreWe,
  BulkOrder,
  Career,
  Contact,
  Faq,
  Footer,
} from "./components/Sections";
import Seo from "./seo/Seo";

const ProductsPage = lazy(() => import("./components/ProductsPage"));
const OurStory = lazy(() => import("./components/OurStory"));
const WarehouseNetwork = lazy(() => import("./components/WarehouseNetwork"));

function RouteFallback() {
  return <div className="route-fallback" aria-hidden="true" />;
}

/** Mount children only when near viewport — defers heavy section chunks. */
function DeferUntilVisible({ children, minHeight = 420, rootMargin = "280px" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || show) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <WhoAreWe />
        <DeferUntilVisible minHeight={520}>
          <Suspense fallback={<div style={{ minHeight: 520 }} aria-hidden="true" />}>
            <WarehouseNetwork />
          </Suspense>
        </DeferUntilVisible>
        <BulkOrder />
        <Career />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const prefetch = () => {
      import("./components/ProductsPage");
      import("./components/OurStory");
      import("./components/WarehouseNetwork");
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(prefetch, 3000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Seo />
      <Navbar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={
              <>
                <ProductsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/story"
            element={
              <>
                <OurStory />
                <Footer />
              </>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
