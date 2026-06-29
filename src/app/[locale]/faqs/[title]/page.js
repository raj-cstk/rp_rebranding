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

            {/* Category tiles */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className="w-8 h-px bg-[#D1A261]" />
                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>Browse Topics</span>
                    <span className="w-8 h-px bg-[#D1A261]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {entry?.categories?.map((item, index) => (
                        <motion.a
                            key={index}
                            href={'/faqs/' + params.title + '/section/' + item._metadata.uid}
                            className="flex h-[120px] items-center justify-center px-6 text-center"
                            style={{ border: '1px solid rgba(209,162,97,0.3)', background: '#fff' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.06 }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fdf8f2'; e.currentTarget.style.borderColor = '#D1A261'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(209,162,97,0.3)'; }}
                        >
                            <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a1410' }}>
                                {item.name}
                            </p>
                        </motion.a>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
