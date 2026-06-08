"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import { createClient } from '@/utils/supabase/client';

export default function OrdersEmbedPage() {
    const params = useParams();
    const locale = params?.locale || 'en';

    const iframeRef = useRef(null);

    const [src,     setSrc]     = useState(null);
    const [shown,   setShown]   = useState(false);  // iframe visible after init sent
    const [uncfg,   setUncfg]   = useState(false);
    const [iframeH, setIframeH] = useState(600);

    // Track readiness of both sides before sending RP_ORDERS_INIT
    const [authDone,      setAuthDone]      = useState(false);
    const [authUserId,    setAuthUserId]    = useState(null);
    const [iframePending, setIframePending] = useState(null); // { sessionId } when iframe is ready

    // ── 1. Resolve logged-in user ──────────────────────────────────────────
    // Use getSession() (reads local storage, no network call) so this never
    // races with the header's concurrent getUser() call during token refresh.
    useEffect(() => {
        createClient().auth.getSession()
            .then(({ data: { session } }) => {
                setAuthUserId(session?.user?.id || null);
            })
            .catch(() => setAuthUserId(null))
            .finally(() => setAuthDone(true));
    }, []);

    // ── 2. Resolve commerce embed src ─────────────────────────────────────
    useEffect(() => {
        const resolve = () => {
            const cfg = window.__RPC_CART_EMBED__;
            if (!cfg?.commerceOrigin || !cfg?.storeId || !cfg?.storeToken) {
                setUncfg(true);
                return;
            }
            const origin = String(cfg.commerceOrigin).trim().replace(/\/$/, '');
            setSrc(`${origin}/embed/orders`);
        };

        if (typeof window !== 'undefined' && window.__RPC_CART_EMBED__) {
            resolve();
        } else {
            const t = setTimeout(resolve, 800);
            return () => clearTimeout(t);
        }
    }, []);

    // ── 3. Listen for iframe messages ──────────────────────────────────────
    useEffect(() => {
        function onMessage(e) {
            const cfg = window.__RPC_CART_EMBED__;
            if (!cfg) return;
            const origin = String(cfg.commerceOrigin).trim().replace(/\/$/, '');
            if (e.origin !== origin) return;

            if (e.data?.type === 'RP_ORDERS_READY') {
                let sessionId = '';
                try {
                    const key = `rpc_cart_session_${cfg.storeId}`;
                    sessionId = localStorage.getItem(key) || '';
                } catch { /* ignore */ }
                setIframePending({ sessionId });
            }

            if (e.data?.type === 'RP_ORDERS_HEIGHT' && typeof e.data.height === 'number') {
                setIframeH(Math.max(400, e.data.height));
            }
        }

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, []);

    // ── 4. Send RP_ORDERS_INIT once BOTH auth and iframe are ready ─────────
    useEffect(() => {
        if (!authDone || !iframePending) return;

        const cfg = window.__RPC_CART_EMBED__;
        if (!cfg) return;
        const origin = String(cfg.commerceOrigin).trim().replace(/\/$/, '');

        iframeRef.current?.contentWindow?.postMessage(
            {
                type: 'RP_ORDERS_INIT',
                payload: {
                    storeId:    cfg.storeId,
                    token:      cfg.storeToken,
                    color:      cfg.primaryColor || '#e53e3e',
                    sessionId:  iframePending.sessionId,
                    customerId: authUserId || null,
                },
            },
            origin
        );
        setShown(true);
    }, [authDone, iframePending, authUserId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header color="dark" locale={locale} />

            <div className="max-w-3xl mx-auto px-4 py-12">

                {uncfg && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <p className="text-sm text-gray-500">Commerce is not configured on this page.</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Make sure <code className="font-mono">window.__RPC_CART_EMBED__</code> is set by embed.js.
                        </p>
                    </div>
                )}

                {!uncfg && src && (
                    <div>
                        {!shown && (
                            <div className="flex justify-center items-center py-16">
                                <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-neutral-700 animate-spin" />
                            </div>
                        )}
                        <iframe
                            ref={iframeRef}
                            src={src}
                            title="My Orders"
                            style={{
                                width: '100%',
                                height: `${iframeH}px`,
                                border: 'none',
                                display: shown ? 'block' : 'none',
                            }}
                            allow="same-origin"
                        />
                    </div>
                )}

                {!uncfg && !src && (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-neutral-700 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
