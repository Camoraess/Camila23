import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRSVPForm,
  calculateTotals,
  formatWhatsAppMessage,
  generateCsvExport,
  generateGoogleCalendarUrl,
} from './rsvp.ts';
import type { RSVPRecord } from './rsvp.ts';

test('validateRSVPForm validates full name, phone and attendance correctly', () => {
  const invalid = validateRSVPForm({});
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.attendance);

  const valid = validateRSVPForm({
    fullName: 'Ana Clara',
    phone: '11999998888',
    attendance: 'yes',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('calculateTotals computes confirmed, declined and companions accurately', () => {
  const mockRecords: RSVPRecord[] = [
    {
      id: '1',
      fullName: 'Lucas Silva',
      phone: '11988887777',
      attendance: 'yes',
      companionsCount: 2,
      companionsList: ['Mariana', 'Pedro'],
      drinkPreference: 'Cerveja',
      dietaryRestrictions: '',
      songRequest: 'Asereje',
      messageToCamila: 'Parabéns!',
      submittedAt: '2026-10-16T12:00:00Z',
      sentToEmail: true,
    },
    {
      id: '2',
      fullName: 'Beatriz Costa',
      phone: '11977776666',
      attendance: 'yes',
      companionsCount: 0,
      companionsList: [],
      drinkPreference: 'Drinks',
      dietaryRestrictions: 'Vegetariana',
      songRequest: 'Toxic - Britney Spears',
      messageToCamila: 'Te amo!',
      submittedAt: '2026-10-16T13:00:00Z',
      sentToEmail: true,
    },
    {
      id: '3',
      fullName: 'Gabriel Santos',
      phone: '11966665555',
      attendance: 'no',
      companionsCount: 0,
      companionsList: [],
      drinkPreference: '',
      dietaryRestrictions: '',
      songRequest: '',
      messageToCamila: 'Não vou conseguir ir, bom níver!',
      submittedAt: '2026-10-16T14:00:00Z',
      sentToEmail: true,
    },
  ];

  const totals = calculateTotals(mockRecords);
  assert.equal(totals.totalResponses, 3);
  assert.equal(totals.confirmedCount, 2);
  assert.equal(totals.declinedCount, 1);
  assert.equal(totals.totalCompanions, 2);
  assert.equal(totals.totalConfirmedGuests, 4); // 2 confirmed + 2 companions
  assert.equal(totals.drinksBreakdown['Cerveja'], 1);
  assert.equal(totals.drinksBreakdown['Drinks'], 1);
});

test('formatWhatsAppMessage formats text with presence details and emoji', () => {
  const msg = formatWhatsAppMessage({
    fullName: 'Julia Mendes',
    phone: '11999990000',
    attendance: 'yes',
    companionsCount: 1,
    companionsList: ['Marcos'],
    drinkPreference: 'Gin Tropical',
    dietaryRestrictions: 'Sem lactose',
    songRequest: 'Dua Lipa - Levitating',
    messageToCamila: 'Muito animada!',
  });

  assert.ok(msg.includes('CONFIRMAÇÃO DE PRESENÇA - CAMILA 23'));
  assert.ok(msg.includes('Julia Mendes'));
  assert.ok(msg.includes('Gin Tropical'));
  assert.ok(msg.includes('Marcos'));
  assert.ok(msg.includes('Smiley Home Resort'));
});

test('generateGoogleCalendarUrl builds valid link', () => {
  const url = generateGoogleCalendarUrl();
  assert.ok(url.startsWith('https://calendar.google.com/calendar/render'));
  assert.ok(url.includes('Smiley+Home+Resort') || url.includes('Smiley%20Home%20Resort'));
});

test('generateCsvExport produces valid CSV rows', () => {
  const csv = generateCsvExport([
    {
      id: '1',
      fullName: 'Camila Teste',
      phone: '11999999999',
      attendance: 'yes',
      companionsCount: 1,
      companionsList: ['Amigo'],
      drinkPreference: 'Cerveja',
      dietaryRestrictions: 'Nenhuma',
      songRequest: 'Lady Marmalade',
      messageToCamila: 'Parabéns!',
      submittedAt: '2026-10-16',
      sentToEmail: true,
    },
  ]);

  assert.ok(csv.includes('"Camila Teste"'));
  assert.ok(csv.includes('"Sim"'));
  assert.ok(csv.includes('"Lady Marmalade"'));
});
