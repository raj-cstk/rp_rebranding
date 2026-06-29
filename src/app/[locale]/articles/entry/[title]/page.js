"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser, faCalendar } from "@awesome.me/kit-610837e1f9/icons/classic/light";
import { useParams } from "next/navigation";
import { useDataContext } from "@/context/data.context";
import { useJstag } from "@/context/lyticsTracking";

export default function Page() {
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const initialData = useDataContext();
    const jstag = useJstag();

    const getContent = async () => {
        const data = await ContentstackClient.getElementByUrl(
            "article",
            "/articles/entry/" + params.title,
            params.locale,
            initialData
        );
        setEntry(data?.[0] ?? {});
        setIsLoading(false);
    };

    useEffect(() => {
        getContent();
        ContentstackClient.onEntryChange(getContent);
    }, []);

    useEffect(() => {
        if (!isLoading && jstag && entry?.taxonomies?.length > 0) {
            entry.taxonomies.forEach((t) => {
                jstag.send({ topic_browsed: t.term_uid });
            });
        }
    }, [isLoading, entry?.taxonomies]);

    if (isLoading) return null;

    const videoFile = entry?.video_options?.video?.url;
    const videoControls = entry?.video_options?.video_controls;
    const videoLoop = entry?.video_options?.in_loop;

    return (
        <div style={{ background: '#faf9f7', minHeight: '100vh' }}>
            <Header locale={params.locale} />

            {/* Hero */}
            <div className="relative w-full" style={{ height: '75vh', minHeight: '520px' }}>
                {videoFile ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        controls={videoControls === "Show Controls"}
                        autoPlay={videoControls === "Autoplay"}
                        muted={videoControls === "Autoplay"}
                        loop={videoControls === "Autoplay" ? true : videoControls === "Show Controls" ? videoLoop : false}
                    >
                        <source src={videoFile} />
                    </video>
                ) : entry?.banner_image?.url ? (
                    <img
                        src={entry.banner_image.url}
                        alt={entry.headline}
                        className="absolute inset-0 w-full h-full object-cover"
                        {...entry?.banner_image?.$?.url}
                    />
                ) : (
                    <div className="absolute inset-0" style={{ background: '#1a1a1a' }} {...entry?.$?.banner_image} />
                )}

                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }} />

                <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-16" style={{ maxWidth: '50%' }}>
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6">
                        <Link
                            href={`/${params.locale}/articles`}
                            style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}
                            className="hover:text-[#D1A261] transition-colors duration-200"
                        >
                            Articles
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>—</span>
                        {entry?.taxonomies?.length > 0 && (
                            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>
                                {entry.taxonomies[0].term_uid}
                            </span>
                        )}
                    </div>

                    {/* Taxonomy tags */}
                    {entry?.taxonomies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {entry.taxonomies.map((tax, i) => (
                                <Link key={i} href={`/articles/categories/${tax.term_uid}`} style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.5)', padding: '3px 10px', transition: 'border-color 0.2s, background 0.2s' }} className="hover:border-[#D1A261] hover:bg-[rgba(209,162,97,0.08)]">
                                    {tax.term_uid}
                                </Link>
                            ))}
                        </div>
                    )}

                    <h1
                        style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', lineHeight: 1.15, color: '#fff' }}
                        {...entry?.$?.headline}
                    >
                        {entry?.headline}
                    </h1>

                    {/* Event meta */}
                    {entry?.isevent && (
                        <div className="flex flex-wrap items-center gap-6 mt-5">
                            {entry?.event_details?.event_date && (
                                <div className="flex items-center gap-2" {...entry?.event_details?.$?.event_date}>
                                    <FontAwesomeIcon icon={faCalendar} style={{ color: '#D1A261', fontSize: '0.75rem' }} />
                                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.75)' }}>
                                        {new Date(entry.event_details.event_date).toLocaleDateString(params.locale, { year: 'numeric', month: 'long', day: 'numeric' })} — {new Date(entry.event_details.event_date).toLocaleTimeString(params.locale, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )}
                            {entry?.event_details?.event_type && (
                                <div className="flex items-center gap-2" {...entry?.event_details?.$?.event_type}>
                                    <FontAwesomeIcon icon={faUser} style={{ color: '#D1A261', fontSize: '0.75rem' }} />
                                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.75)', textTransform: 'capitalize' }}>
                                        {entry.event_details.event_type.replace(/-/g, ' ')}
                                    </span>
                                </div>
                            )}
                            {entry?.event_details?.venue && (
                                <div className="flex items-center gap-2" {...entry?.event_details?.$?.venue}>
                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: '#D1A261', fontSize: '0.75rem' }} />
                                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.75)', textTransform: 'capitalize' }}>
                                        {entry.event_details.venue}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Article content */}
            <div style={{ background: '#faf9f7' }} className="w-full px-6 py-20">
                <div className="mx-auto" style={{ maxWidth: '720px' }}>
                    <div className="flex items-center gap-4 mb-12">
                        <span className="w-12 h-px bg-[#D1A261]" />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }}>
                            {entry?.isevent ? 'Event' : 'Article'}
                        </span>
                    </div>

                    {entry?.teaser && (
                        <p
                            style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', lineHeight: 1.7, color: '#3a3530', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #e8e4de' }}
                            {...entry?.$?.teaser}
                        >
                            {entry.teaser}
                        </p>
                    )}

                    {entry?.article_body && (
                        <div
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: jsonToHtml(entry.article_body) }}
                            {...entry?.$?.article_body}
                        />
                    )}
                </div>
            </div>

            <style>{`
                .article-body { font-family: var(--font-raleway), sans-serif; font-weight: 300; font-size: 1rem; line-height: 1.95; color: #4a4540; }
                .article-body p { margin-bottom: 1.75rem; }
                .article-body h1, .article-body h2, .article-body h3 { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 300; font-style: italic; color: #1a1410; margin-top: 3rem; margin-bottom: 1rem; line-height: 1.2; text-transform: none; }
                .article-body h2 { font-size: clamp(1.6rem, 2.5vw, 2.2rem); }
                .article-body h3 { font-size: clamp(1.2rem, 2vw, 1.6rem); }
                .article-body a { color: #D1A261; text-decoration: none; border-bottom: 1px solid rgba(209,162,97,0.4); transition: border-color 0.2s; }
                .article-body a:hover { border-color: #D1A261; }
                .article-body blockquote { border-left: 2px solid #D1A261; padding-left: 1.5rem; margin: 2.5rem 0; font-style: italic; color: #6b6560; font-size: 1.1rem; }
                .article-body img { width: 100%; height: auto; margin: 2.5rem 0; }
                .article-body ul, .article-body ol { padding-left: 1.5rem; margin-bottom: 1.75rem; }
                .article-body li { margin-bottom: 0.5rem; }
            `}</style>

            <Footer />
        </div>
    );
}
