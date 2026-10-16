import React, { useState } from 'react';
import { sounds } from '../utils/sound';

interface FlipPhoneProps {
  onOpenRSVP: () => void;
  className?: string;
}

export const FlipPhone: React.FC<FlipPhoneProps> = ({ onOpenRSVP, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePhoneClick = () => {
    sounds.playPop();
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Flip Phone Widget */}
      <div
        className={`relative inline-block cursor-pointer select-none group transition-transform duration-300 hover:scale-110 active:scale-95 ${className}`}
        onClick={handlePhoneClick}
        role="button"
        tabIndex={0}
        aria-label="Abrir celular retrô com mensagem da Camila"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePhoneClick();
          }
        }}
      >
        {/* Phone Body Container */}
        <div className="w-20 sm:w-24 h-32 sm:h-36 bg-gradient-to-b from-[#ff66a3] via-[#e60067] to-[#990044] rounded-2xl p-1.5 shadow-[0_10px_25px_rgba(230,0,103,0.45)] border-2 border-white/80 flex flex-col items-center justify-between relative overflow-hidden">
          {/* Bedazzled Rhinestone Texture Effect */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />

          {/* Top Hinge & Camera dot */}
          <div className="w-full flex items-center justify-between px-2 pt-0.5 z-10">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-white/60" />
            <div className="h-1 w-8 bg-pink-900/40 rounded-full" />
            <div className="text-[8px] font-pixel text-pink-100">RAZR</div>
          </div>

          {/* Outer Sub-screen with Glowing Letter */}
          <div className="w-14 sm:w-16 h-14 sm:h-16 bg-[#2a081a] rounded-lg border-2 border-[#ff99c8] flex flex-col items-center justify-center p-1 shadow-inner relative z-10">
            <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xl sm:text-2xl animate-bounce">
              💌
            </div>
            <div className="text-[7px] font-pixel text-[#ff80bf] text-center mt-1 leading-tight">
              1 NOVA MSG
            </div>
          </div>

          {/* Bottom keypad hint */}
          <div className="w-full text-center pb-0.5 z-10">
            <span className="text-[9px] font-bold text-white bg-black/30 px-2 py-0.5 rounded-full border border-pink-300/40 uppercase tracking-wider">
              ABRIR ✨
            </span>
          </div>

          {/* Glossy Diagonal Shine */}
          <div className="absolute -top-10 -left-10 w-28 h-48 bg-gradient-to-tr from-transparent via-white/25 to-transparent rotate-45 pointer-events-none" />
        </div>

        {/* Pulse badge */}
        <div className="absolute -top-2 -right-2 bg-yellow-300 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-md animate-bounce">
          MSG!
        </div>
      </div>

      {/* Retro Phone Dialog / Message Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#ff85b3] via-[#ff4081] to-[#c2185b] rounded-3xl p-5 shadow-2xl border-4 border-white text-white">
            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsOpen(false);
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white font-bold transition-transform active:scale-90"
              aria-label="Fechar mensagem do celular"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Retro Phone Header */}
            <div className="flex items-center gap-2 border-b border-pink-300/40 pb-2 mb-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide text-white drop-shadow">
                  CAMILA (23) ENVIOU:
                </h3>
                <p className="text-[10px] text-pink-100 font-mono">
                  Caixa de Entrada • Mensagem Prioritária
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-[#2a081a]/90 rounded-2xl p-4 border border-[#ff80bf]/50 text-pink-100 mb-4 shadow-inner">
              <p className="text-xs sm:text-sm leading-relaxed mb-2">
                &quot;Oiii migx! 💖 Chegou o momento de comemorar meus 23 anos com quem eu mais amo no mundo!
              </p>
              <p className="text-xs sm:text-sm leading-relaxed mb-2">
                Vai rolar muita música boa e aquela vibe anos 2000 inesquecível lá no Smiley Home Resort! 🪩✨
              </p>
              <p className="text-xs sm:text-sm leading-relaxed mb-2 text-pink-200">
                👗 <strong>Look:</strong> Venha no estilo <strong>Y2K / Anos 2000</strong>!<br />
                🍾 <strong>Bebida:</strong> Traga a sua própria bebida (cooler e sacola térmica liberados com gelo)!
              </p>
              <p className="text-xs sm:text-sm font-bold text-pink-300">
                Por favor confirme sua presença e me diga o que você quer ouvir na playlist! Te espero lá! 💕&quot;
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsOpen(false);
                  onOpenRSVP();
                }}
                className="w-full py-2.5 px-4 bg-white text-[#d81b60] hover:bg-pink-50 font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>💌</span>
                <span>CONFIRMAR MINHA PRESENÇA AGORA</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setIsOpen(false);
                }}
                className="w-full py-2 px-4 bg-black/30 hover:bg-black/50 text-pink-200 text-xs rounded-xl font-medium transition-colors"
              >
                Voltar para o convite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
