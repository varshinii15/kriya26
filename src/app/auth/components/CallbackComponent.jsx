'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CallbackComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { googleLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const email = searchParams.get('email');
                const googleId = searchParams.get('googleId');
                const existingUser = searchParams.get('existing_user') === 'true';
                const source = searchParams.get('source');

                if (!email || !googleId) {
                    setError('Invalid callback parameters');
                    setLoading(false);
                    return;
                }

                if (existingUser && source === 'email') {
                    setError('This email is already registered with email/password. Please login with your email and password instead.');
                    setLoading(false);
                    setTimeout(() => {
                        router.push('/auth?type=login');
                    }, 5000);
                    return;
                }

                if (existingUser) {
                    await googleLogin({ email, googleId, existing_user: true });
                    // Read callback from localStorage (stored when user first arrived at /auth)
                    const storedCallback = localStorage.getItem('kriya_auth_callback');
                    localStorage.removeItem('kriya_auth_callback');
                    router.replace(storedCallback || '/profile');
                } else {
                    localStorage.setItem('registration_email', email);
                    localStorage.setItem('registration_googleId', googleId);
                    // Callback URL is already persisted in localStorage from initial /auth load
                    router.push(`/auth?type=complete-registration&source=google`);
                }
            } catch (err) {
                console.error('Callback error:', err);
                setError(err.response?.data?.message || 'Authentication failed');
                setLoading(false);
            }
        };

        handleCallback();
    }, [searchParams, router, googleLogin]);

    if (error) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Authentication Error</h2>
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/auth?type=login')}
                        className="bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#edff66] mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Processing</h2>
                <p className="text-gray-400">Please wait while we complete your Google sign-in...</p>
            </div>
        </div>
    );
}
