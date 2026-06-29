"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

function ArrowButton({ direction, onClick }) {
  const [hovered, setHovered] = useState(false);
  const r = 22;
  const circ = 2 * Math.PI * r;
  const isLeft = direction === -1;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isLeft ? "Previous slide" : "Next slide"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "block" }}
    >
      <svg width="52" height="52" viewBox="0 0 52 52" style={{ display: "block" }}>
        <circle cx="26" cy="26" r={r} fill="rgba(232,213,176,0.06)" />
        <circle
          cx="26" cy="26" r={r}
          fill="none"
          stroke="#E8D5B0"
          strokeWidth="1"
          strokeDasharray={String(circ)}
          strokeDashoffset={String(hovered ? 0 : circ)}
          style={{
            transition: "stroke-dashoffset 0.45s ease",
            transformOrigin: "26px 26px",
            transform: "rotate(-90deg)",
          }}
        />
        {isLeft
          ? <path d="M29 18 L21 26 L29 34" stroke={hovered ? "#E8D5B0" : "rgba(232,213,176,0.55)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }} />
          : <path d="M23 18 L31 26 L23 34" stroke={hovered ? "#E8D5B0" : "rgba(232,213,176,0.55)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }} />
        }
      </svg>
    </button>
  );
}

export default function ImageGrid({ content }) {
  const images = content?.image || [];
  const count = images.length;

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [reduced, setReduced] = useState(false);

  const kbControls = useAnimation();
  const pointerStart = useRef(null);
  const DURATION_TRANSITION = 850;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    kbControls.stop();
    kbControls.set({ scale: 1 });
    if (!paused) kbControls.start({ scale: 1.05, transition: { duration: 6, ease: "linear" } });
  }, [current, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (paused) kbControls.stop();
    else kbControls.start({ scale: 1.05, transition: { duration: 6, ease: "linear" } });
  }, [paused, reduced]);

  const advance = useCallback((d) => {
    if (transitioning || count <= 1) return;
    setTransitioning(true);
    setPrev(current);
    setDir(d);
    setCurrent(i => (i + d + count) % count);
    setTimeout(() => setTransitioning(false), DURATION_TRANSITION + 100);
  }, [current, count, transitioning]);

  const goTo = useCallback((i) => {
    if (transitioning || i === current) return;
    setTransitioning(true);
    setPrev(current);
    setDir(i > current ? 1 : -1);
    setCurrent(i);
    setTimeout(() => setTransitioning(false), DURATION_TRANSITION + 100);
  }, [current, transitioning]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setTimeout(() => advance(1), 5000);
    return () => clearTimeout(t);
  }, [current, paused, advance, count]);

  useEffect(() => {
    if (typeof window === "undefined" || count <= 1) return;
    const next = (current + 1) % count;
    const img = new window.Image();
    img.src = images[next]?.image?.url;
  }, [current, images, count]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") advance(1);
      if (e.key === "ArrowLeft") advance(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance]);

  const onPointerDown = (e) => { pointerStart.current = e.clientX; };
  const onPointerUp = (e) => {
    if (pointerStart.current === null) return;
    const delta = e.clientX - pointerStart.current;
    if (Math.abs(delta) > 48) advance(delta < 0 ? 1 : -1);
    pointerStart.current = null;
  };

  if (count === 0) return (
    <div className="h-[600px] visual-builder__empty-block-parent" {...content?.$?.image} />
  );

  const curr = images[current];
  const prevImg = prev !== null ? images[prev] : null;
  const outgoingClip = dir > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const incomingX = reduced ? 0 : dir > 0 ? "3%" : "-3%";

  return (
    <section style={{ background: "var(--color-section-bg)" }}>
      <div
        style={{ position: "relative", height: "clamp(420px, 72vh, 860px)", overflow: "hidden", cursor: "grab", userSelect: "none" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Resort gallery"
        {...content?.$?.image}
      >
        {/* Gallery label */}
        <div style={{ position: "absolute", top: "2rem", left: "2.5rem", zIndex: 4, display: "flex", alignItems: "center", gap: "10px", pointerEvents: "none" }}>
          <span style={{ display: "block", width: "28px", height: "1px", background: "#E8D5B0" }} />
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: "0.56rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#E8D5B0", fontWeight: 500 }}>
            Our Gallery
          </span>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {`Slide ${current + 1} of ${count}${curr?.text ? ": " + curr.text : ""}`}
        </div>

        {/* Incoming slide */}
        <motion.div
          key={current}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
          initial={reduced ? { opacity: 0 } : { x: incomingX }}
          animate={reduced ? { opacity: 1 } : { x: "0%" }}
          transition={reduced ? { duration: 0.35 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={kbControls}
            initial={{ scale: 1 }}
            style={{
              position: "absolute",
              inset: "-5%",
              backgroundImage: curr?.image?.url ? `url(${curr.image.url})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            {...curr?.$?.image}
          />
        </motion.div>

        {/* Outgoing slide */}
        {prevImg && (
          <motion.div
            key={`out-${prev}`}
            style={{ position: "absolute", inset: 0, zIndex: 2 }}
            initial={{ clipPath: "inset(0 0% 0 0)" }}
            animate={{ clipPath: outgoingClip }}
            transition={reduced ? { duration: 0.35 } : { duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => setPrev(null)}
          >
            <div style={{
              position: "absolute", inset: "-5%",
              transform: "scale(1.05)",
              backgroundImage: prevImg?.image?.url ? `url(${prevImg.image.url})` : "none",
              backgroundSize: "cover", backgroundPosition: "center",
            }} />
          </motion.div>
        )}

        {/* Gradient vignette */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(to top, rgba(11,28,44,0.9) 0%, rgba(11,28,44,0.25) 45%, rgba(11,28,44,0) 72%)",
        }} />

        {/* Caption */}
        {curr?.text && (
          <motion.div
            key={`caption-${current}`}
            style={{ position: "absolute", bottom: "5rem", left: "3rem", maxWidth: "400px", zIndex: 4 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.38 }}
          >
            <motion.h3
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                fontWeight: 200,
                fontSize: "clamp(0.95rem, 1.6vw, 1.45rem)",
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: "#E8D5B0",
                margin: 0,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.44 }}
              {...curr?.$?.text}
            >
              {curr.text}
            </motion.h3>
          </motion.div>
        )}

        {/* Arrows */}
        {count > 1 && (
          <>
            <div style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>
              <ArrowButton direction={-1} onClick={() => advance(-1)} />
            </div>
            <div style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>
              <ArrowButton direction={1} onClick={() => advance(1)} />
            </div>
          </>
        )}

        {/* Dot indicators */}
        {count > 1 && (
          <div style={{ position: "absolute", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 5 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                style={{
                  height: "4px",
                  width: i === current ? "28px" : "4px",
                  borderRadius: "99px",
                  background: i === current ? "#E8D5B0" : "rgba(232,213,176,0.28)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s",
                }}
              />
            ))}
          </div>
        )}

        {/* Slide counter */}
        <div style={{ position: "absolute", bottom: "1.6rem", right: "2rem", zIndex: 5, pointerEvents: "none" }}>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: "0.56rem", letterSpacing: "0.25em", color: "rgba(232,213,176,0.3)" }}>
            {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
