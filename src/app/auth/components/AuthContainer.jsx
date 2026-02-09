'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TiLocationArrow } from "react-icons/ti";
import Image from 'next/image';
import Button from '@/components/Button';
import SendEmailComponent from './SendEmailComponent';
import ForgotPasswordComponent from './ForgotPasswordComponent';
import './authContainer.css';

export default function AuthContainer() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'login';
    const [isActive, setIsActive] = useState(type === 'register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [prevType, setPrevType] = useState(type);
    const router = useRouter();
    const { login } = useAuth();

    const callbackUrl = searchParams.get('callbackUrl');

    useEffect(() => {
        setIsActive(type === 'register');
        setError('');
        setEmail('');
        setPassword('');
        // Delay updating prevType to allow transition animation to complete
        const timer = setTimeout(() => {
            setPrevType(type);
        }, 600); // Match CSS transition duration
        return () => clearTimeout(timer);
    }, [type]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            await login({ email, password });
            router.push(callbackUrl || '/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/user/google`;
    };

    const handleGoogleRegister = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/user/google`;
    };

    return (
        <div className={`auth-container ${isActive ? 'active' : ''}`}>
            {/* Sign In Form / Send Email Form */}
            <div className="form-container sign-in">
                {type === 'forgot-password' ? (
                    <ForgotPasswordComponent />
                ) : (type === 'send-email' || (prevType === 'send-email' && type === 'register')) ? (
                    <SendEmailComponent />
                ) : (type === 'login' || prevType === 'login') ? (
                    <form onSubmit={handleLoginSubmit}>
                        <h1 className="font-zentry uppercase text-4xl mb-4">Sign In</h1>

                        {error && !isActive && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <span className="font-general">or use your email password</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="font-general"
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="font-general"
                        />
                        <div className="w-full flex justify-end !-mt-2">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/auth?type=forgot-password');
                                }}
                                className="font-general text-sm"
                            >
                                Forgot Your Password?
                            </a>
                        </div>
                        <Button
                            title={loading ? 'Logging in...' : 'Sign In'}
                            containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full mt-4"
                            titleClass="font-semibold !text-xs"
                            leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
                        />

                        <p className="mt-4 font-general text-sm">
                            Don't have an account?{' '}
                            <span
                                className="text-[#512da8] font-bold cursor-pointer hover:underline"
                                onClick={() => {
                                    setIsActive(true);
                                    router.push('/auth?type=register');
                                }}
                            >
                                Sign Up
                            </span>
                        </p>

                        <div className="divider">
                            <span className="font-general">Or</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="google-btn"
                        >
                            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Login with Google
                        </button>
                    </form>
                ) : null}
            </div>

            {/* Sign Up Form */}
            <div className="form-container sign-up">
                <form className="signup-content">
                    <h1 className="font-zentry uppercase text-4xl mb-4 text-center">Create Account</h1>
                    <span className="font-general text-center mb-6">Choose your registration method</span>

                    <div className="w-full space-y-4 flex flex-col items-center">
                        <button
                            type="button"
                            onClick={handleGoogleRegister}
                            className="google-btn"
                        >
                            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="divider !my-2">
                            <span className="font-general">Or</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push('/auth?type=send-email')}
                            className="group relative z-10 w-full cursor-pointer overflow-hidden rounded-full bg-blue-400 px-6 py-2 font-zentry font-semibold transition-all duration-300 transform hover:scale-105 mt-4 flex items-center justify-center gap-2 !mb-0"
                        >
                            <TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />
                            <span className="relative inline-flex overflow-hidden font-general text-xs uppercase !mb-0">
                                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                                    Register with Email
                                </div>
                                <div className="absolute top-0 left-0 h-full w-full translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0 !mb-0">
                                    Register with Email
                                </div>
                            </span>
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-400 font-general">
                        Already have an account?{' '}
                        <span
                            className="text-[#edff66] font-bold cursor-pointer hover:underline"
                            onClick={() => {
                                setIsActive(false);
                                router.push('/auth?type=login');
                            }}
                        >
                            Sign In
                        </span>
                    </p>
                </form>
            </div>

            {/* Toggle Container */}
            <div className="toggle-container">
                <div className="toggle">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="auth-video-bg"
                    >
                        <source src="https://res.cloudinary.com/dkashskr5/video/upload/v1770518239/auth-background_hnm49d.mp4" type="video/mp4" />
                    </video>
                    <div className="toggle-panel toggle-left">
                    </div>
                    <div className="toggle-panel toggle-right">
                    </div>
                </div>
            </div>
        </div>
    );
}
