'use client';
import { cslp } from "@/lib/cstack";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Cards({ content }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!content?.card?.length) return (
    <div className="h-[800px] visual-builder__empty-block-parent" {...content?.$?.card} />
  );

  return (
    <section style={{ background: content?.background_color?.hex || '#0a0a0a' }} className="w-full py-28 px-6" {...content?.$?.background_color}>
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-12 h-px bg-[#D1A261]" />
          <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }}>
            Our Experiences
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" {...content?.$?.card}>
          {content.card.map((data, index) => {
            const href = data?.page?.length > 0 && data?.page?.[0]?.url ? data?.page?.[0]?.url : null;
            const isHovered = hoveredCard === index;
            return (
              <motion.div
                key={index}
                className="relative overflow-hidden cursor-pointer"
                style={{ height: '540px' }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                {...cslp(content, 'card__', index)}
              >
                {/* Background image */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: data?.image?.url ? `url(${data.image.url})` : 'none',
                    backgroundColor: data?.image?.url ? 'transparent' : '#1a1a1a',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  {...data?.$?.image}
                />

                {/* Gradients */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0) 55%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0) 60%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s' }} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {data?.tags?.length > 0 ? data.tags.map((tag, i) => (
                      <span key={i} style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.5)', padding: '3px 8px', opacity: isHovered ? 1 : 0.7, transition: 'opacity 0.3s' }}>
                        {tag}
                      </span>
                    )) : (
                      <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#D1A261', opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                        0{index + 1}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.2, color: '#fff', marginTop: '0.5rem' }} {...data?.$?.headline}>
                    {data?.headline}
                  </h3>

                  {/* Gold rule */}
                  <div style={{ height: '1px', overflow: 'hidden', margin: '1rem 0' }}>
                    <div style={{ height: '1px', background: '#D1A261', width: isHovered ? '64px' : '32px', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>

                  {/* Body revealed on hover */}
                  <motion.div
                    initial={false}
                    animate={{ height: isHovered ? 'auto' : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.65)', paddingBottom: '12px' }} {...data?.$?.body}>
                      {data?.body}
                    </p>
                  </motion.div>

                  {(data?.button_text || href) && (
                    <div style={{ overflow: 'hidden', height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.3s 0.1s, transform 0.3s 0.1s' }}>
                      <Link href={href || '#'}
                        className="inline-flex items-center gap-2"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1A261' }}
                        {...data?.$?.button_text}>
                        {data?.button_text || 'Discover'}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
