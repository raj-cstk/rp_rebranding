'use client';
import { useRecommendations } from "@/context/lyticsTracking";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RecommendationsBanner({ content }) {
    const recommendations = useRecommendations();
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <section className="w-full py-10 md:py-14 px-4 md:px-6" style={{ background: '#D1A261' }}>
            <div className="max-w-7xl mx-auto">

                {/* Section label */}
                <motion.div
                    className="flex flex-col items-center gap-3 mb-8 md:mb-10 text-center px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#0a0a0a', fontWeight: 600 }}>
                        Curated For You
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-tangerine), cursive', fontWeight: 400, fontSize: 'clamp(2.6rem, 5.5vw, 3.8rem)', lineHeight: 1.3, color: '#0a0a0a', textTransform: 'none' }} {...content?.$?.heading}>
                        {content?.headline}
                    </h2>
                    <span className="w-10 h-px" style={{ background: '#0a0a0a' }} />
                </motion.div>

                {(recommendations && recommendations?.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {recommendations.map((article, index) => {
                            const isHovered = hoveredCard === index;
                            const href = (article?.url && article?.url?.length > 0) ? article.url : "#";
                            return (
                                <motion.article
                                    key={article?.uid || index}
                                    className="relative overflow-hidden cursor-pointer h-[260px] md:h-[300px]"
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link href={href} className="absolute inset-0">
                                        {article?.banner_image?.url ? (
                                            <div
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    backgroundImage: `url(${article.banner_image.url})`,
                                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                                }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0" style={{ background: '#1a1a1a' }} />
                                        )}

                                        {/* Gradients */}
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0) 55%)' }} />
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0) 60%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s' }} />

                                        {/* Content */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                                            <div className="flex flex-wrap gap-1.5 mb-1">
                                                {(article?.taxonomies && article?.taxonomies?.length > 0) ? article.taxonomies.map((tax, tdx) => (
                                                    <span
                                                        key={tdx + (tax?.term_uid || '')}
                                                        style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.48rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.5)', padding: '2px 6px', opacity: isHovered ? 1 : 0.7, transition: 'opacity 0.3s' }}
                                                    >
                                                        {tax.term_uid}
                                                    </span>
                                                )) : (
                                                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.18em', color: '#D1A261', opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                                                        0{index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {article?.title && (
                                                <h3 className="line-clamp-2" style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)', lineHeight: 1.25, color: '#fff', marginTop: '0.4rem', textTransform: 'none' }}>
                                                    {article.title}
                                                </h3>
                                            )}

                                            {/* Gold rule */}
                                            <div style={{ height: '1px', overflow: 'hidden', margin: '0.65rem 0' }}>
                                                <div style={{ height: '1px', background: '#D1A261', width: isHovered ? '56px' : '28px', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                                            </div>

                                            {/* Teaser — revealed on hover */}
                                            {article?.teaser && (
                                                <motion.div
                                                    initial={false}
                                                    animate={{ height: isHovered ? 'auto' : 0 }}
                                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <p className="line-clamp-2" style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.72rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', paddingBottom: '10px' }}>
                                                        {article.teaser}
                                                    </p>
                                                </motion.div>
                                            )}

                                            {/* Read more — revealed on hover */}
                                            <div style={{ overflow: 'hidden', height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.3s 0.1s, transform 0.3s 0.1s' }}>
                                                <span
                                                    className="inline-flex items-center gap-2"
                                                    style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D1A261' }}
                                                >
                                                    Read Article
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
