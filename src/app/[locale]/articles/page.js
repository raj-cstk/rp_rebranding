"use client";
import { useEffect, useState } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ContentstackClient } from '@/lib/contentstack-client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

function ArticleCard({ article, index }) {
    const [hovered, setHovered] = useState(false);
    const videoUrl = article?.video_options?.video?.url;
    const imageUrl = article?.banner_image?.url;

    return (
        <motion.article
            className="group flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Media */}
            <Link href={article.url || '#'} className="block relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {videoUrl ? (
                    <>
                        <video
                            className="w-full h-full object-cover"
                            preload="metadata"
                            style={{ pointerEvents: 'none', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        >
                            <source src={videoUrl} />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 84 84">
                                <circle cx="42" cy="42" r="42" opacity="0.5" />
                                <path d="M33 28L56 42L33 56V28Z" />
                            </svg>
                        </div>
                    </>
                ) : imageUrl ? (
                    <div
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            transform: hovered ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#e8e4de' }}>
                        <svg className="w-10 h-10" style={{ color: '#c8c4be' }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                )}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s' }} />
            </Link>

            {/* Content */}
            <div className="pt-5 flex flex-col flex-1">
                {article?.taxonomies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.taxonomies.map((tax, i) => (
                            <Link
                                key={i}
                                href={`/articles/categories/${tax.term_uid}`}
                                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.4)', padding: '2px 8px', transition: 'border-color 0.2s' }}
                                className="hover:border-[#D1A261]"
                            >
                                {tax.term_uid}
                            </Link>
                        ))}
                    </div>
                )}

                <Link href={article.url || '#'}>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)', lineHeight: 1.25, color: hovered ? '#1a1410' : '#2a2420', transition: 'color 0.3s', marginBottom: '0.75rem' }}>
                        {article.title}
                    </h2>
                </Link>

                <div style={{ height: '1px', background: '#D1A261', width: hovered ? '48px' : '24px', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)', marginBottom: '0.75rem' }} />

                {article.teaser && (
                    <p className="line-clamp-3 flex-1" style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.85, color: '#6b6560' }}>
                        {article.teaser}
                    </p>
                )}

                <Link
                    href={article.url || '#'}
                    className="inline-flex items-center gap-2 mt-4"
                    style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D1A261', opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(-6px)', transition: 'opacity 0.3s, transform 0.3s' }}
                >
                    Read More
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </motion.article>
    );
}

export default function AllArticles() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();

    const getContent = async () => {
        const data = await ContentstackClient.getElementByType("article", params.locale);
        setEntries(Array.isArray(data) ? data : []);
        setIsLoading(false);
    };

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    if (isLoading) return null;

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            <Header locale={params.locale} />

            {/* Page header */}
            <div className="w-full px-8 md:px-16 pt-28 pb-16" style={{ borderBottom: '1px solid #e8e4de' }}>
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-12 h-px bg-[#D1A261]" />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }}>
                            Red Panda Resort
                        </span>
                    </div>
                    <h1 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', lineHeight: 1.1, color: '#1a1410' }}>
                        Journal &amp; Stories
                    </h1>
                    {entries.length > 0 && (
                        <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9a9590', marginTop: '1rem' }}>
                            {entries.length} {entries.length === 1 ? 'article' : 'articles'}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Grid */}
            <div className="w-full px-8 md:px-16 py-20">
                <div className="max-w-7xl mx-auto">
                    {entries.length === 0 ? (
                        <div className="text-center py-32">
                            <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a9590' }}>
                                No articles yet
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {entries.map((article, index) => (
                                <ArticleCard key={article.uid} article={article} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
