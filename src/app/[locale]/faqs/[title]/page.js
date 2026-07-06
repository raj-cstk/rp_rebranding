"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function Page({ }) {
    const [search, setSearch] = useState("");
    const [entry, setEntry] = useState({});
    const [notFoundVisible, setNotFoundVisible] = useState(false);
    const router = useRouter();
    const params = useParams();

    const getContent = async () => {
        const entry = await ContentstackClient.getElementByUrlWithRefs(
            "faq",
            "/faq/" + params.title,
            params.locale,
            []
        );
        setEntry(Array.isArray(entry) ? entry[0] : entry);
    };

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    async function searchForAnswer() {
        const regex = new RegExp(search, 'i');
        let found = false;
        entry?.categories?.forEach((category) => {
            category?.faqs?.forEach((faq) => {
                if (regex.test(faq.question) || regex.test(faq.answer)) {
                    if (!found)
                        router.push(params.title + "/section/" + category._metadata.uid + "/" + faq._metadata.uid);
                    found = true;
                }
            });
        });
        if (!found) setNotFoundVisible(true);
    }

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>

            {/* Hero with search */}
            <div
                className="w-full h-[560px] bg-cover bg-center flex items-center justify-center relative"
                style={{ backgroundImage: `url(https://images.contentstack.io/v3/assets/bltc991c0dda4197336/blt5d9c10062e0a93f7/67411c8348603bf3bb498fd9/chairs_on_beach.jpeg)` }}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 100%)' }} />

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
                <div className="relative z-10 text-center px-6 w-full max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="block h-px bg-[#D1A261]" style={{ width: '28px' }} />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>Help Centre</span>
                        <span className="block h-px bg-[#D1A261]" style={{ width: '28px' }} />
                    </div>
                    <h1
                        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '2.5rem' }}
                        {...entry?.$?.headline}
                    >
                        {entry?.headline}
                    </h1>
                    <div className="relative flex">
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setNotFoundVisible(false); }}
                            placeholder={entry?.placeholder}
                            style={{
                                fontFamily: 'var(--font-raleway), sans-serif',
                                fontWeight: 300,
                                fontSize: '0.88rem',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRight: 'none',
                                color: '#fff',
                                padding: '14px 20px',
                                outline: 'none',
                                flex: 1,
                                letterSpacing: '0.02em',
                            }}
                            {...entry?.$?.placeholder}
                        />
                        {notFoundVisible && (
                            <ExclamationCircleIcon className="absolute right-[130px] h-5 w-5 top-3.5 text-red-400" />
                        )}
                        <button
                            onClick={() => searchForAnswer()}
                            style={{
                                fontFamily: 'var(--font-montserrat), sans-serif',
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                background: '#D1A261',
                                color: '#000',
                                padding: '14px 28px',
                                border: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            {entry?.button_text}
                        </button>
                    </div>
                </div>
            </div>

            {/* Category grid */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className="w-8 h-px bg-[#D1A261]" />
                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>Browse Topics</span>
                    <span className="w-8 h-px bg-[#D1A261]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {entry?.categories?.map((item, index) => (
                        <CategoryCell
                            key={index}
                            item={item}
                            index={index}
                            hrefBase={'/faqs/' + params.title + '/section/'}
                        />
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

// Alternating dark/cream cells (only two tones site-wide, not one-per-cell)
// so the grid reads as a checkerboard rather than a uniform tile list. Each
// cell slides in from the side its position "leans" toward — a small nod to
// the alternating-entrance pattern used on the events/propositions grids.
function CategoryCell({ item, index, hrefBase }) {
    const [hovered, setHovered] = useState(false);
    // Checkerboard against the widest (3-column) layout: plain `index % 2`
    // would make every cell in a given column the same color whenever the
    // column count divides evenly into 2 (e.g. the sm: 2-column breakpoint) —
    // factoring in the row breaks that correlation.
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isDark = (row + col) % 2 === 0;
    const bg = isDark ? '#0a0a0a' : '#F6EFD8';
    const textColor = isDark ? '#fff' : '#1a1410';
    const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
    const borderColor = isDark ? 'rgba(209,162,97,0.2)' : 'rgba(209,162,97,0.25)';
    const count = item?.faqs?.length ?? 0;

    return (
        <motion.a
            href={hrefBase + item._metadata.uid}
            className="relative flex flex-col justify-between overflow-hidden"
            style={{
                background: bg,
                border: `1px solid ${hovered ? '#D1A261' : borderColor}`,
                padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                minHeight: 'clamp(200px, 24vw, 260px)',
                transition: 'border-color 0.4s ease',
            }}
            initial={{ opacity: 0, x: isDark ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: (index % 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="relative">
                <motion.div
                    animate={{ width: hovered ? '40px' : '24px' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '1px', background: '#D1A261', marginBottom: '1rem' }}
                />
                <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', color: textColor, lineHeight: 1.2 }}>
                    {item.name}
                </h3>
                {count > 0 && (
                    <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: mutedColor, marginTop: '0.6rem' }}>
                        {count} {count === 1 ? 'Question' : 'Questions'}
                    </p>
                )}
            </div>

            <div
                className="relative flex items-center gap-2 mt-6"
                style={{ opacity: hovered ? 1 : 0.5, transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'opacity 0.3s, transform 0.3s' }}
            >
                <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1A261' }}>
                    Explore
                </span>
                <svg className="w-3 h-3" style={{ color: '#D1A261' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </motion.a>
    );
}
