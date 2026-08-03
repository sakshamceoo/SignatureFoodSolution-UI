import { memo, useEffect, useRef, useState } from "react";
import bannerVideo from "../assets/banner.mp4";
import "./BackgroundVideo.css";

/**
 * Fully memoized — parent scroll animations must not remount or restart playback.
 * HD source loads lazily after idle so first paint stays fast.
 */
const BackgroundVideo = memo(function BackgroundVideo() {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timeoutId;

    const kickoff = () => setShouldLoad(true);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(kickoff, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(kickoff, 400);
    }

    return () => {
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    video.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div className="bg-video" aria-hidden="true">
      <div className={`bg-video__poster ${ready ? "is-hidden" : ""}`} />
      {shouldLoad && (
        <video
          ref={videoRef}
          className={`bg-video__el ${ready ? "is-ready" : ""}`}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onCanPlay={() => setReady(true)}
        >
          <source src={bannerVideo} type="video/mp4" />
        </video>
      )}
      <div className="bg-video__veil" />
      <div className="bg-video__vignette" />
    </div>
  );
});

export default BackgroundVideo;
