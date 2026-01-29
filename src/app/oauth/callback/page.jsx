'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  // Helper function to set cookies
  function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  async function handleCallback() {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setError(searchParams.get('error_description') || errorParam);
      return;
    }

    if (!code) {
      setStatus('error');
      setError('No authorization code received');
      return;
    }

    // Validate state
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      setStatus('error');
      setError('Invalid state - please try again');
      return;
    }

    try {
      // Decode user from code
      const [payload] = code.split('.');
      const userInfo = JSON.parse(atob(payload));

      // Store user info in cookies
      const userObj = {
        id: userInfo.sub,
        email: userInfo.email,
        authenticatedAt: new Date().toISOString(),
      };
      
      setCookie('oauth_user', JSON.stringify(userObj));
      setCookie('oauth_token', code);
      setCookie('oauth_session', Date.now().toString());

      sessionStorage.removeItem('oauth_state');
      setStatus('success');

      // Check if there's a return URL stored
      const returnUrl = sessionStorage.getItem('oauth_return');
      sessionStorage.removeItem('oauth_return');

      // Redirect
      setTimeout(() => router.push(returnUrl || '/'), 1500);

    } catch (e) {
      setStatus('error');
      setError('Failed to process login');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#8C4E2A] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Completing sign in...</p>
          </>
        )}
        {status === 'success' && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
              <svg 
                className="w-10 h-10 text-green-600 animate-check" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  className="animate-draw-check"
                />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-800 animate-slide-up">Logged In</p>
          </div>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-[#8C4E2A] text-white rounded-md hover:bg-black">
              Try Again
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes draw-check {
          0% {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes slide-up {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-draw-check {
          stroke-dasharray: 100;
          animation: draw-check 0.5s ease-out 0.3s forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gray-200 border-t-[#8C4E2A] rounded-full animate-spin" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
