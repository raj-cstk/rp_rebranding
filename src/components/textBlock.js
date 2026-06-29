"use client";
import { motion } from "framer-motion";

export default function TextBlock({ content }) {
  if (!content?.headline && !content?.body) return null;

  return (
    <div
      className="w-full py-22 px-6 overflow-hidden"
      style={{ backgroundColor: 'var(--color-section-bg)' }}
    >
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Eyebrow line */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="block h-px bg-[#D1A261]" style={{ width: '48px' }} />
          <span
            style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 500,
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#D1A261',
            }}
          >
            Red Panda Resort
          </span>
          <span className="block h-px bg-[#D1A261]" style={{ width: '48px' }} />
        </motion.div>

        {/* Headline */}
        {content?.headline && (
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: '#1a1410',
            }}
            {...content?.$?.headline}
          >
            {content.headline}
          </h2>
        )}

        {/* Gold divider */}
        <motion.div
          className="mx-auto bg-[#D1A261] mt-4 mb-4"
          style={{ height: '1px', width: '40px' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Body */}
        {content?.body && (
          <p
            style={{
              fontFamily: 'var(--font-raleway), sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.85rem, 1.3vw, 0.98rem)',
              lineHeight: 1.75,
              color: '#4a4540',
              letterSpacing: '0.02em',
              whiteSpace: 'pre-wrap',
            }}
            {...content?.$?.body}
          >
            {content.body}
          </p>
        )}
      </motion.div>
    </div>
  );
}
