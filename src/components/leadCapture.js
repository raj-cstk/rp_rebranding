"use client"
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LeadCapture({ content }) {
  const [inputValue, setInputValue] = useState("");
  const hasImage = Boolean(content?.image?.url);

  function clickHandle(event) {
    event.preventDefault();
    jstag.send({ "email": inputValue });
    setInputValue("");
  }
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row w-full">

        {/* Text + form */}
        <div
          className={`w-full ${hasImage ? 'md:w-1/2' : ''} flex items-center ${!hasImage ? 'justify-center' : ''}`}
          style={{ background: content?.background_color?.hex || '#ebebeb', minHeight: 'clamp(420px, 58vh, 600px)' }}
        >
          <motion.div
            className={`px-8 md:px-12 py-14 w-full ${!hasImage ? 'max-w-2xl mx-auto text-center' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500, display: 'block', marginBottom: '1.5rem' }}>
              Stay Connected
            </span>

            <h2 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.15, color: '#1a1410', textTransform: 'none' }} {...content?.$?.title}>
              {content?.title}
            </h2>

            <div style={{ width: '40px', height: '1px', background: '#D1A261', margin: hasImage ? '1.5rem 0' : '1.5rem auto' }} />

            <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, color: '#6b6560' }} {...content?.$?.description}>
              {content?.description}
            </p>

            <form onSubmit={clickHandle} className="flex mt-10">
              <input
                className="flex-1 min-w-0"
                style={{
                  fontFamily: 'var(--font-raleway), sans-serif',
                  fontWeight: 300,
                  fontSize: '0.88rem',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRight: 'none',
                  color: '#1a1410',
                  padding: '14px 18px',
                  outline: 'none',
                }}
                placeholder={content?.input_label}
                value={inputValue}
                onChange={handleChange}
              />
              <button
                type="submit"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600,
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  background: '#D1A261',
                  color: '#000',
                  padding: '14px 26px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                {...content?.$?.button_text}
              >
                {content?.button_text}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Media — only rendered when an image is set, so the text panel can take the full width otherwise */}
        {hasImage && (
          <div className="relative overflow-hidden w-full md:w-1/2" style={{ minHeight: 'clamp(420px, 58vh, 600px)' }}>
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: `url(${content.image.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              {...content?.$?.image}
            />
          </div>
        )}
      </div>
    </section>
  );
}
