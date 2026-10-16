import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import {
  RSVPFormData,
  RSVPRecord,
  validateRSVPForm,
  generateWhatsAppLink,
  generateGoogleCalendarUrl,
  generateICalContent,
  CAMILA_EVENT,
} from '../utils/rsvp';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (record: RSVPRecord) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: '',
    phone: '',
    attendance: 'yes',
    companionsCount: 0,
    companionsList: [''],
    drinkPreference: 'Cerveja',
    songRequest: '',
    messageToCamila: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RSVPRecord | null>(null);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleCompanionsCountChange = (count: number) => {
    const validCount = Math.max(0, Math.min(5, count));
    const currentList = [...formData.companionsList];
    while (currentList.length < validCount) {
      currentList.push('');
    }
    setFormData({
      ...formData,
      companionsCount: validCount,
      companionsList: currentList.slice(0, validCount),
    });
  };

  const handleCompanionNameChange = (index: number, name: string) => {
    const list = [...formData.companionsList];
    list[index] = name;
    setFormData({ ...formData, companionsList: list });
  };

  const triggerGlitterConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff007f', '#ff66b2', '#ffffff', '#ffd700', '#c2185b'],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();

    const validation = validateRSVPForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const record: RSVPRecord = {
      ...formData,
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
      sentToEmail: false,
    };

    // Send to recipient email: 2003casm@gmail.com
    let emailSent = false;
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CAMILA_EVENT.recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `🎉 Nova Confirmação de Presença: ${formData.fullName} (${formData.attendance === 'yes' ? 'VAI' : 'NÃO VAI'})`,
          _replyto: CAMILA_EVENT.recipientEmail,
          _template: 'table',
          Nome: formData.fullName,
          Telefone: formData.phone,
          Presenca: formData.attendance === 'yes' ? 'SIM, CONFIRMADO! 🎉' : 'NÃO PODERÁ IR 💔',
          QtdAcompanhantes: formData.companionsCount,
          Acompanhantes: formData.companionsList.filter(Boolean).join(', ') || 'Nenhum',
          BebidaQueVaiLevar: formData.drinkPreference,
          MusicaPedida: formData.songRequest || 'Nenhuma',
          MensagemParaCamila: formData.messageToCamila || 'Sem mensagem',
          Evento: `${CAMILA_EVENT.title} - ${CAMILA_EVENT.dateStr} às ${CAMILA_EVENT.timeStr} no ${CAMILA_EVENT.locationName}`,
        }),
      });

      if (response.ok) {
        emailSent = true;
        setEmailStatusMessage('✅ Confirmação enviada com sucesso para o e-mail da Camila!');
      } else {
        setEmailStatusMessage('Registro salvo com sucesso! (Você também pode avisar no WhatsApp abaixo)');
      }
    } catch {
      setEmailStatusMessage('Registro salvo com sucesso! (Você também pode avisar no WhatsApp abaixo)');
    }

    record.sentToEmail = emailSent;

    // Save to local storage
    try {
      const existing = localStorage.getItem('camila_23_rsvp_list');
      const list: RSVPRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem('camila_23_rsvp_list', JSON.stringify(list));
    } catch {
      // ignore storage error
    }

    setSubmitting(false);
    setSubmittedRecord(record);
    onSuccess(record);

    if (formData.attendance === 'yes') {
      sounds.playFanfare();
      triggerGlitterConfetti();
    } else {
      sounds.playPop();
    }
  };

  const downloadCalendarFile = () => {
    sounds.playPop();
    const icalData = generateICalContent();
    const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'aniversario-camila-23.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#fff0f6] to-[#ffd6e6] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-white text-slate-800 my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center justify-center shadow transition-transform active:scale-95"
          aria-label="Fechar formulário de confirmação"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        {!submittedRecord ? (
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <span className="text-3xl animate-bounce inline-block">💌</span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-[#990044] tracking-wide uppercase mt-1"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Confirmação de Presença
              </h2>
              <p className="text-xs sm:text-sm text-pink-900 mt-1">
                Aniversário de 23 anos da <strong>Camila</strong> 💕
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                <span className="px-2.5 py-0.5 bg-pink-100 rounded-full border border-pink-300 text-[10px] text-pink-900 font-semibold">
                  📍 Smiley Home Resort (24/10 às 17h)
                </span>
                <span className="px-2.5 py-0.5 bg-purple-100 rounded-full border border-purple-300 text-[10px] text-purple-900 font-semibold">
                  👗 Look: Y2K / Anos 2000
                </span>
                <span className="px-2.5 py-0.5 bg-amber-100 rounded-full border border-amber-300 text-[10px] text-amber-900 font-semibold">
                  🍾 Levar a própria bebida
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Seu Nome Completo <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Silva"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.fullName ? 'border-red-500 ring-1 ring-red-400' : 'border-pink-300'
                  } bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName}</p>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-950 mb-1">
                  WhatsApp / Celular <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (11) 98765-4321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.phone ? 'border-red-500 ring-1 ring-red-400' : 'border-pink-300'
                  } bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>
                )}
              </div>

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-950 mb-1.5">
                  Você vai comparecer? <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setFormData({ ...formData, attendance: 'yes' });
                    }}
                    className={`py-3 px-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.attendance === 'yes'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 shadow-md scale-[1.02]'
                        : 'bg-white text-slate-700 border-pink-200 hover:border-pink-400'
                    }`}
                  >
                    <span className="text-lg">🎉</span>
                    <span>Sim, com certeza!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setFormData({ ...formData, attendance: 'no' });
                    }}
                    className={`py-3 px-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.attendance === 'no'
                        ? 'bg-gray-700 text-white border-gray-900 shadow-md scale-[1.02]'
                        : 'bg-white text-slate-700 border-pink-200 hover:border-pink-400'
                    }`}
                  >
                    <span className="text-lg">💔</span>
                    <span>Infelizmente não</span>
                  </button>
                </div>
              </div>

              {/* Fields if attending */}
              {formData.attendance === 'yes' && (
                <div className="space-y-4 pt-2 border-t border-pink-200/80 animate-in fade-in duration-200">
                  {/* Companions */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-pink-950 mb-1">
                      Vai levar acompanhante?
                    </label>
                    <div className="flex items-center gap-3">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            handleCompanionsCountChange(num);
                          }}
                          className={`w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all ${
                            formData.companionsCount === num
                              ? 'bg-pink-600 text-white border-pink-700 shadow'
                              : 'bg-white text-pink-900 border-pink-300 hover:bg-pink-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <span className="text-xs text-pink-900">
                        {formData.companionsCount === 0
                          ? 'Vou sozinho(a)'
                          : `${formData.companionsCount} acompanhante(s)`}
                      </span>
                    </div>

                    {/* Companion Names */}
                    {formData.companionsCount > 0 && (
                      <div className="mt-2 space-y-2 pl-2 border-l-2 border-pink-400">
                        {Array.from({ length: formData.companionsCount }).map((_, idx) => (
                          <input
                            key={idx}
                            type="text"
                            placeholder={`Nome do ${idx + 1}º acompanhante`}
                            value={formData.companionsList[idx] || ''}
                            onChange={(e) => handleCompanionNameChange(idx, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-pink-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Song Request (O que a pessoa quer ouvir) */}
                  <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#990044] mb-1">
                      O que você quer ouvir na festa? 🎶
                    </label>
                    <p className="text-[11px] text-pink-900 mb-2">
                      Coloque suas músicas e artistas favoritos para a aniversariante montar a playlist perfeita dos 23 anos!
                    </p>
                    <input
                      type="text"
                      placeholder="Ex: Britney Spears - Toxic, Fergie - Glamorous, Furacão 2000..."
                      value={formData.songRequest}
                      onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                    />
                  </div>

                  {/* Bring Your Own Drink (Leve sua própria bebida) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-pink-950 mb-1">
                      O que você vai levar para beber? 🍾
                    </label>
                    <div className="mb-2 p-2 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-950 flex items-center gap-1.5 font-medium">
                      <span>🧊</span>
                      <span><strong>Lembrete importante:</strong> Traga a sua própria bebida! (Coolers e sacolas térmicas liberados com gelo).</span>
                    </div>
                    <select
                      value={formData.drinkPreference}
                      onChange={(e) => setFormData({ ...formData, drinkPreference: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-pink-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                    >
                      <option value="Cerveja">🍺 Cerveja / Chopp</option>
                      <option value="Gin / Vodka / Destilados">🍸 Gin / Vodka / Destilados</option>
                      <option value="Vinho / Espumante">🍷 Vinho / Espumante</option>
                      <option value="Drinks Prontos">🍹 Ice / Drinks em lata</option>
                      <option value="Energético / Refri / Suco">🥤 Energético / Refrigerante / Suco</option>
                      <option value="Água / Não Alcoólico">💧 Água / Bebidas não alcoólicas</option>
                      <option value="Outro">✨ Outro</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Message to Birthday Girl */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Recadinho de parabéns para a Camila 💌 (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Escreva uma mensagem com carinho para os 23 anos dela!"
                  value={formData.messageToCamila}
                  onChange={(e) => setFormData({ ...formData, messageToCamila: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-[#d81b60] hover:from-pink-600 hover:to-[#c2185b] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Enviando confirmação...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">✨</span>
                    <span>CONFIRMAR AGORA</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-pink-900/80">
                Sua resposta será enviada diretamente para o e-mail: <strong>{CAMILA_EVENT.recipientEmail}</strong>
              </p>
            </form>
          </div>
        ) : (
          /* Confirmation Success View */
          <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow">
              {submittedRecord.attendance === 'yes' ? '🎉' : '💌'}
            </div>

            <div>
              <h3
                className="text-2xl font-extrabold text-[#990044] uppercase"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                {submittedRecord.attendance === 'yes' ? 'Presença Confirmada!' : 'Resposta Enviada!'}
              </h3>
              <p className="text-xs sm:text-sm text-pink-900 mt-1">
                Obrigado, <strong>{submittedRecord.fullName}</strong>!
                {submittedRecord.attendance === 'yes'
                  ? ' Mal podemos esperar para comemorar os 23 anos da Camila com você!'
                  : ' Sentiremos sua falta, mas obrigado por avisar!'}
              </p>
            </div>

            {/* Email dispatch alert */}
            {emailStatusMessage && (
              <div className="p-2.5 bg-pink-100 rounded-xl text-xs text-pink-950 border border-pink-300 font-medium">
                {emailStatusMessage}
              </div>
            )}

            {/* WhatsApp Backup Button */}
            <div className="p-3 bg-white/80 rounded-2xl border border-pink-300 space-y-2">
              <p className="text-xs font-bold text-pink-950">
                Deseja mandar também um comprovante no WhatsApp da Camila?
              </p>
              <a
                href={generateWhatsAppLink('', submittedRecord)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playPop()}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
              >
                <span>💬</span>
                <span>Enviar Confirmação pelo WhatsApp</span>
              </a>
            </div>

            {/* Calendar Buttons if Attending */}
            {submittedRecord.attendance === 'yes' && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                  Salve na sua Agenda para não esquecer:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={generateGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playPop()}
                    className="flex-1 py-2 px-3 bg-white hover:bg-pink-50 border border-pink-300 text-pink-900 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>Google Agenda</span>
                  </a>

                  <button
                    onClick={downloadCalendarFile}
                    className="flex-1 py-2 px-3 bg-white hover:bg-pink-50 border border-pink-300 text-pink-900 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>🍏</span>
                    <span>Apple / Outlook (.ics)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
