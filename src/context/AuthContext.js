'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasCheckedAuth = useRef(false);
    const isLoggedInThisSession = useRef(false);

    const checkAuth = useCallback(async () => {
        // Skip if user was just logged in this session
        if (isLoggedInThisSession.current) {
            setLoading(false);
            return;
        }

        try {
            const response = await authService.getProfile();
            setUser(response.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
            hasCheckedAuth.current = true;
        }
    }, []);

    useEffect(() => {
        if (!hasCheckedAuth.current && !isLoggedInThisSession.current) {
            checkAuth();
        }
    }, [checkAuth]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        isLoggedInThisSession.current = true;
        setUser(response.user);
        setLoading(false);
        return response;
    };

    const googleLogin = async (data) => {
        const response = await authService.loginGoogle(data);
        isLoggedInThisSession.current = true;
        setUser(response.user);
        setLoading(false);
        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('kriya_avatar');
                localStorage.removeItem('kriya_auth_callback');
            }
            setUser(null);
            isLoggedInThisSession.current = false;
            hasCheckedAuth.current = false;
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    const value = {
        user,
        loading,
        isAuthenticated: user,
        login,
        googleLogin,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
