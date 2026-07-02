"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const PANEL_HEIGHT = 'clamp(520px, 78vh, 780px)';
const LEVEL_OFFSET = 'clamp(40px, 6vw, 90px)';

function PersonPanel({ person, index, isActive, height, aspectRatio, marginTop, fill, onEnter, onLeave }) {
  return (
    <motion.div
      style={{
        position: 'relative',
        ...(fill ? { flex: '1 1 0', minWidth: '240px' } : { width: '100%' }),
        height,
        aspectRatio,
        marginTop: marginTop || 0,
        overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${isActive ? '#D1A261' : 'rgba(209,162,97,0.15)'}`,
        transition: 'border-color 0.4s ease',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {person.headshot ? (
        <motion.img
          src={person.headshot}
          alt={person.name || ''}
          className="absolute inset-0 w-full h-full object-cover object-top"
          animate={{ scale: isActive ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: '#1a1a1a' }} />
      )}

      {/* Dark overlay, matching the Cards component treatment */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0) 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 65%)', opacity: isActive ? 1 : 0, transition: 'opacity 0.5s' }} />

      {/* Caption rendered inside the image */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <motion.div
          animate={{ width: isActive ? '40px' : '20px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '1px', background: '#D1A261', marginBottom: '12px' }}
        />
        <p style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 400, fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
          color: '#fff',
          lineHeight: 1.2, marginBottom: '4px',
        }}>
          {person.name}
        </p>
        <p style={{
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontWeight: 500, fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: isActive ? '#D1A261' : 'rgba(209,162,97,0.75)',
          transition: 'color 0.3s ease',
        }}>
          {person.title}
        </p>
        {person.bio && (
          <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.8rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', marginTop: '10px' }}>
            {person.bio}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function People({ content, isKiosk }) {
  const people = content?.people?.people ?? [];
  const [active, setActive] = useState(null);

  return (
    <section style={{ background: '#0a0a0a', paddingTop: '7rem', paddingBottom: '2.5rem' }}>
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

      {/* ── Desktop/tablet: filmstrip of tall portrait panels, staggered ── */}
      <div className="hidden md:flex overflow-x-auto" style={{ paddingTop: '24px', paddingBottom: '8px', paddingLeft: 'clamp(20px, 4vw, 64px)', paddingRight: 'clamp(20px, 4vw, 64px)' }}>
        <div className="flex items-start mx-auto w-full" style={{ maxWidth: '1800px', gap: 'clamp(4px, 0.8vw, 10px)' }} {...content?.$?.people}>
          {people.length === 0 && [0, 1, 2, 3].map((_, i) => (
            <div key={i} className="animate-pulse" style={{
              flex: '1 1 0', minWidth: '240px',
              height: i % 2 === 1 ? `calc(${PANEL_HEIGHT} - ${LEVEL_OFFSET})` : PANEL_HEIGHT,
              marginTop: i % 2 === 1 ? LEVEL_OFFSET : 0,
              background: 'rgba(255,255,255,0.06)',
            }} />
          ))}

          {people.map((person, index) => (
            <PersonPanel
              key={index}
              person={person}
              index={index}
              isActive={active === index}
              height={index % 2 === 1 ? `calc(${PANEL_HEIGHT} - ${LEVEL_OFFSET})` : PANEL_HEIGHT}
              marginTop={index % 2 === 1 ? LEVEL_OFFSET : 0}
              fill
              onEnter={() => setActive(index)}
              onLeave={() => setActive(null)}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile: normal cards stacked vertically ── */}
      <div className="flex md:hidden flex-col px-6" style={{ gap: '24px' }} {...content?.$?.people}>
        {people.length === 0 && [0, 1, 2].map((_, i) => (
          <div key={i} className="animate-pulse" style={{ width: '100%', aspectRatio: '5 / 6', background: 'rgba(255,255,255,0.06)' }} />
        ))}

        {people.map((person, index) => (
          <PersonPanel
            key={index}
            person={person}
            index={index}
            isActive={false}
            aspectRatio="5 / 6"
          />
        ))}
      </div>
    </section>
  );
}
