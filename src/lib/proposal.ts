import { DISCLAIMER } from './constants';
import { recommendPackage } from './packages';
import type { Bill, Client } from './types';
import { daysOverdue, formatINR, isOpen } from './utils';

/** Builds a client-facing proposal from that client's live bill data. */
export function buildProposal(client: Client, clientBills: Bill[]): string {
  const open = clientBills.filter(isOpen);
  const exports = open.filter((b) => b.lane === 'EX').length;
  const imports = open.length - exports;
  const overdue = open.filter((b) => daysOverdue(b) > 0).length;
  const pkg = recommendPackage(open.length);

  const plural = (n: number) => (n === 1 ? '' : 's');
  const overdueLine = overdue
    ? `, and ${overdue} of them ${overdue === 1 ? 'is' : 'are'} past the due date`
    : '';

  return [
    `Dear ${client.contact},`,
    '',
    `We reviewed your EDPMS/IDPMS position with ${client.bank}. You currently have ${exports} open export bill${plural(exports)} (EDPMS) and ${imports} open import bill${plural(imports)} (IDPMS)${overdueLine}.`,
    '',
    `We recommend the ${pkg.name} package at ${formatINR(pkg.priceInr)}${pkg.key === 'PREMIUM' ? ' onwards' : ''}: bill-wise reconciliation, document gap review, and bank follow-up until each bill is regularised. For regular monthly upkeep, our retainer starts at ₹10,999 for up to 15 bills.`,
    '',
    `Note: ${DISCLAIMER}`,
    '',
    'Regards,',
    'BillClear Desk',
  ].join('\n');
}
