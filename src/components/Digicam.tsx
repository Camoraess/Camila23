import React, { useState } from 'react';
import { sounds } from '../utils/sound';

interface DigicamProps {
  className?: string;
  onOpenPhotoWall?: () => void;
}

export const Digicam: React.FC<DigicamProps> = ({ className = '' }) => {
  const [flashing, setFlashing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [polaroids, setPolaroids] = useState<Array<{ name: string; message: string; date: string; sticker: string }>>([
    {
      name: 'Camila ✨ (Aniversariante)',
      message: 'Muito ansiosa pra ver todo mundo! Vai ser a melhor festa!',
      date: 'Hoje',
      sticker: '💖',
    },
    {
      name: 'Melhores Amigos 🪩',
      message: 'Já estamos escolhendo o look anos 2000!',
      date: 'Ontem',
      sticker: '✨',
    },
  ]);

  const triggerSnap = () => {
    sounds.playCameraShutter();
    setFlashing(true);
    setTimeout(() => {
      setFlashing(false);
      setShowModal(true);
    }, 250);
  };

  const handleAddPolaroid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    sounds.playSparkle();
    const stickers = ['💖', '🪩', '🦋', '⭐', '💿', '📸'];
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];

    setPolaroids([
      {
        name: guestName,
        message: photoMessage || 'Presente na melhor festa do ano! 💖',
        date: 'Agora',
        sticker: randomSticker,
      },
      ...polaroids,
    ]);
    setGuestName('');
    setPhotoMessage('');
  };

  return (
    <>
      {/* Screen flash overlay when camera clicks */}
      {flashing && (
        <div className="fixed inset-0 z-[100] bg-white transition-opacity duration-200 pointer-events-none" />
      )}

      {/* Retro Pink Digital Camera Button */}
      <div
        className={`relative inline-block cursor-pointer select-none group transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
        onClick={triggerSnap}
        role="button"
        tabIndex={0}
        aria-label="Câmera digital Y2K - Tirar foto / Deixar recado na Polaroid"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerSnap();
          }
        }}
      >
        <div className="w-24 sm:w-28 h-16 sm:h-20 bg-gradient-to-br from-[#ff99c8] via-[#e60067] to-[#800033] rounded-xl p-1.5 shadow-[0_8px_20px_rgba(230,0,103,0.4)] border-2 border-white flex items-center justify-between relative overflow-hidden">
          {/* Top Shutter Button */}
          <div className="absolute -top-1.5 left-4 w-4 h-2 bg-gradient-to-t from-gray-300 to-white rounded-t-sm border border-pink-700 shadow" />

          {/* Flash Bulb */}
          <div className="absolute top-1.5 right-2 w-3.5 h-2.5 rounded-sm bg-yellow-100 border border-white flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
          </div>

          {/* Cyber-shot / Y2K Branding */}
          <div className="flex flex-col justify-between h-full pl-1 z-10">
            <span className="text-[7px] font-pixel text-pink-200 tracking-wider">CYBER-23</span>
            <span className="text-[8px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded-full border border-pink-300/40">
              CLICK 📸
            </span>
          </div>

          {/* Camera Lens */}
          <div className="relative w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-tr from-slate-900 via-pink-950 to-slate-800 border-2 border-white flex items-center justify-center shadow-inner">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-indigo-950 to-purple-900 border border-pink-400/60 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-cyan-300/40" />
            </div>
            {/* Lens Specular Glint */}
            <div className="absolute top-1.5 left-2.5 w-2.5 h-1.5 rounded-full bg-white/70 rotate-[-30deg]" />
          </div>

          {/* Metallic diagonal streak */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
        </div>

        {/* Small floating tag */}
        <span className="absolute -bottom-2 right-1 text-[8px] font-bold uppercase bg-white text-[#d81b60] px-1.5 py-0.2 rounded-full border border-pink-300 shadow">
          Fotos 📷
        </span>
      </div>

      {/* Polaroid & Guestbook Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#ffe6f0] to-[#ffd1e3] rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-white text-slate-800 my-8">
            <button
              onClick={() => {
                sounds.playPop();
                setShowModal(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center justify-center shadow transition-transform active:scale-95"
              aria-label="Fechar fotos Polaroid"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-block p-2 bg-pink-500 rounded-full text-white text-xl shadow mb-1">
                📸
              </div>
              <h3 className="font-extrabold text-xl sm:text-2xl text-[#b3004b]" style={{ fontFamily: "'Rubik', sans-serif" }}>
                MURAL POLAROID DOS 23
              </h3>
              <p className="text-xs text-pink-900">
                Deixe uma mensagem fofa para a Camila com a sua Polaroid virtual!
              </p>
            </div>

            {/* Leave a Polaroid Message Form */}
            <form onSubmit={handleAddPolaroid} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-pink-300/70 shadow-sm mb-5">
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Seu Nome / Apelido"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Mensagem rápida (ex: Não perco por nada!)"
                  value={photoMessage}
                  onChange={(e) => setPhotoMessage(e.target.value)}
                  className="flex-[2] px-3 py-2 text-xs sm:text-sm rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <span>✨</span>
                <span>Prender Minha Polaroid no Mural</span>
              </button>
            </form>

            {/* Polaroid Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {polaroids.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg shadow-md border border-gray-200 transform hover:-rotate-1 transition-transform flex flex-col justify-between"
                  style={{
                    boxShadow: '0 4px 12px rgba(180,0,60,0.12)',
                  }}
                >
                  <div className="w-full h-24 bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-200 rounded flex items-center justify-center text-3xl relative overflow-hidden mb-2">
                    <span className="transform hover:scale-125 transition-transform cursor-pointer">
                      {item.sticker}
                    </span>
                    <span className="absolute bottom-1 right-1 text-[8px] font-pixel text-pink-600/70">
                      CAMILA&apos;S 23
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-xs text-pink-950 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-700 italic line-clamp-2 mt-0.5">
                      &quot;{item.message}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
