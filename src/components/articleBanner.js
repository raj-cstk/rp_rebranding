'use client';
import { cslp } from "@/lib/cstack";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ArticleBanner({ content }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!content?.articles?.length) return (
    <div className="h-[800px] visual-builder__empty-block-parent" {...content?.$?.articles} />
  );

  return (
    <section style={{ background: content?.background?.hex || 'var(--color-section-bg)' }} className="w-full py-28 px-6">
      <div>

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
            {content?.heading || 'Explore With Us'}
          </span>
        </motion.div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" {...content?.$?.articles}>
          {content.articles.map((article, index) => {
            const isHovered = hoveredCard === index;
            const videoUrl = article?.video_options?.video?.url;
            const imageUrl = article?.banner_image?.url;

            return (
              <motion.div
                key={article?.uid || index}
                className="relative overflow-hidden cursor-pointer"
                style={{ height: '520px' }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                {...cslp(content, 'articles__', index)}
              >
                {/* Background media */}
                {videoUrl ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={videoUrl}
                    autoPlay muted loop playsInline
                    style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                      backgroundColor: imageUrl ? 'transparent' : '#1a1a1a',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    {...article?.$?.banner_image}
                  />
                )}

                {/* Gradients */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0) 55%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0) 60%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s' }} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {article?.taxonomies?.length > 0 ? article.taxonomies.map((tax, i) => (
                      <Link
                        key={i}
                        href={`/articles/categories/${tax.term_uid}`}
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.5)', padding: '3px 8px', opacity: isHovered ? 1 : 0.7, transition: 'opacity 0.3s' }}
                      >
                        {tax.term_uid}
                      </Link>
                    )) : (
                      <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#D1A261', opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                        0{index + 1}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', lineHeight: 1.2, color: '#fff', marginTop: '0.5rem', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }} {...article?.$?.title}>
                    {article?.title}
                  </h3>

                  {/* Gold rule */}
                  <div style={{ height: '1px', overflow: 'hidden', margin: '1rem 0' }}>
                    <div style={{ height: '1px', background: '#D1A261', width: isHovered ? '64px' : '32px', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>

                  {/* Teaser — appears on hover */}
                  <motion.div
                    initial={false}
                    animate={{ height: isHovered ? 'auto' : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.65)', paddingBottom: '12px' }} {...article?.$?.teaser}>
                      {article?.teaser}
                    </p>
                  </motion.div>

                  {/* Read more */}
                  <div style={{ overflow: 'hidden', height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.3s 0.1s, transform 0.3s 0.1s' }}>
                    <Link
                      href={article?.url || '#'}
                      className="inline-flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1A261' }}
                    >
                      Read Article
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
