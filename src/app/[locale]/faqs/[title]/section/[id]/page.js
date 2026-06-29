"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function FaqSection({ }) {
    const [entry, setEntry] = useState({});
    const params = useParams();

    const getContent = async () => {
        const entry = await ContentstackClient.getElementByUrlWithRefs(
            "faq",
            "/faq/" + params.title,
            params.locale,
            []
        );
        const data = Array.isArray(entry) ? entry[0] : entry;
        const cat = data?.categories?.find((c) => c._metadata.uid === params.id);
        setEntry(cat);
    };

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            <div style={{ position: 'relative', zIndex: 100, minHeight: '80px' }}>
                <Header locale={params.locale} />
            </div>

            <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-16" style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    <Link
                        href={"/faqs/" + params.title}
                        style={{ color: '#D1A261', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Red Panda Resort
                    </Link>
                    <span style={{ color: 'rgba(0,0,0,0.25)', margin: '0 6px' }}>/</span>
                    <span style={{ color: '#6b6560' }}>{entry?.name}</span>
                </div>

                {/* Heading */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="block h-px bg-[#D1A261]" style={{ width: '28px' }} />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>Category</span>
                        <span className="block h-px bg-[#D1A261]" style={{ width: '28px' }} />
                    </div>
                    <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1410', lineHeight: 1.1 }}>
                        {entry?.name}
                    </h1>
                </motion.div>

                {/* Questions grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    {entry?.faqs?.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.04 }}
                        >
                            <Link
                                href={"/faqs/" + params.title + '/section/' + params.id + "/" + item._metadata?.uid}
                                className="group flex items-start gap-4 py-6 px-4"
                                style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', transition: 'background 0.25s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fdf8f2'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <span style={{ color: '#D1A261', flexShrink: 0, marginTop: '4px' }}>
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 6h8M7 3l3 3-3 3" />
                                    </svg>
                                </span>
                                <span
                                    style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', color: '#6b6560', lineHeight: 1.65, letterSpacing: '0.02em', transition: 'color 0.25s' }}
                                    className="group-hover:!text-[#1a1410]"
                                >
                                    {item.question}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
