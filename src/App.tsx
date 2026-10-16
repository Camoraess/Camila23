import React, { useState, useEffect } from 'react';
import { DiscoBall } from './components/DiscoBall';
import { JellyHeart } from './components/JellyHeart';
import { FlipPhone } from './components/FlipPhone';
import { Digicam } from './components/Digicam';
import { Balloon, HologramCD, MetallicHeart, SparkleStar, Butterfly } from './components/Y2KStickers';
import { Countdown } from './components/Countdown';
import { RSVPModal } from './components/RSVPModal';
import { GuestListModal } from './components/GuestListModal';
import conviteImg from './assets/images/convite-camila-23.jpg';
import { sounds } from './utils/sound';
import { RSVPRecord, CAMILA_EVENT, generateGoogleCalendarUrl } from './utils/rsvp';

export default function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestListOpen, setIsGuestListOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [guestRecords, setGuestRecords] = useState<RSVPRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customInviteImage, setCustomInviteImage] = useState<string | null>(conviteImg);
  const [displayMode, setDisplayMode] = useState<'interactive' | 'image'>('image');
  // Painel da organizadora só aparece com ?admin=1 na URL
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';

  // Load saved RSVPs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('camila_23_rsvp_list');
      if (saved) {
        setGuestRecords(JSON.parse(saved));
      }
      localStorage.removeItem('camila_custom_invite_image');
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRSVPSuccess = (record: RSVPRecord) => {
    setGuestRecords((prev) => [record, ...prev]);
    showToast(`Presença registrada com sucesso para ${record.fullName}! 💕`);
  };

  const handleAddSampleData = () => {
    const samples: RSVPRecord[] = [
      {
        id: 'sample_1',
        fullName: 'Larissa Manoela',
        phone: '(11) 99876-5432',
        attendance: 'yes',
        companionsCount: 1,
        companionsList: ['Thomaz Costa'],
        drinkPreference: 'Drinks',
        dietaryRestrictions: '',
        songRequest: 'Festa no Apê - Latino',
        messageToCamila: 'Cá, você merece o mundo! Parabéns amiga!',
        submittedAt: new Date().toISOString(),
        sentToEmail: true,
      },
      {
        id: 'sample_2',
        fullName: 'Guilherme Siqueira',
        phone: '(11) 98765-1234',
        attendance: 'yes',
        companionsCount: 0,
        companionsList: [],
        drinkPreference: 'Cerveja',
        dietaryRestrictions: '',
        songRequest: 'Yeah! - Usher',
        messageToCamila: 'Partiu churrasco!',
        submittedAt: new Date().toISOString(),
        sentToEmail: true,
      },
      {
        id: 'sample_3',
        fullName: 'Beatriz Vasconcelos',
        phone: '(11) 97654-9876',
        attendance: 'no',
        companionsCount: 0,
        companionsList: [],
        drinkPreference: '',
        dietaryRestrictions: '',
        songRequest: '',
        messageToCamila: 'Estarei viajando, mas mando muitas energias boas!',
        submittedAt: new Date().toISOString(),
        sentToEmail: true,
      },
    ];
    setGuestRecords(samples);
    localStorage.setItem('camila_23_rsvp_list', JSON.stringify(samples));
    showToast('3 confirmações de teste adicionadas à lista!');
  };

  const handleClearList = () => {
    setGuestRecords([]);
    localStorage.removeItem('camila_23_rsvp_list');
    showToast('Lista de convidados limpa com sucesso.');
  };

  const copyAddress = () => {
    sounds.playPop();
    navigator.clipboard.writeText('Smiley Home Resort, Churrasqueira da Quadra');
    showToast('📍 Endereço copiado para a área de transferência!');
  };

  const confirmedCount = guestRecords.filter((r) => r.attendance === 'yes').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffd3e4] via-[#ffc0db] to-[#ffaecf] text-slate-800 relative selection:bg-[#ff1493] selection:text-white pb-16">
      {/* Floating Sparkle Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#ff69b4_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Top Navbar / Utility Bar */}
      <header className="relative z-30 max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪩</span>
          <span className="font-extrabold text-sm sm:text-base text-[#7a042e] tracking-tight">
            CAMILA 23 <span className="font-normal text-xs text-pink-700 hidden sm:inline">• Smiley Home Resort</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
              if (!muted) sounds.playPop();
            }}
            className="px-2.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-[#8b003a] border border-pink-300 shadow-sm flex items-center gap-1 transition-all"
            aria-label={isMuted ? 'Ativar sons' : 'Desativar sons'}
            title={isMuted ? 'Ativar efeitos sonoros' : 'Desativar efeitos sonoros'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden sm:inline">{isMuted ? 'Som Desligado' : 'Sons 2000s'}</span>
          </button>

          {/* Organizer / Guest List toggle (somente com ?admin=1) */}
          {isAdmin && (
            <button
              onClick={() => {
                sounds.playPop();
                setIsGuestListOpen(true);
              }}
              className="px-3 py-1.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
              aria-label="Ver lista de convidados"
            >
              <span>📋</span>
              <span>Lista ({confirmedCount})</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container matching the visual layout of the invitation */}
      <main className="relative z-10 max-w-xl mx-auto px-4 pt-2">
        {/* VIEW 1: ORIGINAL IMAGE WITH INTERACTIVE HOTSPOTS */}
        {displayMode === 'image' && customInviteImage ? (
          <div className="relative rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(216,27,96,0.35)] border-4 sm:border-8 border-white overflow-hidden bg-white group">
            {/* The exact original uploaded image */}
            <img
              src={customInviteImage}
              alt="Convite Camila 23"
              onError={() => {
                setCustomInviteImage(null);
                setDisplayMode('interactive');
              }}
              className="w-full h-auto object-cover select-none block"
            />

            {/* Interactive Hotspot 1: Center Heart (Opens RSVP) */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsRSVPOpen(true);
              }}
              className="absolute top-[44%] left-[20%] w-[60%] h-[28%] rounded-full cursor-pointer hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border-2 border-white/0 hover:border-white/60 group/heart"
              aria-label="Confirmar presença no coração"
            >
              <span className="opacity-0 group-hover/heart:opacity-100 bg-[#e91e63]/90 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border border-white transition-opacity">
                Toque para Confirmar ✨
              </span>
            </button>

            {/* Interactive Hotspot 2: Location Badge (Copies Address) */}
            <button
              onClick={copyAddress}
              className="absolute bottom-[7%] left-[12%] w-[70%] h-[8%] rounded-full cursor-pointer hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center group/badge"
              aria-label="Copiar endereço do local"
            >
              <span className="opacity-0 group-hover/badge:opacity-100 bg-black/80 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow border border-white transition-opacity">
                Copiar Endereço 📋
              </span>
            </button>

            {/* Interactive Hotspot 3: Flip Phone bottom right */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsRSVPOpen(true);
              }}
              className="absolute bottom-[2%] right-[2%] w-[25%] h-[20%] rounded-2xl cursor-pointer hover:bg-white/20 active:scale-95 transition-all"
              aria-label="Abrir confirmação pelo celular"
            />

            {/* Interactive Hotspot 4: Digicam top right */}
            <div className="absolute top-[3%] right-[16%] w-[22%] h-[15%]">
              <button
                onClick={() => {
                  sounds.playCameraShutter();
                  showToast('📸 Sorria! Clicou na câmera dos 23 anos!');
                }}
                className="w-full h-full rounded-xl cursor-pointer hover:bg-white/20 active:scale-95 transition-all"
                aria-label="Tirar foto com a câmera digital"
              />
            </div>
          </div>
        ) : (
          /* VIEW 2: HIGH-FIDELITY FAITHFUL FLYER FRAME */
          <div
            className="relative rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 shadow-[0_20px_50px_rgba(216,27,96,0.35)] border-4 sm:border-8 border-white overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #ffe0ec 35%, #ffb6d4 75%, #ffa1c7 100%)',
            }}
          >
          {/* Top Decorative Row */}
          {/* Top-Left Hanging Disco Ball */}
          <div className="absolute -top-3 -left-4 z-20">
            <DiscoBall size={125} hangingChain={true} chainHeight={30} />
          </div>

          {/* Top-Center Hanging Disco Ball */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
            <DiscoBall size={70} hangingChain={true} chainHeight={25} />
          </div>

          {/* Top-Right Cyber Digicam and Disco Ball */}
          <div className="absolute top-3 right-2 sm:right-4 z-30 flex items-start gap-1">
            <Digicam />
            <div className="-mt-3 -mr-6">
              <DiscoBall size={115} hangingChain={true} chainHeight={20} />
            </div>
          </div>

          {/* Sparkles scattered near top */}
          <div className="absolute top-12 left-1/4 z-10">
            <SparkleStar size={26} color="#ffffff" />
          </div>
          <div className="absolute top-20 right-1/4 z-10">
            <SparkleStar size={20} color="#ff99c8" />
          </div>

          {/* HEADER: "CAMILA 23" in bold Varsity typography */}
          <div className="text-center pt-24 sm:pt-28 pb-4 relative z-20 select-none">
            <h1 className="font-varsity text-5xl sm:text-7xl md:text-8xl tracking-wider leading-none transform hover:scale-105 transition-transform duration-300">
              CAMILA
            </h1>
            <div className="font-varsity text-6xl sm:text-8xl md:text-9xl tracking-tight leading-none mt-1 sm:mt-2 text-[#fff0f6]">
              23
            </div>
          </div>

          {/* Mid Section Stickers Floating around */}
          {/* Left Side: Balloons and Hologram CD */}
          <div className="absolute top-44 left-2 sm:left-4 z-20 flex flex-col items-center">
            <Balloon size={65} className="rotate-[-6deg]" />
            <div className="-mt-4 -ml-2">
              <HologramCD size={55} />
            </div>
            <div className="mt-1">
              <Butterfly size={24} />
            </div>
          </div>

          {/* Right Side: Balloons and Hologram CD */}
          <div className="absolute top-48 right-2 sm:right-4 z-20 flex flex-col items-center">
            <Balloon size={65} className="rotate-[8deg]" />
            <div className="-mt-4 -mr-2">
              <HologramCD size={55} />
            </div>
            <div className="mt-2">
              <MetallicHeart size={32} />
            </div>
          </div>

          {/* CENTERPIECE: HUGE 3D GLOSSY JELLY HEART */}
          <div className="flex justify-center my-2 sm:my-4 relative z-20">
            <JellyHeart
              onClick={() => {
                sounds.playPop();
                setIsRSVPOpen(true);
              }}
            />
          </div>

          {/* Bottom Row Decorative Disco Balls & Stickers */}
          {/* Bottom Left Big Disco Ball */}
          <div className="absolute -bottom-6 -left-8 z-20">
            <DiscoBall size={145} />
          </div>

          {/* Bottom Right Big Disco Ball */}
          <div className="absolute -bottom-6 -right-8 z-20">
            <DiscoBall size={150} />
          </div>

          {/* Floating Balloons and CDs near bottom */}
          <div className="absolute bottom-20 left-2 z-20">
            <HologramCD size={50} />
          </div>
          <div className="absolute bottom-16 left-12 z-20">
            <Balloon size={55} />
          </div>

          {/* Central Bottom Location Capsule Badge */}
          <div className="relative z-30 mt-4 sm:mt-8 mb-6 sm:mb-4 flex flex-col items-center text-center px-1">
            <div
              onClick={copyAddress}
              role="button"
              tabIndex={0}
              aria-label="Local do evento: Smiley Home Resort (Churrasqueira Quadra) - Clique para copiar endereço"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyAddress();
                }
              }}
              className="glitter-badge px-4 sm:px-8 py-2.5 sm:py-4 rounded-full cursor-pointer max-w-[85%] sm:max-w-full transform hover:scale-105 active:scale-95 transition-all group"
            >
              <h2
                className="text-white font-black text-sm sm:text-xl md:text-2xl uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(70,0,30,0.8)] leading-tight"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                SMILEY HOME RESORT
              </h2>
              <p
                className="text-pink-100 font-extrabold text-[11px] sm:text-sm uppercase tracking-wide drop-shadow-[0_1px_3px_rgba(70,0,30,0.8)] mt-0.5"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                (CHURRASQUEIRA QUADRA)
              </p>
              <span className="text-[9px] sm:text-[10px] text-pink-200 block mt-0.5 font-semibold opacity-90 group-hover:opacity-100">
                Toque para copiar endereço 📋
              </span>
            </div>
          </div>

          {/* Bottom Right: Interactive Pink Flip Phone */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-6 z-30 transform scale-90 sm:scale-100 origin-bottom-right">
            <FlipPhone onOpenRSVP={() => setIsRSVPOpen(true)} />
          </div>

          {/* Bottom Left Butterfly sticker */}
          <div className="absolute bottom-6 left-6 z-30">
            <Butterfly size={26} />
          </div>
        </div>
        )}

        {/* PRIMARY RSVP CTA BUTTON */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              sounds.playPop();
              setIsRSVPOpen(true);
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#ff007f] via-[#e60067] to-[#b3004b] hover:from-[#ff1493] hover:to-[#99003d] text-white font-black text-base sm:text-lg uppercase tracking-wider rounded-2xl shadow-[0_10px_25px_rgba(230,0,103,0.45)] border-2 border-white flex items-center justify-center gap-2 transform active:scale-95 transition-all group"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">💌</span>
            <span>CONFIRMAR MINHA PRESENÇA AQUI</span>
            <span className="text-xl group-hover:-rotate-12 transition-transform">✨</span>
          </button>
          <p className="text-xs text-[#800033] mt-2 font-medium">
            Confirmação enviada diretamente para o e-mail: <strong>{CAMILA_EVENT.recipientEmail}</strong>
          </p>
        </div>

        {/* Real-time Countdown */}
        <div className="mt-4">
          <Countdown />
        </div>

        {/* DETAILS & EVENT INFO CARDS (BALANCED BLOCKS) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bloco 1: Local & Horário */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-pink-300 shadow-md flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-pink-700 font-bold text-sm mb-3">
                <span className="text-xl">📍</span>
                <span className="uppercase tracking-wider">LOCAL DO EVENTO</span>
              </div>

              <div className="space-y-1.5 mb-4">
                <h3 className="text-base sm:text-lg font-black text-pink-950 uppercase tracking-tight">
                  Smiley Home Resort
                </h3>
                <p className="text-xs text-pink-800 font-bold">
                  Churrasqueira da Quadra
                </p>
                <p className="text-xs text-gray-700 font-semibold pt-1">
                  🗓️ Sábado, 24 de Outubro às 17h
                </p>
                <p className="text-[11px] text-gray-500">
                  Entrada liberada na portaria com nome na lista.
                </p>
              </div>
            </div>

            {/* Botoes de Navegacao */}
            <div className="pt-3 border-t border-pink-200/80 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Smiley+Home+Resort"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playPop()}
                  className="py-2 px-2 bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs rounded-xl text-center border border-pink-300 flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                >
                  <span>🗺️</span>
                  <span>Google Maps</span>
                </a>

                <a
                  href="https://waze.com/ul?q=Smiley+Home+Resort"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playPop()}
                  className="py-2 px-2 bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs rounded-xl text-center border border-pink-300 flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                >
                  <span>🚗</span>
                  <span>Waze</span>
                </a>
              </div>

              <button
                onClick={copyAddress}
                className="w-full py-2 px-3 bg-white hover:bg-pink-50 text-pink-900 border border-pink-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>📋</span>
                <span>Copiar Endereço</span>
              </button>
            </div>
          </div>

          {/* Bloco 2: Look & Bebidas */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-pink-300 shadow-md flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-pink-700 font-bold text-sm mb-3">
                <span className="text-xl">🪩</span>
                <span className="uppercase tracking-wider">LOOK & BEBIDAS</span>
              </div>

              <ul className="text-xs text-gray-800 space-y-2.5 font-medium mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-base leading-none">👗</span>
                  <span>
                    <strong>Look Y2K / Anos 2000:</strong> Venha no estilo retrô com glitter, jeans, óculos coloridos, tops ou rosa!
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base leading-none">🍾</span>
                  <span>
                    <strong>Traga sua Bebida:</strong> Esquema BYOB! Traga o que você for beber com gelo no seu cooler ou sacola térmica.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base leading-none">🎵</span>
                  <span>
                    <strong>Músicas da Playlist:</strong> Diga no formulário de confirmação qual música não pode faltar!
                  </span>
                </li>
              </ul>
            </div>

            {/* Botao de Agenda */}
            <div className="pt-3 border-t border-pink-200/80">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playPop()}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow text-center flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <span>📅</span>
                <span>Adicionar à Google Agenda</span>
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 text-center text-xs text-[#8a083d] pb-6 space-y-2">
          <p className="font-bold">
            Feito com muito amor para os 23 anos da Camila! 💕🪩
          </p>
        </footer>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#880e4f] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-bold border-2 border-white flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
        onSuccess={handleRSVPSuccess}
      />

      <GuestListModal
        isOpen={isGuestListOpen}
        onClose={() => setIsGuestListOpen(false)}
        records={guestRecords}
        onAddSampleData={handleAddSampleData}
        onClearList={handleClearList}
      />

    </div>
  );
}
