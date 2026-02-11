"use client";
import { useEffect, useRef } from 'react';

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadVanta = async () => {
      if (typeof window !== 'undefined') {
        if (!window.THREE) {
          const threeScript = document.createElement('script');
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
          document.head.appendChild(threeScript);
          await new Promise((resolve) => {
            threeScript.onload = resolve;
          });
        }

        if (!window.VANTA || !window.VANTA.GLOBE) {
          const vantaScript = document.createElement('script');
          vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
          document.head.appendChild(vantaScript);
          await new Promise((resolve) => {
            vantaScript.onload = resolve;
          });
        }

        if (isMounted && window.VANTA && window.VANTA.GLOBE && vantaRef.current && !vantaEffectRef.current) {
          vantaEffectRef.current = window.VANTA.GLOBE({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x207fe3,
            backgroundColor: 0x609
          });
        }
      }
    };

    loadVanta();

    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={vantaRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}>
      {children}
    </div>
  );
};

export default VantaBackground;