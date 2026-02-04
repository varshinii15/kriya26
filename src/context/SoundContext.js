'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Howler } from 'howler';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
    const [isMuted, setIsMuted] = useState(false);

    // Load mute state from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('soundMuted');
        if (stored !== null) {
            const muted = stored === 'true';
            setIsMuted(muted);
            // Sync Howler global mute on initial load
            Howler.mute(muted);
        }
    }, []);

    // Sync Howler global mute whenever isMuted changes
    useEffect(() => {
        Howler.mute(isMuted);
    }, [isMuted]);

    // Save mute state to localStorage
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newValue = !prev;
            localStorage.setItem('soundMuted', String(newValue));
            return newValue;
        });
    }, []);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (!context) {
        return { isMuted: false, toggleMute: () => { } };
    }
    return context;
}

