import React, { useState } from 'react';
import { sounds } from '../utils/sound';
import {
  RSVPRecord,
  calculateTotals,
  generateCsvExport,
  CAMILA_EVENT,
} from '../utils/rsvp';

interface GuestListModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: RSVPRecord[];
  onAddSampleData: () => void;
  onClearList: () => void;
}

export const GuestListModal: React.FC<GuestListModalProps> = ({
  isOpen,
  onClose,
  records,
  onAddSampleData,
  onClearList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttendance, setFilterAttendance] = useState<'all' | 'yes' | 'no'>('all');

  if (!isOpen) return null;

  const totals = calculateTotals(records);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      (r.songRequest && r.songRequest.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAttendance =
      filterAttendance === 'all' ? true : r.attendance === filterAttendance;

    return matchesSearch && matchesAttendance;
  });

  const handleDownloadCsv = () => {
    sounds.playPop();
    const csvContent = generateCsvExport(records);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `convidados_camila_23_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-white to-[#fff0f6] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-pink-400 text-slate-800 my-6 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center justify-center shadow transition-transform active:scale-95"
          aria-label="Fechar painel de convidados"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2
              className="text-xl sm:text-2xl font-black text-[#990044] uppercase tracking-wide"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Lista de Convidados • Painel da Camila
            </h2>
          </div>
          <p className="text-xs text-pink-900 mt-0.5">
            Gerencie todas as confirmações de presença recebidas pelo site e pelo e-mail <strong>{CAMILA_EVENT.recipientEmail}</strong>.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="bg-pink-100/90 border border-pink-300 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-pink-800 uppercase tracking-wider block">
              Confirmados
            </span>
            <span className="text-2xl font-black text-pink-900 leading-none">
              {totals.confirmedCount}
            </span>
          </div>

          <div className="bg-rose-100/90 border border-rose-300 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              Acompanhantes
            </span>
            <span className="text-2xl font-black text-rose-900 leading-none">
              +{totals.totalCompanions}
            </span>
          </div>

          <div className="bg-fuchsia-100/90 border border-fuchsia-300 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-fuchsia-800 uppercase tracking-wider block">
              Total Pessoas
            </span>
            <span className="text-2xl font-black text-fuchsia-900 leading-none">
              {totals.totalConfirmedGuests}
            </span>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
              Não Vão
            </span>
            <span className="text-2xl font-black text-gray-800 leading-none">
              {totals.declinedCount}
            </span>
          </div>
        </div>

        {/* Drinks preference quick badge bar */}
        {Object.keys(totals.drinksBreakdown).length > 0 && (
          <div className="bg-white/80 border border-pink-200 rounded-xl p-2.5 mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-pink-950">Bebidas que vão levar (BYOB):</span>
            {Object.entries(totals.drinksBreakdown).map(([drink, count]) => (
              <span
                key={drink}
                className="px-2.5 py-1 bg-pink-100 text-pink-900 rounded-full font-semibold border border-pink-200"
              >
                {drink}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        )}

        {/* Toolbar: Search, Filters, CSV export */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center mb-3">
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou música..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />

            <select
              value={filterAttendance}
              onChange={(e) => setFilterAttendance(e.target.value as 'all' | 'yes' | 'no')}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-pink-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            >
              <option value="all">Todos ({records.length})</option>
              <option value="yes">Confirmados ({totals.confirmedCount})</option>
              <option value="no">Não Vão ({totals.declinedCount})</option>
            </select>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={handleDownloadCsv}
              disabled={records.length === 0}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1 transition-transform active:scale-95"
            >
              <span>📥</span>
              <span>Exportar Excel / CSV</span>
            </button>

            {records.length === 0 && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onAddSampleData();
                }}
                className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
              >
                + Dados Teste
              </button>
            )}

            {records.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar as confirmações salvas?')) {
                    sounds.playPop();
                    onClearList();
                  }
                }}
                className="px-2 py-1.5 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                title="Limpar lista"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Table of Guests */}
        <div className="flex-1 overflow-y-auto border border-pink-200 rounded-2xl bg-white shadow-inner">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 px-4 text-gray-500 text-xs sm:text-sm">
              <span className="text-3xl block mb-2">💌</span>
              {records.length === 0
                ? 'Nenhuma confirmação registrada ainda. Os convidados que preencherem o formulário aparecerão aqui!'
                : 'Nenhum convidado encontrado para o filtro digitado.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-pink-100/90 text-pink-950 font-bold sticky top-0 border-b border-pink-300">
                <tr>
                  <th className="py-2.5 px-3">Nome</th>
                  <th className="py-2.5 px-3">WhatsApp</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Acomp.</th>
                  <th className="py-2.5 px-3">Bebida</th>
                  <th className="py-2.5 px-3">Música Pedida</th>
                  <th className="py-2.5 px-3">Recado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-pink-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-gray-900">{r.fullName}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-700">
                      <a
                        href={`https://wa.me/${r.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <span>{r.phone}</span>
                      </a>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.attendance === 'yes'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {r.attendance === 'yes' ? 'Confirmado' : 'Não vai'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {r.companionsCount > 0 ? (
                        <span title={r.companionsList ? r.companionsList.join(', ') : ''}>
                          +{r.companionsCount}{' '}
                          <span className="text-gray-400">
                            ({r.companionsList ? r.companionsList.filter(Boolean).join(', ') : ''})
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-800">{r.drinkPreference || '-'}</td>
                    <td className="py-2.5 px-3 text-pink-700 italic font-medium">
                      {r.songRequest ? `🎵 ${r.songRequest}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 max-w-xs truncate" title={r.messageToCamila}>
                      {r.messageToCamila || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
