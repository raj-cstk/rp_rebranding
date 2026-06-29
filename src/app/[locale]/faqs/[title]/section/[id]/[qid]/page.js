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
    const [category, setCategory] = useState({});
    const params = useParams();

    const getContent = async () => {
        const entry = await ContentstackClient.getElementByUrlWithRefs(
            "faq",
            "/faq/" + params.title,
            params.locale,
            []
        );
        const data = Array.isArray(entry) ? entry[0] : entry;
        const cat = data?.categories?.find(c => c._metadata.uid === params.id);
        setCategory(cat);
        const q = cat?.faqs?.find((q) => q._metadata.uid === params.qid);
        setEntry(q);
    };

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            <div style={{ position: 'relative', zIndex: 100, minHeight: '80px' }}>
                <Header locale={params.locale} />
            </div>

            <div className="max-w-7xl mx-auto px-8 pt-20 pb-24">

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
                    <Link
                        href={"/faqs/" + params.title + '/section/' + params.id}
                        style={{ color: '#6b6560', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1a1410'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6b6560'}
                    >
                        {category?.name}
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">

                    {/* Main Q&A */}
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ width: '32px', height: '1px', background: '#D1A261', marginBottom: '2rem' }} />
                        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#1a1410', lineHeight: 1.2, marginBottom: '2rem' }}>
                            {entry?.question}
                        </h1>
                        <div style={{ width: '32px', height: '1px', background: '#D1A261', marginBottom: '2.5rem' }} />
                        <div
                            style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.93rem', lineHeight: 1.9, letterSpacing: '0.02em', color: '#6b6560' }}
                            className="whitespace-pre-wrap [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-2"
                            dangerouslySetInnerHTML={{ __html: entry?.answer }}
                        />
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        className="lg:w-[300px] shrink-0"
                        style={{ borderLeft: '1px solid rgba(0,0,0,0.08)', paddingLeft: '2.5rem' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261', marginBottom: '1.2rem' }}>
                            {category?.name}
                        </p>
                        <div style={{ width: '28px', height: '1px', background: 'rgba(209,162,97,0.3)', marginBottom: '1.5rem' }} />
                        <div>
                            {category?.faqs?.map((item, index) => (
                                <Link
                                    key={index}
                                    href={"/faqs/" + params.title + '/section/' + params.id + "/" + item._metadata?.uid}
                                    className="group flex items-start gap-3 py-3"
                                    style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                                >
                                    <span style={{ color: '#D1A261', flexShrink: 0, marginTop: '5px' }}>
                                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 6h8M7 3l3 3-3 3" />
                                        </svg>
                                    </span>
                                    <span
                                        style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.83rem', color: '#9a9590', lineHeight: 1.65, letterSpacing: '0.02em', transition: 'color 0.2s' }}
                                        className="group-hover:!text-[#1a1410]"
                                    >
                                        {item.question}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
