'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthContainer from './components/AuthContainer.jsx';
import SendEmailComponent from './components/SendEmailComponent.jsx';
import RegisterComponent from './components/RegisterComponent.jsx';
import CallbackComponent from './components/CallbackComponent.jsx';
import VerifyEmailComponent from './components/VerifyEmailComponent.jsx';
import ForgotPasswordComponent from './components/ForgotPasswordComponent.jsx';
import ResetPasswordComponent from './components/ResetPasswordComponent.jsx';

function AuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get('type') || 'login';

    // Persist callbackUrl to localStorage when arriving at /auth
    useEffect(() => {
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
            localStorage.setItem('kriya_auth_callback', callbackUrl);
        }
    }, [searchParams]);

    const renderComponent = () => {
        switch (type) {
            case 'login':
            case 'register':
            case 'send-email':
            case 'forgot-password':
                return <AuthContainer />;
            case 'complete-registration':
                return <RegisterComponent />;
            case 'callback':
                return <CallbackComponent />;
            case 'verify-email':
                return <VerifyEmailComponent />;
            case 'reset-password':
                return <ResetPasswordComponent />;
            default:
                return <AuthContainer />;
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="page-bg-overlay"></div>

            {/* Global Back Button */}
            <button
                onClick={() => router.push('/')}
                className="fixed top-4 left-4 z-[9999] w-10 h-10 flex items-center justify-center bg-black/50 border border-white/20 text-white hover:bg-white/10 transition-colors rounded-full"
                aria-label="Go back to home"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>

            {renderComponent()}
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
