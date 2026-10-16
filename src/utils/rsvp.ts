export interface Companion {
  id: string;
  name: string;
}

export interface RSVPFormData {
  fullName: string;
  phone: string;
  attendance: 'yes' | 'no';
  companionsCount: number;
  companionsList: string[];
  drinkPreference: string;
  dietaryRestrictions?: string;
  songRequest: string;
  messageToCamila: string;
}

export interface RSVPRecord extends RSVPFormData {
  id: string;
  submittedAt: string;
  sentToEmail: boolean;
}

export interface EventDetails {
  title: string;
  hostName: string;
  age: number;
  dateStr: string; // e.g. "24 de Outubro"
  timeStr: string; // e.g. "17:00"
  targetDateIso: string; // e.g. "2026-10-24T17:00:00"
  locationName: string;
  locationSub: string;
  fullAddress: string;
  recipientEmail: string;
}

export const CAMILA_EVENT: EventDetails = {
  title: 'Camila 23 | Aniversário Y2K no Smiley Home Resort',
  hostName: 'Camila',
  age: 23,
  dateStr: '24 de Outubro',
  timeStr: '17:00',
  targetDateIso: '2026-10-24T17:00:00',
  locationName: 'Smiley Home Resort',
  locationSub: 'Churrasqueira Quadra',
  fullAddress: 'Condomínio Smiley Home Resort - Espaço da Quadra / Churrasqueira',
  recipientEmail: '2003casm@gmail.com',
};

export function validateRSVPForm(data: Partial<RSVPFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Por favor, informe seu nome completo.';
  }

  if (!data.phone || data.phone.trim().replace(/\D/g, '').length < 8) {
    errors.phone = 'Informe um WhatsApp/telefone válido com DDD.';
  }

  if (!data.attendance) {
    errors.attendance = 'Selecione se você vai comparecer ou não.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateTotals(records: RSVPRecord[]) {
  const confirmed = records.filter((r) => r.attendance === 'yes');
  const declined = records.filter((r) => r.attendance === 'no');

  const totalCompanions = confirmed.reduce(
    (sum, r) => sum + (Number(r.companionsCount) || 0),
    0
  );

  const totalConfirmedGuests = confirmed.length + totalCompanions;

  const drinksBreakdown: Record<string, number> = {};
  for (const r of confirmed) {
    const drink = r.drinkPreference || 'Não informado';
    drinksBreakdown[drink] = (drinksBreakdown[drink] || 0) + 1;
  }

  return {
    totalResponses: records.length,
    confirmedCount: confirmed.length,
    declinedCount: declined.length,
    totalCompanions,
    totalConfirmedGuests,
    drinksBreakdown,
  };
}

export function formatWhatsAppMessage(data: RSVPFormData): string {
  const attendanceEmoji = data.attendance === 'yes' ? '🎉 SIM, COM CERTEZA!' : '💔 INFELIZMENTE NÃO';
  let msg = `✨ *CONFIRMAÇÃO DE PRESENÇA - CAMILA 23* ✨\n\n`;
  msg += `👤 *Nome:* ${data.fullName}\n`;
  msg += `📱 *Telefone/WhatsApp:* ${data.phone}\n`;
  msg += `💖 *Presença:* ${attendanceEmoji}\n`;

  if (data.attendance === 'yes') {
    if (data.companionsCount > 0) {
      msg += `👥 *Acompanhantes (${data.companionsCount}):* ${
        data.companionsList.filter(Boolean).join(', ') || `${data.companionsCount} acompanhante(s)`
      }\n`;
    } else {
      msg += `👥 *Acompanhantes:* Nenhum (vou sozinho(a))\n`;
    }

    if (data.songRequest) {
      msg += `🎵 *Música que quero ouvir:* ${data.songRequest}\n`;
    }

    if (data.drinkPreference) {
      msg += `🧊 *Bebida que vou levar:* ${data.drinkPreference}\n`;
    }
  }

  if (data.messageToCamila) {
    msg += `💌 *Mensagem para a Camila:* "${data.messageToCamila}"\n`;
  }

  msg += `\n📍 Local: Smiley Home Resort (Churrasqueira Quadra)\n📅 24 de Outubro às 17h\n👗 Look: Y2K / Anos 2000 ✨\n🍾 *Lembrete:* Levar a própria bebida! (Cooler liberado)`;
  return msg;
}

export function generateWhatsAppLink(cleanPhone: string, data: RSVPFormData): string {
  const text = encodeURIComponent(formatWhatsAppMessage(data));
  const base = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
  return base;
}

export function generateGoogleCalendarUrl(): string {
  const title = encodeURIComponent('Camila 23 | Festa Y2K Anos 2000 🎉');
  const details = encodeURIComponent(
    'Comemoração dos 23 anos da Camila!\nLocal: Smiley Home Resort (Churrasqueira Quadra).\nHorário: 17:00.\n👗 Look: Y2K / Anos 2000 ✨\n🍾 Bebidas: Leve sua própria bebida (Cooler liberado!).'
  );
  const location = encodeURIComponent('Smiley Home Resort (Churrasqueira Quadra)');
  // Format: YYYYMMDDTHHmmssZ
  // Let's use 20261024T200000Z (which corresponds to 17h BRT UTC-3)
  const start = '20261024T200000Z';
  const end = '20261025T020000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function generateICalContent(): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Camila 23//RSVP Party//PT',
    'BEGIN:VEVENT',
    'UID:camila23-bday-20261024@smileyhomeresort',
    'DTSTAMP:20261016T000000Z',
    'DTSTART:20261024T200000Z',
    'DTEND:20261025T020000Z',
    'SUMMARY:Camila 23 | Festa Y2K Anos 2000 🎉',
    'DESCRIPTION:Comemoração dos 23 anos da Camila no Smiley Home Resort (Churrasqueira Quadra). Look Y2K Anos 2000! Traga sua própria bebida (cooler liberado).',
    'LOCATION:Smiley Home Resort (Churrasqueira Quadra)',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function generateCsvExport(records: RSVPRecord[]): string {
  const headers = [
    'ID',
    'Data de Envio',
    'Nome Completo',
    'Telefone',
    'Presença',
    'Qtd Acompanhantes',
    'Lista Acompanhantes',
    'Bebida',
    'Restrição Alimentar',
    'Música Pedida',
    'Mensagem',
  ];

  const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

  const rows = records.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.submittedAt),
    escapeCsv(r.fullName),
    escapeCsv(r.phone),
    escapeCsv(r.attendance === 'yes' ? 'Sim' : 'Não'),
    escapeCsv(String(r.companionsCount || 0)),
    escapeCsv(r.companionsList ? r.companionsList.join(', ') : ''),
    escapeCsv(r.drinkPreference || ''),
    escapeCsv(r.dietaryRestrictions || ''),
    escapeCsv(r.songRequest || ''),
    escapeCsv(r.messageToCamila || ''),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
