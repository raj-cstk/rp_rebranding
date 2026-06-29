'use client';
import StarRating from "@/helpers/StarRating";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Reviews({ content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviews = content?.testimonials?.[0]?.reviews ?? [];

  useEffect(() => {
    if (!reviews.length) return;
    const t = setTimeout(() => setActiveIndex(i => (i + 1) % reviews.length), 7000);
    return () => clearTimeout(t);
  }, [activeIndex, reviews.length]);

  if (!content) return null;
  const t = content?.testimonials?.[0];

  return (
    <section className="w-full" style={{ background: content?.background?.hex || 'var(--color-section-bg)' }}>
      {content?.testimonials?.length === 0 && (
        <div className="h-[400px] visual-builder__empty-block-parent mx-auto w-full" {...content?.$?.testimonials} />
      )}

      {content?.testimonials?.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — static info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }} className="mb-4">
              — What Our Guests Say
            </p>

            <h2 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', lineHeight: 1.15, color: '#0a0a0a' }} {...t?.$?.headline}>
              {t?.headline}
            </h2>

            <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.85, color: '#6b6560', marginTop: '1rem', maxWidth: '420px' }} {...t?.$?.body}>
              {t?.body}
            </p>

            {t?.ratings?.length > 0 && (
              <div className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5">
                {t.ratings.map((r, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <StarRating rating={r.star_rating} color="#D1A261" size={12} {...r?.$?.star_rating} />
                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9a9590', fontWeight: 500 }} {...r?.$?.category}>
                      {r?.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT — rotating quote */}
          <div className="relative">
            <span aria-hidden style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '9rem', lineHeight: 0.8, color: '#D1A261', position: 'absolute', top: '-3rem', left: '-1.5rem', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
              &ldquo;
            </span>

            <div className="relative" style={{ zIndex: 1 }}>
              <div style={{ position: 'relative', height: '190px' }}>
                <AnimatePresence mode="wait">
                  {reviews.map((review, i) => activeIndex === i ? (
                    <motion.div key={i}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p
                        style={{
                          fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif',
                          fontWeight: 400,
                          fontStyle: 'italic',
                          fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
                          lineHeight: 1.7,
                          color: '#1a1410',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                        }}
                        dangerouslySetInnerHTML={{ __html: review?.review?.[0]?.review }}
                        {...review?.review?.[0]?.$?.review}
                      />

                      <div className="mt-5 flex items-center gap-4">
                        <span className="w-8 h-px bg-[#D1A261]" />
                        <div>
                          <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a1410' }} {...review?.review?.[0]?.$?.reviewer_name}>
                            {review?.review?.[0]?.reviewer_name}
                          </p>
                          <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.75rem', color: '#9a9590', marginTop: '2px', letterSpacing: '0.05em' }} {...review?.review?.[0]?.$?.reviewer_city}>
                            {review?.review?.[0]?.reviewer_city}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null)}
                </AnimatePresence>
              </div>

              {reviews.length > 1 && (
                <div className="flex gap-2 mt-6">
                  {reviews.map((_, i) => (
                    <button key={i} onClick={() => setActiveIndex(i)} style={{ width: activeIndex === i ? '24px' : '5px', height: '5px', borderRadius: '99px', background: activeIndex === i ? '#D1A261' : '#d4cec8', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} aria-label={`Review ${i + 1}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
