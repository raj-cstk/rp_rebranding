"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Page({ }) {
    const [entry, setEntry] = useState({});
    const [expandedId, setExpendedId] = useState("");
    const params = useParams();

    const getContent = async () => {
        const entry = await ContentstackClient.getElementByUrl(
            "faq",
            "/faq/" + params.title,
            params.locale,
        );
        setEntry(entry?.[0] ?? {});
    };

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    function questionClicked(id) {
        setExpendedId(prev => prev === id ? "" : id);
    }

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>

            {/* Hero */}
            <div
                className="w-full h-[480px] bg-cover bg-center flex items-center justify-center relative"
                style={{ backgroundImage: `url(https://images.contentstack.io/v3/assets/bltc991c0dda4197336/blt5d9c10062e0a93f7/67411c8348603bf3bb498fd9/chairs_on_beach.jpeg)` }}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 100%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
                    <Header color="white" locale={params.locale} />
                </div>
                <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="block h-px bg-[#D1A261]" style={{ width: '28px' }} />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>Support</span>
                        <span className="block h-px bg-[#D1A261]" style={{ width: '28px' }} />
                    </div>
                    <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', color: '#fff', lineHeight: 1.1 }}>
                        Frequently Asked Questions
                    </h1>
                </div>
            </div>

            {/* FAQ content */}
            <div className="max-w-4xl mx-auto px-8 py-24">
                {entry?.categories?.map((item, index) => (
                    <motion.div
                        key={index}
                        className="mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-8 h-px bg-[#D1A261]" />
                            <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: '#1a1410' }}>
                                {item.name}
                            </h2>
                        </div>

                        <div>
                            {item.faqs?.map((faq, fIdx) => {
                                const isOpen = expandedId === faq._metadata.uid;
                                return (
                                    <div
                                        key={fIdx}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                                        onClick={() => questionClicked(faq._metadata.uid)}
                                        className="cursor-pointer py-5 flex justify-between items-start gap-6"
                                    >
                                        <div className="flex-1">
                                            <p style={{
                                                fontFamily: 'var(--font-raleway), sans-serif',
                                                fontWeight: isOpen ? 500 : 300,
                                                fontSize: '0.95rem',
                                                color: isOpen ? '#D1A261' : '#1a1410',
                                                letterSpacing: '0.02em',
                                                lineHeight: 1.6,
                                                transition: 'color 0.3s',
                                            }}>
                                                {faq.question}
                                            </p>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                        style={{ overflow: 'hidden' }}
                                                    >
                                                        <div
                                                            className="mt-5 whitespace-pre-wrap [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1"
                                                            style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.9, letterSpacing: '0.02em', color: '#6b6560', paddingBottom: '8px' }}
                                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <ChevronDownIcon
                                            style={{ color: '#D1A261', flexShrink: 0 }}
                                            className={"h-4 w-4 mt-1 transition-transform duration-300 " + (isOpen ? "rotate-180" : "")}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
