"use client";
import { useState, useRef, useEffect, useCallback } from "react";

function isLightColor(hex) {
  const c = (hex || '').replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

const PIXELS_PER_SEC = 55; // constant scroll speed regardless of content/repeat amount

export default function CtaStrip({ content }) {
  const lines    = content?.line ?? [];
  const movement = content?.movement ?? 'R2L';
  const bg       = content?.background?.hex || '#0a0a0a';

  const containerRef = useRef(null);
  const setRef       = useRef(null);
  // Start with a generous guess so there's no visible gap before we can measure.
  const [repeatCount, setRepeatCount] = useState(6);
  const [setWidth, setSetWidth]       = useState(0);

  const recalc = useCallback(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const singleWidth    = setRef.current?.offsetWidth || 0;
    if (!containerWidth || !singleWidth) return;
    // One Track must be at least as wide as the container so two Tracks
    // side by side always cover 2x the container width - no gaps, ever.
    setRepeatCount(Math.max(1, Math.ceil(containerWidth / singleWidth)) + 1);
    setSetWidth(singleWidth);
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [recalc, lines.join('|')]);

  if (lines.length === 0) return null;

  const light      = isLightColor(bg);
  const textColor  = light ? '#1a1a1a' : '#ffffff';
  const accentColor = '#D1A261';
  const isStatic   = movement === '0';
  const animName   = movement === 'L2R' ? 'ctaL2R' : 'ctaR2L';

  const trackWidth = setWidth * repeatCount;
  const duration   = (trackWidth ? Math.max(10, trackWidth / PIXELS_PER_SEC) : 30) + 's';

  const LineSet = ({ hidden }) => (
    <div aria-hidden={hidden || undefined} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(0.6rem, 0.85vw, 0.78rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: textColor,
            whiteSpace: 'nowrap',
          }}>
            {line}
          </span>
          <span style={{
            color: accentColor,
            fontSize: '0.4rem',
            margin: '0 clamp(20px, 3vw, 48px)',
            flexShrink: 0,
          }}>
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  const Track = ({ aria = false }) => (
    <div
      aria-hidden={aria || undefined}
      style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
      {...(!aria ? content?.$?.line : {})}
    >
      {Array.from({ length: repeatCount }).map((_, r) => (
        <LineSet key={r} hidden={aria || r > 0} />
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes ctaR2L {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ctaL2R {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          background: bg,
          overflow: 'hidden',
          position: 'relative',
          padding: 'clamp(14px, 1.8vh, 22px) 0',
          borderTop: `1px solid ${light ? 'rgba(0,0,0,0.08)' : 'rgba(209,162,97,0.18)'}`,
          borderBottom: `1px solid ${light ? 'rgba(0,0,0,0.08)' : 'rgba(209,162,97,0.18)'}`,
        }}
      >
        {isStatic ? (
          /* Static: centered, no animation */
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} {...content?.$?.line}>
            {lines.map((line, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(0.6rem, 0.85vw, 0.78rem)',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: textColor,
                }}>
                  {line}
                </span>
                {i < lines.length - 1 && (
                  <span style={{ color: accentColor, fontSize: '0.4rem', margin: '0 clamp(20px, 3vw, 48px)' }}>◆</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          /* Animated: two equal-width tracks, each pre-filled with enough
             repeats of the line set to span the full container width, so the
             marquee is always visually full - it never thins out to a gap. */
          <div style={{
            display: 'inline-flex',
            animation: `${animName} ${duration} linear infinite`,
          }}>
            <Track />
            <Track aria />
          </div>
        )}

        {/* Off-screen probe: measures the natural width of one un-repeated line set. */}
        <div
          ref={setRef}
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden', display: 'inline-flex', whiteSpace: 'nowrap' }}
        >
          <LineSet hidden />
        </div>
      </div>
    </>
  );
}
