"use client";
import React, { useEffect, useRef, useState } from 'react';

/**
 * A wrapper for the <video> element that only loads and plays the video 
 * when it enters the viewport using IntersectionObserver.
 */
const LazyVideo = ({
    src,
    className,
    loop = true,
    muted = true,
    autoPlay = true,
    playsInline = true,
    poster = "",
    ...props
}) => {
    const videoRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '200px', // Start loading 200px before it enters viewport
                threshold: 0.01
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    // Performance optimization: optimize Cloudinary URLs automatically
    const optimizedSrc = React.useMemo(() => {
        if (src && src.includes('cloudinary.com') && !src.includes('f_auto')) {
            // Basic check to see if we can insert transformations
            // Format: .../upload/[transformations]/v12345/filename
            const uploadIndex = src.indexOf('/upload/');
            if (uploadIndex !== -1) {
                const prefix = src.substring(0, uploadIndex + 8);
                const suffix = src.substring(uploadIndex + 8);
                return `${prefix}f_auto,q_auto/${suffix}`;
            }
        }
        return src;
    }, [src]);

    return (
        <video
            ref={videoRef}
            className={className}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            poster={poster}
            {...(isInView ? { src: optimizedSrc, autoPlay } : {})}
            {...props}
        />
    );
};

export default LazyVideo;
