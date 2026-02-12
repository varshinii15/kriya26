import { useEffect, useRef, useState } from 'react';
import { useExternalScript } from '../../hooks/useExternalScript';

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const threeStatus = useExternalScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
  const vantaStatus = useExternalScript(threeStatus === 'ready' ? 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js' : null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (vantaRef.current) {
      observer.observe(vantaRef.current);
    }

    return () => {
      if (vantaRef.current) {
        observer.unobserve(vantaRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (threeStatus === 'ready' && vantaStatus === 'ready' && vantaRef.current) {
      if (isVisible && !vantaEffectRef.current) {
        vantaEffectRef.current = window.VANTA.GLOBE({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x207fe3,
          size: 0.7,
          backgroundColor: 0x0609,
        });
      } else if (!isVisible && vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [threeStatus, vantaStatus, isVisible]);

  return (
    <div ref={vantaRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}>
      {children}
    </div>
  );
};

export default VantaBackground;