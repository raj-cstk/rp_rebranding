"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';

export default function OrdersPage() {
    const { locale = 'en' } = useParams();
    const [src, setSrc] = useState(null);
2
    useEffect(() => {
        const cfg = window.__RPC_CART_EMBED__;
        if (!cfg?.commerceOrigin || !cfg?.storeId || !cfg?.storeToken) return;

        const userId    = cfg.customerId || '';
        const sessionId = localStorage.getItem(`rpc_cart_session_${cfg.storeId}`) || '';
        const origin    = cfg.commerceOrigin.replace(/\/$/, '');

        const q = new URLSearchParams({ storeId: cfg.storeId, sessionId });
        if (cfg.primaryColor) q.set('color', cfg.primaryColor);
        if (userId) q.set('customerId', userId);

        setSrc(`${origin}/embed/orders?${q}#token=${encodeURIComponent(cfg.storeToken)}`);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header color="dark" locale={locale} />
            <div className="max-w-3xl mx-auto px-4 py-12">
                {src ? (
                    <iframe
                        src={src}
                        title="My Orders"
                        style={{ width: '100%', minHeight: 700, border: 'none' }}
                    />
                ) : (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-neutral-700 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
