import { useEffect, useRef, useState } from "react";

/**
 * Loads video src only when near viewport; pauses when offscreen.
 * `loader` should be () => import("../assets/foo.mp4") so the file stays out of the critical path until needed.
 */
export default function LazyVideo({
  loader,
  className,
  "aria-label": ariaLabel,
  style,
  poster,
}) {
  const ref = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          el.pause();
          return;
        }

        if (!src) {
          loader().then((mod) => {
            if (!cancelled) setSrc(mod.default);
          });
        } else {
          el.play().catch(() => {});
        }
      },
      { rootMargin: "200px", threshold: 0.05 },
    );

    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [loader, src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    el.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src || undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={ariaLabel}
      style={style}
    />
  );
}
