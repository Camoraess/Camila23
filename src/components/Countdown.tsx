import React, { useState, useEffect } from 'react';

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      // Event: October 24 at 17:00
      const now = new Date();
      let targetYear = now.getFullYear();
      let targetDate = new Date(targetYear, 9, 24, 17, 0, 0); // Month is 0-indexed (9 = Oct)

      // If already past this year, target next year
      if (now.getTime() > targetDate.getTime()) {
        targetYear += 1;
        targetDate = new Date(targetYear, 9, 24, 17, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto my-4 bg-white/70 backdrop-blur-md border-2 border-pink-300 rounded-2xl p-3 shadow-lg">
      <div className="text-center mb-2 flex items-center justify-center gap-1.5">
        <span className="text-pink-500 animate-spin">⏱️</span>
        <span className="text-xs font-bold uppercase tracking-wider text-pink-900 font-pixel text-[10px]">
          CONTAGEM REGRESSIVA
        </span>
        <span className="text-pink-500 animate-spin">⏱️</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'DIAS', value: timeLeft.days },
          { label: 'HORAS', value: timeLeft.hours },
          { label: 'MIN', value: timeLeft.minutes },
          { label: 'SEG', value: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-pink-500 to-[#d81b60] text-white rounded-xl p-2 shadow-md border border-pink-300/80 flex flex-col items-center justify-center"
          >
            <span
              className="text-lg sm:text-2xl font-black font-mono leading-none tracking-tight"
              style={{ fontFamily: "'Rubik', monospace" }}
            >
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-pink-100 tracking-wider mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
