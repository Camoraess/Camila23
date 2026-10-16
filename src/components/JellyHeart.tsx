import React from 'react';

interface JellyHeartProps {
  onClick?: () => void;
  className?: string;
}

export const JellyHeart: React.FC<JellyHeartProps> = ({ onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-block cursor-pointer jelly-heart-box group ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Confirmar presença - 24 de Outubro às 17h"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="relative w-[280px] sm:w-[340px] md:w-[380px] h-[260px] sm:h-[310px] md:h-[350px] flex items-center justify-center">
        {/* SVG Jelly Heart Background with 3D Chrome Bevel */}
        <svg
          viewBox="0 0 400 360"
          className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(216,27,96,0.5)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Chrome Rim Gradient */}
            <linearGradient id="chromeRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#f48fb1" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#ad1457" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Inner Gel Radial Glow */}
            <radialGradient id="jellyGlow" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4081" />
              <stop offset="40%" stopColor="#e91e63" />
              <stop offset="75%" stopColor="#c2185b" />
              <stop offset="100%" stopColor="#880e4f" />
            </radialGradient>

            {/* Specular Glaze Gradient */}
            <linearGradient id="topGlaze" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Drop Shadow filter */}
            <filter id="heartShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#880e4f" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Heart Base Path */}
          {/* Outer Chrome Bevel Border */}
          <path
            d="M 200,340 
               C 200,340 40,240 25,140 
               C 10,40 120,10 200,100 
               C 280,10 390,40 375,140 
               C 360,240 200,340 200,340 Z"
            fill="none"
            stroke="url(#chromeRim)"
            strokeWidth="16"
            strokeLinejoin="round"
          />

          {/* Secondary metallic inner stroke */}
          <path
            d="M 200,332 
               C 200,332 46,234 33,139 
               C 20,44 124,18 200,104 
               C 276,18 380,44 367,139 
               C 354,234 200,332 200,332 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            opacity="0.9"
          />

          {/* Deep Jelly Body */}
          <path
            d="M 200,326 
               C 200,326 52,230 40,140 
               C 28,50 126,24 200,108 
               C 274,24 372,50 360,140 
               C 348,230 200,326 200,326 Z"
            fill="url(#jellyGlow)"
          />

          {/* Glossy Curved Highlight Pill (Left lobe) */}
          <path
            d="M 80,110 C 65,70 125,40 170,65 C 150,75 105,80 80,110 Z"
            fill="url(#topGlaze)"
            opacity="0.85"
          />

          {/* Glossy Curved Highlight Pill (Right lobe) */}
          <path
            d="M 320,110 C 335,70 275,40 230,65 C 250,75 295,80 320,110 Z"
            fill="url(#topGlaze)"
            opacity="0.85"
          />

          {/* Rim bottom specular reflection */}
          <ellipse cx="200" cy="300" rx="35" ry="12" fill="#ffffff" opacity="0.3" filter="blur(2px)" />
        </svg>

        {/* Date and Time Text Centered Inside Heart matching original flyer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pt-4 sm:pt-6 pointer-events-none">
          <span
            className="text-white uppercase text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_4px_6px_rgba(80,0,30,0.9)]"
            style={{
              fontFamily: "'Graduate', serif",
              letterSpacing: '0.08em',
              WebkitTextStroke: '3.5px #540d25',
              paintOrder: 'stroke fill',
            }}
          >
            24 DE
          </span>
          <span
            className="text-white uppercase text-3xl sm:text-4xl md:text-5xl my-0.5 sm:my-1 drop-shadow-[0_5px_8px_rgba(80,0,30,0.9)]"
            style={{
              fontFamily: "'Graduate', serif",
              letterSpacing: '0.08em',
              WebkitTextStroke: '4px #540d25',
              paintOrder: 'stroke fill',
            }}
          >
            OUTUBRO
          </span>
          <span
            className="text-white uppercase text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_4px_6px_rgba(80,0,30,0.9)]"
            style={{
              fontFamily: "'Graduate', serif",
              letterSpacing: '0.08em',
              WebkitTextStroke: '3.5px #540d25',
              paintOrder: 'stroke fill',
            }}
          >
            AS 17H
          </span>

          {/* Subtle CTA badge */}
          <span className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/30 backdrop-blur-md px-3 py-0.5 rounded-full text-white shadow-sm border border-white/60 animate-pulse">
            Toque para Confirmar ✨
          </span>
        </div>

        {/* Tiny floating butterflies near the heart */}
        <div className="absolute -left-2 top-10 text-xl transform -rotate-12 animate-bounce duration-1000">
          🦋
        </div>
        <div className="absolute -right-3 top-20 text-xl transform rotate-12 animate-bounce duration-1000 delay-300">
          🦋
        </div>
      </div>
    </div>
  );
};
