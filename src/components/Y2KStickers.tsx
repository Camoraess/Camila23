import React from 'react';

// Balloon with 8-bit pixel heart on it
export const Balloon: React.FC<{ size?: number; className?: string }> = ({
  size = 70,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none animate-balloon ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.25}px` }}
    >
      <div
        className="w-full h-[85%] rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] relative shadow-lg overflow-hidden flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #ffb3d1 35%, #f06292 70%, #c2185b 100%)',
          boxShadow: '0 8px 16px rgba(233,30,99,0.3), inset -3px -3px 8px rgba(136,14,79,0.5), inset 3px 3px 6px rgba(255,255,255,0.7)',
        }}
      >
        {/* Pixel 8-bit heart graphic */}
        <div className="text-sm sm:text-base filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          <svg width="22" height="20" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 0H2V1H1V2H0V5H1V6H2V7H3V8H4V9H5V10H6V9H7V8H8V7H9V6H10V5H11V2H10V1H9V0H8V1H7V2H6V3H5V2H4V1H3V0Z"
              fill="#000000"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 1H2V2H1V5H2V6H3V7H4V8H5V9H6V8H7V7H8V6H9V5H10V2H9V1H8V2H7V3H6V4H5V3H4V2H3V1Z"
              fill="#ff007f"
            />
            {/* White pixel highlight */}
            <rect x="2" y="2" width="1" height="1" fill="#ffffff" />
            <rect x="2" y="3" width="1" height="1" fill="#ffffff" />
            <rect x="3" y="2" width="1" height="1" fill="#ffffff" />
          </svg>
        </div>

        {/* Specular shine */}
        <div className="absolute top-2 left-2.5 w-3 h-4 bg-white/70 rounded-full rotate-[-30deg] blur-[0.5px]" />
      </div>
      {/* Balloon Knot */}
      <div className="w-2.5 h-1.5 mx-auto bg-[#c2185b] rounded-b-sm border-t border-pink-300" />
      {/* Balloon String */}
      <div className="w-0.5 h-6 mx-auto bg-pink-400/50" />
    </div>
  );
};

// Holographic CD with rainbow reflection
export const HologramCD: React.FC<{ size?: number; className?: string }> = ({
  size = 65,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-full cd-rainbow shadow-xl border-2 border-white/90 p-1 flex items-center justify-center select-none pointer-events-none transform transition-transform hover:rotate-45 duration-700 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: '0 8px 20px rgba(0,0,0,0.15), inset 0 0 10px rgba(255,255,255,0.8)',
      }}
    >
      {/* CD Data ring */}
      <div className="w-full h-full rounded-full border border-white/60 flex items-center justify-center relative overflow-hidden">
        {/* Prismatic flare line */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent rotate-45" />

        {/* Center hole ring */}
        <div className="w-[38%] h-[38%] rounded-full bg-white/70 backdrop-blur-sm border-2 border-white/90 flex items-center justify-center shadow-inner">
          {/* Inner transparent hole */}
          <div className="w-[45%] h-[45%] rounded-full bg-[#fdebf3] border border-gray-300 shadow-inner" />
        </div>
      </div>
    </div>
  );
};

// Metallic 3D Puff Heart
export const MetallicHeart: React.FC<{ size?: number; className?: string }> = ({
  size = 35,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none filter drop-shadow-[0_4px_8px_rgba(230,0,103,0.4)] ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg viewBox="0 0 100 90" className="w-full h-full">
        <defs>
          <radialGradient id="puffHeartGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ff85c0" />
            <stop offset="60%" stopColor="#eb2f96" />
            <stop offset="90%" stopColor="#9e1068" />
            <stop offset="100%" stopColor="#530335" />
          </radialGradient>
        </defs>
        <path
          d="M 50,85 C 50,85 10,60 5,35 C 0,10 30,2 50,25 C 70,2 100,10 95,35 C 90,60 50,85 50,85 Z"
          fill="url(#puffHeartGrad)"
          stroke="#ffffff"
          strokeWidth="3"
        />
        {/* Specular shine */}
        <ellipse cx="32" cy="22" rx="7" ry="4" fill="#ffffff" opacity="0.8" transform="rotate(-20, 32, 22)" />
      </svg>
    </div>
  );
};

// 4-pointed Sparkle Star
export const SparkleStar: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 24,
  color = '#ffffff',
  className = '',
}) => {
  return (
    <div
      className={`inline-block select-none pointer-events-none animate-sparkle ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M 50 0 Q 50 50 100 50 Q 50 50 50 100 Q 50 50 0 50 Q 50 50 50 0 Z"
          fill={color}
          filter="drop-shadow(0 0 6px rgba(255,255,255,0.8))"
        />
      </svg>
    </div>
  );
};

// Cute Pink Butterfly
export const Butterfly: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <div
      className={`inline-block select-none pointer-events-none text-pink-600 filter drop-shadow-[0_2px_4px_rgba(216,27,96,0.3)] animate-bounce duration-1000 ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      🦋
    </div>
  );
};
