'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const PopupContext = createContext({
  hasSeenPopup: true,
  setHasSeenPopup: () => {},
});

export function PopupProvider({ children }) {
  const [hasSeenPopup, setHasSeenPopup] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    // Check localStorage for previous visit
    const seen = localStorage.getItem('infinitum_popup_seen');
    setHasSeenPopup(!!seen);
  }, []);

  return (
    <PopupContext.Provider value={{ hasSeenPopup, setHasSeenPopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  return useContext(PopupContext);
}
