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
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState(1);
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

    function selectCategory(i) {
        setDir(i > active ? 1 : -1);
        setActive(i);
    }

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>

            {/* Hero */}
            <div
                className="w-full h-[480px] bg-cover bg-center flex items-center justify-center relative"
                style={{ backgroundImage: `url(https://images.contentstack.io/v3/assets/bltc991c0dda4197336/blt5d9c10062e0a93f7/67411c8348603bf3bb498fd9/chairs_on_beach.jpeg)` }}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 70%, #fff 100%)' }} />

                {/* Wave cut into the bottom of the hero photo, matching the page background below it */}
                <svg
                    className="absolute bottom-0 left-0 w-full"
                    style={{ height: '140px', display: 'block' }}
                    viewBox="0 0 1440 140"
                    preserveAspectRatio="none"
                >
                    <path d="M0,20 C420,180 900,-40 1440,90 L1440,140 L0,140 Z" fill="#fff" />
                </svg>

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

            {/* FAQ content — a single white themed section with a tabbed category
                browser, reusing the sliding gold underline pattern from the
                site's Tabs component instead of an arbitrary color split */}
            <div style={{ background: '#fff', paddingTop: '3rem', paddingBottom: '6rem' }}>
                {/* Category tab bar */}
                <div className="max-w-4xl mx-auto px-8 mb-4">
                    <div className="flex flex-wrap justify-center items-end gap-x-8 gap-y-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        {entry?.categories?.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => selectCategory(index)}
                                className="relative shrink-0 pb-5 transition-colors duration-200"
                                style={{
                                    fontFamily: 'var(--font-montserrat), sans-serif',
                                    fontWeight: active === index ? 600 : 400,
                                    fontSize: '0.68rem',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: active === index ? '#D1A261' : 'rgba(0,0,0,0.4)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {item.name}
                                {active === index && (
                                    <motion.span
                                        layoutId="faq-tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5"
                                        style={{ background: '#D1A261' }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active category's questions */}
                <div className="max-w-4xl mx-auto px-8 overflow-hidden">
                    <AnimatePresence mode="wait" custom={dir}>
                        {entry?.categories?.map((item, index) => active !== index ? null : (
                            <motion.div
                                key={index}
                                custom={dir}
                                variants={{
                                    enter: d => ({ opacity: 0, x: d * 50 }),
                                    center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                                    exit: d => ({ opacity: 0, x: d * -35, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }),
                                }}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="pt-12"
                            >
                                {item.faqs?.map((faq, fIdx) => {
                                    const isOpen = expandedId === faq._metadata.uid;
                                    return (
                                        <motion.div
                                            key={fIdx}
                                            style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                                            onClick={() => questionClicked(faq._metadata.uid)}
                                            className="cursor-pointer py-5 flex justify-between items-start gap-6"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: fIdx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="flex-1">
                                                <p style={{
                                                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                                                    fontWeight: 400,
                                                    fontStyle: 'italic',
                                                    fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                                                    color: isOpen ? '#D1A261' : '#1a1410',
                                                    lineHeight: 1.5,
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
                                                                className="mt-4 whitespace-pre-wrap [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1"
                                                                style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.9, letterSpacing: '0.02em', color: '#6b6560', paddingBottom: '8px' }}
                                                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                                <ChevronDownIcon style={{ color: '#D1A261', flexShrink: 0 }} className="h-4 w-4 mt-1" />
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
}
