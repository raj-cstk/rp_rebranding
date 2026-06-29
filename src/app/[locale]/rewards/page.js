"use client"
import { Fragment, useEffect, useState } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ContentstackClient } from '../../../lib/contentstack-client';
import { setPersonalizeLiveAttributesCookie } from '@/lib/cspersonalize';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';

export default function Page({ }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [category, setCategory] = useState('None');
    const [entry, setEntry] = useState({});
    const [isLg, setIsLg] = useState(false);
    const params = useParams();

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        setIsLg(mq.matches);
        const handler = e => setIsLg(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const getContent = async () => {
        const entry = await ContentstackClient.getElementByUrl('rewards', '/rewards', params.locale);
        setEntry(entry?.[0] ?? {});
        setIsLoading(false);
    }

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    async function submit(e) {
        e.preventDefault();
        setPersonalizeLiveAttributesCookie({ client_type: category });
        setDialogOpen(true);
    }

    if (isLoading) return;

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

            {/* Success modal */}
            <Transition.Root show={dialogOpen} as={Fragment}>
                <Dialog className="relative z-50" onClose={setDialogOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 transition-opacity" style={{ background: 'rgba(0,0,0,0.82)' }} />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full text-center"
                                    style={{ maxWidth: '400px', background: '#111', border: '1px solid rgba(209,162,97,0.2)', padding: '2.5rem 2rem' }}
                                >
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center mb-6" style={{ border: '1px solid rgba(209,162,97,0.5)' }}>
                                        <CheckIcon className="h-5 w-5" style={{ color: '#D1A261' }} />
                                    </div>
                                    <Dialog.Title
                                        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.7rem', color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem' }}
                                    >
                                        {entry?.submit_modal?.headline}
                                    </Dialog.Title>
                                    <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '2rem' }}>
                                        {entry?.submit_modal?.body}
                                    </p>
                                    <button
                                        onClick={() => setDialogOpen(false)}
                                        style={{
                                            width: '100%',
                                            fontFamily: 'var(--font-montserrat), sans-serif',
                                            fontWeight: 600,
                                            fontSize: '0.6rem',
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            color: '#000',
                                            background: '#D1A261',
                                            border: 'none',
                                            padding: '13px 32px',
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        {entry?.submit_modal?.button_text}
                                    </button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <div style={{ position: 'relative', zIndex: 100, minHeight: '80px' }}>
                <Header color="white" locale={params.locale} />
            </div>

            {/* Hero — full width split */}
            <div className={`flex w-full ${isLg ? 'flex-row' : 'flex-col'}`} style={{ minHeight: '80vh' }}>

                {/* Image — left half, pill-curved right edge */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        flex: 1,
                        minHeight: isLg ? '80vh' : '55vw',
                        borderRadius: isLg ? '0 9999px 9999px 0' : '0',
                        background: '#1a1a1a',
                    }}
                >
                    {entry?.image?.url && (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url(${entry.image.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            {...entry?.image?.$?.url}
                        />
                    )}
                </div>

                {/* Text — right half */}
                <div
                    className="flex items-center"
                    style={{
                        flex: 1,
                        padding: isLg ? '0 5rem 0 5rem' : '3rem 1.5rem',
                        background: '#0a0a0a',
                    }}
                >
                    <div style={{ maxWidth: '480px' }}>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-8 h-px bg-[#D1A261]" />
                            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>
                                Membership
                            </span>
                        </div>
                        <h1
                            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}
                            {...entry?.$?.headline}
                        >
                            {entry?.headline}
                        </h1>
                        <div style={{ width: '32px', height: '1px', background: '#D1A261', marginBottom: '1.5rem' }} />
                        <p
                            style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, letterSpacing: '0.02em', color: 'rgba(255,255,255,0.48)' }}
                            {...entry?.$?.body}
                        >
                            {entry?.body}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form section */}
            <div style={{ background: '#ffffff' }} className="py-20 lg:py-28">
                <div className="max-w-lg mx-auto px-6 md:px-8">

                    {/* Form heading */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="w-8 h-px bg-[#D1A261]" />
                            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>
                                Enrol Now
                            </span>
                            <span className="w-8 h-px bg-[#D1A261]" />
                        </div>
                        <h2
                            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#1a1a1a', lineHeight: 1.15, marginBottom: '1rem' }}
                            {...entry?.$?.form}
                        >
                            {entry?.form?.headline}
                        </h2>
                        <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.9, color: 'rgba(0,0,0,0.45)' }}>
                            {entry?.form?.body}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: '0.6rem' }}>
                                {entry?.form?.name_label}
                            </label>
                            <input
                                type="text"
                                name="name"
                                style={{
                                    width: '100%',
                                    background: '#fff',
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    color: '#1a1a1a',
                                    padding: '13px 16px',
                                    fontFamily: 'var(--font-raleway), sans-serif',
                                    fontWeight: 300,
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'border-color 0.25s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#D1A261'}
                                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: '0.6rem' }}>
                                {entry?.form?.email_label}
                            </label>
                            <input
                                type="email"
                                name="user_name"
                                id="user_email"
                                style={{
                                    width: '100%',
                                    background: '#fff',
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    color: '#1a1a1a',
                                    padding: '13px 16px',
                                    fontFamily: 'var(--font-raleway), sans-serif',
                                    fontWeight: 300,
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'border-color 0.25s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#D1A261'}
                                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: '0.6rem' }}>
                                {entry?.form?.category_label}
                            </label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: '#fff',
                                        border: '1px solid rgba(0,0,0,0.12)',
                                        color: 'rgba(0,0,0,0.7)',
                                        padding: '13px 40px 13px 16px',
                                        fontFamily: 'var(--font-raleway), sans-serif',
                                        fontWeight: 300,
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        transition: 'border-color 0.25s',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#D1A261'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                                >
                                    {entry?.form?.categories?.map((cat, index) => (
                                        <option key={index} value={cat.value}>{cat.text}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1l4 4 4-4" stroke="#D1A261" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full"
                                style={{
                                    fontFamily: 'var(--font-montserrat), sans-serif',
                                    fontWeight: 600,
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    color: '#000',
                                    background: '#D1A261',
                                    border: 'none',
                                    padding: '15px 32px',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    )
}
