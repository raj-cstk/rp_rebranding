"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { createClient } from '@/utils/supabase/client';

export default function OrdersPage() {
    const { locale = 'en' } = useParams();
    const searchParams = useSearchParams();
    const [src, setSrc] = useState(null);

    useEffect(() => {
        const cfg = window.__RPC_CART_EMBED__;
        if (!cfg?.commerceOrigin || !cfg?.storeId || !cfg?.storeToken) return;

        createClient().auth.getSession().then(({ data: { session } }) => {
            const userId    = session?.user?.id || '';
            const sessionId = localStorage.getItem(`rpc_cart_session_${cfg.storeId}`) || '';
            const origin    = cfg.commerceOrigin.replace(/\/$/, '');
            const deepOrder = searchParams.get('order') || '';

            const q = new URLSearchParams({ storeId: cfg.storeId, sessionId });
            if (cfg.primaryColor) q.set('color', cfg.primaryColor);
            if (userId) q.set('customerId', userId);
            if (deepOrder) q.set('order', deepOrder);

            setSrc(`${origin}/embed/orders?${q}#token=${encodeURIComponent(cfg.storeToken)}`);
        });
    }, []);

    // Listen for navigation events from the iframe and sync them to the page URL
    useEffect(() => {
        const onMessage = (e) => {
            if (e.data?.type !== 'RP_ORDERS_NAVIGATE') return;
            const orderId = e.data.orderId;
            const url = orderId
                ? `/${locale}/orders?order=${encodeURIComponent(orderId)}`
                : `/${locale}/orders`;
            window.history.replaceState(null, '', url);
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [locale]);

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Header color="dark" locale={locale} />
            <div className="max-w-3xl mx-auto px-4 py-12">
                {src ? (
                    <iframe
                        src={src}
                        title="My Orders"
                        style={{ width: '100%', minHeight: 700, border: 'none' }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 gap-5">
                        <div className="animate-spin rounded-full h-10 w-10" style={{ border: '1px solid rgba(209,162,97,0.2)', borderTopColor: '#D1A261' }} />
                        <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>
                            Loading Orders
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
