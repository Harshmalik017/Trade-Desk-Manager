import type { Bill, BillStatus, Client, Lane } from './types';

/** Fictional demo data. Never put real client data here. */
export const seedClients: Client[] = [
  { id: 'c1', name: 'Sharma Textiles Pvt Ltd', contact: 'Rakesh Sharma', city: 'Panipat', bank: 'HDFC Bank', plan: 'Retainer · 40 bills', feeInr: 20999 },
  { id: 'c2', name: 'Kapoor Auto Components', contact: 'Neha Kapoor', city: 'Faridabad', bank: 'HDFC + ICICI', plan: 'Premium', feeInr: 18999 },
  { id: 'c3', name: 'Greenleaf Agro Exports', contact: 'Imran Qureshi', city: 'Karnal', bank: 'HDFC Bank', plan: 'Standard', feeInr: 9999 },
  { id: 'c4', name: 'Mehra Electronics Trading', contact: 'Sanjay Mehra', city: 'Delhi', bank: 'HDFC Bank', plan: 'Basic', feeInr: 4999 },
  { id: 'c5', name: 'Aarav Handicrafts LLP', contact: 'Pooja Verma', city: 'Jaipur', bank: 'Axis Bank', plan: 'Retainer · 15 bills', feeInr: 10999 },
];

type Row = [
  clientId: string, lane: Lane, ref: string, date: string, party: string,
  ccy: string, amount: number, dueDate: string, status: BillStatus, docs: string,
];

const rows: Row[] = [
  ['c1', 'EX', 'SB 6821304', '2026-03-14', 'Nordic Home AB', 'EUR', 48200, '2026-09-10', 'DOCS_PENDING', '11101'],
  ['c1', 'EX', 'SB 6829911', '2026-04-02', 'Bellini SRL', 'EUR', 31750, '2026-09-29', 'UNDER_REVIEW', '11111'],
  ['c1', 'EX', 'SB 6844120', '2026-05-19', 'Urban Loom UK', 'GBP', 22900, '2026-11-15', 'WITH_BANK', '11111'],
  ['c1', 'IM', 'BoE 8812045', '2026-06-03', 'Shanghai Fibre Co', 'USD', 64000, '2026-09-01', 'DOCS_PENDING', '11010'],
  ['c2', 'EX', 'SB 7010288', '2026-02-11', 'Delta Auto GmbH', 'EUR', 90400, '2026-08-20', 'DOCS_PENDING', '11000'],
  ['c2', 'IM', 'BoE 8790122', '2026-05-27', 'Hitech Dies Korea', 'USD', 38500, '2026-09-20', 'UNDER_REVIEW', '11110'],
  ['c2', 'IM', 'BoE 8801377', '2026-06-15', 'Tokyo Precision', 'JPY', 5200000, '2026-10-12', 'WITH_BANK', '11111'],
  ['c3', 'EX', 'SB 7120456', '2026-04-21', 'Gulf Grain FZE', 'USD', 72000, '2026-10-02', 'UNDER_REVIEW', '11101'],
  ['c3', 'EX', 'SB 7133998', '2026-05-30', 'Al Noor Trading', 'USD', 41300, '2026-09-18', 'WITH_BANK', '11111'],
  ['c4', 'IM', 'BoE 8755600', '2026-04-08', 'Shenzhen Tech Ltd', 'USD', 27800, '2026-09-05', 'DOCS_PENDING', '10100'],
  ['c4', 'IM', 'BoE 8770313', '2026-05-02', 'Hong Kong Chips', 'USD', 19600, '2026-10-25', 'CLOSED', '11111'],
  ['c5', 'EX', 'SB 7201045', '2026-06-11', 'Craft House USA', 'USD', 15400, '2026-10-09', 'UNDER_REVIEW', '11110'],
  ['c5', 'EX', 'SB 7188802', '2026-03-27', 'Maison Deco FR', 'EUR', 12300, '2026-09-22', 'CLOSED', '11111'],
];

export const seedBills: Bill[] = rows.map((r, i) => ({
  id: `b${i + 1}`,
  clientId: r[0],
  lane: r[1],
  ref: r[2],
  date: r[3],
  party: r[4],
  ccy: r[5],
  amount: r[6],
  dueDate: r[7],
  status: r[8],
  docs: r[9].split('').map((c) => c === '1'),
}));
