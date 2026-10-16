import React from 'react';

interface DiscoBallProps {
  size?: number; // size in px
  hangingChain?: boolean;
  chainHeight?: number;
  className?: string;
}

export const DiscoBall: React.FC<DiscoBallProps> = ({
  size = 140,
  hangingChain = false,
  chainHeight = 40,
  className = '',
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}>
      {/* Hanging Chain */}
      {hangingChain && (
        <div
          className="w-1.5 flex flex-col items-center justify-between shadow-sm z-10"
          style={{ height: `${chainHeight}px` }}
        >
          {Array.from({ length: Math.max(3, Math.floor(chainHeight / 7)) }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full border border-pink-200 bg-gradient-to-b from-[#8f1d43] via-[#ff6699] to-[#ffffff] shadow-sm -my-0.5"
            />
          ))}
        </div>
      )}

      {/* 3D Faceted Pink Disco Ball */}
      <div
        className="relative rounded-full overflow-hidden shadow-[0_15px_35px_rgba(216,27,96,0.5)] transition-transform duration-700"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #ff94c2 30%, #e0246a 65%, #6b002b 100%)',
          boxShadow: `0 12px 30px rgba(180, 10, 70, 0.45), inset -6px -6px 14px rgba(70, 0, 30, 0.8), inset 6px 6px 14px rgba(255, 255, 255, 0.8)`,
        }}
      >
        {/* Real Mirror Facet Grid Pattern (SVG) */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 w-full h-full mix-blend-overlay opacity-95"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id={`mirrorTiles-${size}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect x="0.5" y="0.5" width="9" height="9" fill="#ffffff" fillOpacity="0.25" stroke="#400018" strokeWidth="0.8" />
              <polygon points="1,1 8,1 1,8" fill="#ffffff" fillOpacity="0.4" />
            </pattern>
          </defs>

          {/* Spherical perspective distortion mapping */}
          <rect width="160" height="160" fill={`url(#mirrorTiles-${size})`} />

          {/* Latitude Curved Grid Bands */}
          {[20, 38, 56, 75, 94, 112, 130, 145].map((y, i) => (
            <ellipse
              key={`lat-${i}`}
              cx="80"
              cy={y}
              rx={Math.sin((y / 160) * Math.PI) * 78}
              ry={Math.sin((y / 160) * Math.PI) * 18}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity="0.85"
            />
          ))}

          {/* Longitude Curved Meridians */}
          {[-60, -42, -22, 0, 22, 42, 60].map((rot, i) => (
            <ellipse
              key={`long-${i}`}
              cx={80 + rot * 0.9}
              cy="80"
              rx={Math.max(6, 78 - Math.abs(rot) * 0.85)}
              ry="78"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeDasharray="4 2.5"
              opacity="0.8"
            />
          ))}
        </svg>

        {/* Specular Glint Top Left */}
        <div
          className="absolute top-2 left-4 rounded-full bg-white opacity-85 blur-[1px]"
          style={{
            width: `${size * 0.35}px`,
            height: `${size * 0.22}px`,
            transform: 'rotate(-35deg)',
          }}
        />

        {/* Floating Sparkle Glints */}
        <div className="absolute top-[22%] left-[30%] text-white text-xs opacity-95 animate-sparkle">
          ✦
        </div>
        <div className="absolute bottom-[30%] right-[22%] text-pink-100 text-xs opacity-85 animate-sparkle" style={{ animationDelay: '1.2s' }}>
          ✧
        </div>
      </div>
    </div>
  );
};
