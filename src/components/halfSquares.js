"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HalfSquares({ content }) {
  const imageUrl = content?.image?.url?.trim();
  const hasValidImage = imageUrl?.length > 0;
  const videoUrl = content?.video_options?.video?.url?.trim();
  const hasValidVideo = videoUrl?.length > 0;
  const isVideoAutoplay = content?.video_options?.video_controls === "Autoplay";
  const showControls = content?.video_options?.video_controls === "Show Controls";
  const videoLoop = content?.video_options?.in_loop;
  const isRight = content?.media_align === "Right";

  return (
    <div className="w-full" style={{ minHeight: '100vh', display: 'flex' }} {...content?.$?.media_align}>
      <div className={`flex w-full ${isRight ? 'flex-row-reverse' : 'flex-row'} max-md:flex-col`}>

        {/* MEDIA */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '100vh' }}>
          {hasValidVideo ? (
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay={isVideoAutoplay} controls={showControls} muted={isVideoAutoplay} loop={isVideoAutoplay ? true : showControls ? videoLoop : false} playsInline>
              <source src={videoUrl} />
            </video>
          ) : hasValidImage ? (
            <>
              <motion.div
                className="absolute inset-0"
                style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                {...content?.$?.image}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent, rgba(0,0,0,0.08))' }} />
            </>
          ) : (
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center" {...content?.$?.image}>
              <svg className="w-10 h-10 text-neutral-700" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="flex-1 flex items-center" style={{ background: content?.background?.hex || '#111', minHeight: '100vh' }}>
          <motion.div
            className="px-16 py-24 max-w-xl"
            initial={{ opacity: 0, x: isRight ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontFamily: 'var(--font-cormorant-garamond), serif', fontSize: '5rem', fontWeight: 300, color: 'rgba(209,162,97,0.12)', lineHeight: 1, marginBottom: '-1rem' }}>
              01
            </p>

            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500, display: 'block', marginBottom: '1.5rem' }}>
              Red Panda Resort
            </span>

            <h2 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 1.1, color: '#ffffff', letterSpacing: '-0.01em' }} {...content?.$?.headline}>
              {content?.headline}
            </h2>

            <div style={{ width: '40px', height: '1px', background: '#D1A261', margin: '2rem 0' }} />

            <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '1.05rem', lineHeight: 2, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }} {...content?.$?.body}>
              {content?.body}
            </p>

            {content?.page && (
              <Link href={content?.page?.[0]?.url || '#'} className="group mt-12 inline-flex items-center gap-4 transition-all duration-300"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D1A261', borderBottom: '1px solid rgba(209,162,97,0.3)', paddingBottom: '6px' }}
                {...content?.$?.button_text}>
                {content?.button_text}
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
