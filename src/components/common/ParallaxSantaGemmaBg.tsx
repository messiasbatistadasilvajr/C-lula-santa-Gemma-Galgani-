import React, { useState, useEffect } from 'react';
import santaGemmaImg from '../../assets/images/santa_gemma_bg_1790044771008.jpg';

interface ParallaxSantaGemmaBgProps {
  opacity?: number; // 0.1 to 1
}

export const ParallaxSantaGemmaBg: React.FC<ParallaxSantaGemmaBgProps> = ({
  opacity = 0.55,
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = (e?: Event) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let currentY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
          
          // Se o evento vier de um container interno com overflow-y
          if (e && e.target && e.target instanceof HTMLElement && e.target.scrollTop > 0) {
            currentY = Math.max(currentY, e.target.scrollTop);
          }
          
          setScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true, capture: true });
    window.addEventListener('touchmove', updateScroll, { passive: true });
    document.addEventListener('scroll', updateScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener('scroll', updateScroll, true);
      window.removeEventListener('touchmove', updateScroll);
      document.removeEventListener('scroll', updateScroll, true);
    };
  }, []);

  // Parallax: moving up smoothly at 25% of scroll speed
  const parallaxOffset = scrollY * 0.25;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden z-0"
    >
      {/* Background Image Container with Parallax Transform */}
      <div
        className="absolute inset-0 w-full h-[135%] -top-[15%] transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate3d(0, -${parallaxOffset}px, 0)`,
        }}
      >
        <img
          src={santaGemmaImg}
          alt="Santa Gemma Galgani ao fundo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_20%] filter brightness-95 contrast-105"
          style={{
            opacity: Math.max(0.2, Math.min(1, opacity)),
          }}
        />
      </div>

      {/* Warm sacred lighting and subtle vignette across whole screen */}
      <div 
        className="absolute inset-0 bg-radial from-transparent via-[#2B0609]/20 to-[#1A0305]/45 pointer-events-none" 
      />

      {/* Gentle liturgical warm top aura */}
      <div 
        className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#7B1113]/35 to-transparent pointer-events-none" 
      />

      {/* Soft base gradient for comfortable reading at the bottom */}
      <div 
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#1F0407]/40 to-transparent pointer-events-none" 
      />
    </div>
  );
};
