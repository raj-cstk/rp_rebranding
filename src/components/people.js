"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function People({ content, isKiosk }) {
  const people = content?.people?.people ?? [];
  const [active, setActive] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = e => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const CIRCLE_SIZE = isMobile ? 'clamp(100px, 42vw, 180px)' : 'clamp(180px, 24vw, 360px)';
  const OVERLAP     = isMobile ? 0 : 'clamp(-36px, -4.8vw, -72px)';

  return (
    <section style={{ background: '#0a0a0a', padding: '6rem 0', paddingTop: '7rem' }}>
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'rgba(209,162,97,0.4)' }} />
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261' }}>
              The Team
            </span>
            <span style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'rgba(209,162,97,0.4)' }} />
          </div>
          <h2
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: 1.05 }}
            {...content?.$?.heading}
          >
            {content?.heading}
          </h2>
        </motion.div>

      </div>

      {/* ── MOBILE: vertical stack ── */}
      {isMobile && (
        <div className="flex flex-col items-center gap-10 px-8" {...content?.$?.people}>
          {people.map((person, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-5 w-full"
              style={{ maxWidth: '400px' }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Circle */}
              <div style={{
                width: CIRCLE_SIZE, height: CIRCLE_SIZE,
                borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                border: '3px solid rgba(209,162,97,0.3)',
              }}>
                {person.headshot
                  ? <img src={person.headshot} alt={person.name || ''} className="w-full h-full object-cover object-top" />
                  : <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
                }
              </div>

              {/* Info */}
              <div>
                <div style={{ width: '20px', height: '1px', background: '#D1A261', marginBottom: '8px' }} />
                <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: '1.2rem', color: '#fff', lineHeight: 1.2, marginBottom: '4px' }}>
                  {person.name}
                </p>
                <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1A261' }}>
                  {person.title}
                </p>
                {person.bio && (
                  <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                    {person.bio}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── DESKTOP: overlapping horizontal row ── */}
      {!isMobile && (
        <div
          className="flex justify-center overflow-x-auto"
          style={{ paddingTop: '24px', marginTop: '-24px', paddingBottom: '8px', paddingLeft: '5vw', paddingRight: '5vw' }}
          {...content?.$?.people}
        >
          <div className="flex items-start" style={{ minWidth: 'max-content' }}>
            {people.length === 0 && [0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="animate-pulse rounded-full" style={{
                width: CIRCLE_SIZE, height: CIRCLE_SIZE,
                background: 'rgba(255,255,255,0.07)',
                border: '4px solid #0a0a0a',
                marginLeft: i === 0 ? 0 : OVERLAP,
                position: 'relative', zIndex: i, flexShrink: 0,
              }} />
            ))}

            {people.map((person, index) => {
              const isActive = active === index;
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: isActive ? 50 : index,
                    marginLeft: index === 0 ? 0 : OVERLAP,
                    flexShrink: 0,
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  onHoverStart={() => setActive(index)}
                  onHoverEnd={() => setActive(null)}
                >
                  {/* Circle photo */}
                  <motion.div
                    animate={{ y: isActive ? -14 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: CIRCLE_SIZE, height: CIRCLE_SIZE,
                      borderRadius: '50%', overflow: 'hidden',
                      border: `4px solid ${isActive ? '#D1A261' : '#0a0a0a'}`,
                      cursor: 'pointer', flexShrink: 0,
                      transition: 'border-color 0.3s ease',
                    }}
                  >
                    {person.headshot ? (
                      <motion.img
                        src={person.headshot}
                        alt={person.name || ''}
                        className="w-full h-full object-cover object-top"
                        animate={{ scale: isActive ? 1.08 : 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
                    )}
                  </motion.div>

                  {/* Info */}
                  <div className="text-center mt-5" style={{ width: CIRCLE_SIZE }}>
                    <motion.div
                      animate={{ width: isActive ? '40px' : '20px' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '1px', background: '#D1A261', margin: '0 auto 10px' }}
                    />
                    <p style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontWeight: 400, fontStyle: 'italic',
                      fontSize: 'clamp(0.95rem, 1.2vw, 1.25rem)',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                      lineHeight: 1.2, marginBottom: '4px',
                      transition: 'color 0.3s ease',
                    }}>
                      {person.name}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 500, fontSize: '0.55rem',
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: isActive ? '#D1A261' : 'rgba(209,162,97,0.45)',
                      transition: 'color 0.3s ease',
                    }}>
                      {person.title}
                    </p>
                    {person.bio && (
                      <motion.p
                        animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.35)', marginTop: '8px', overflow: 'hidden' }}
                      >
                        {person.bio}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
