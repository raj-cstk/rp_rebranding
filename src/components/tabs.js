'use client';
import { useState } from "react";
import { cslp } from "@/lib/cstack";
import { motion, AnimatePresence } from "framer-motion";

export default function Tabs({ content }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const select = (i) => { setDir(i > active ? 1 : -1); setActive(i); };

  if (!content?.tabs?.length) return (
    <div className="h-[600px] visual-builder__empty-block-parent py-24" {...content?.$?.tabs} />
  );

  return (
    <section className="w-full overflow-hidden">

      {/* Tab bar */}
      <div style={{ position: 'relative', zIndex: 10, background: 'transparent' }}>
        <div className="flex flex-wrap md:flex-nowrap justify-center items-end gap-4 md:gap-10 overflow-x-auto" style={{ scrollbarWidth: 'none' }} {...content?.$?.tabs}>
          {content.tabs.map((item, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              className="relative shrink-0 py-6 transition-colors duration-200"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: active === i ? 600 : 400, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: active === i ? '#0a0a0a' : '#9a9590', background: 'none', border: 'none', cursor: 'pointer' }}
              {...item?.$?.tab_text}
            >
              {item?.tab_text}
              {active === i && (
                <motion.span layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D1A261]" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div className="overflow-hidden" style={{ minHeight: 'calc(100vh - 73px)', marginTop: '-73px', background: content.tabs[active]?.background_color?.hex || '#fff', transition: 'background 0.3s ease' }}>
        <AnimatePresence mode="wait" custom={dir}>
          {content.tabs.map((item, i) => active !== i ? null : (
            <motion.div
              key={i}
              custom={dir}
              variants={{
                enter: d => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                exit: d => ({ opacity: 0, x: d * -40, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className={`flex w-full ${item?.layout === 'Text Right' ? 'flex-row-reverse' : 'flex-row'} max-md:flex-col`}
              style={{ minHeight: 'calc(100vh - 73px)' }}
              {...cslp(content, 'tabs__', i)}
            >
              {/* Image side */}
              <div className="flex-1 relative overflow-hidden" style={{ minHeight: '60vh', borderRadius: item?.layout === 'Text Right' ? '9999px 0 0 9999px' : '0 9999px 9999px 0' }}>
                {item?.image?.url ? (
                  <motion.div
                    className="absolute inset-0"
                    style={{ backgroundImage: `url(${item.image.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    {...item?.$?.image}
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center" {...item?.$?.image}>
                    <svg className="w-10 h-10 text-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Text side */}
              <div className="flex-1 flex items-center px-14 py-20" style={{ paddingTop: 'calc(80px + 73px)' }} {...item?.$?.background_color}>
                <div className="max-w-md">
                  <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500, display: 'block', marginBottom: '1.5rem' }}>
                    {item?.tab_text}
                  </span>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', lineHeight: 1.15, color: '#0a0a0a', marginBottom: '1.5rem' }} {...item?.$?.title}>
                    {item?.title}
                  </h3>
                  <div style={{ width: '36px', height: '1px', background: '#D1A261', marginBottom: '1.5rem' }} />
                  <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '1rem', lineHeight: 1.95, color: '#4a4540' }} {...item?.$?.body}>
                    {item?.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
