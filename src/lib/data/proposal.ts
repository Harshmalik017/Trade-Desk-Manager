import { DISCLAIMER } from '@/lib/constants';
import { recommendPackage } from '@/lib/data/packages';
import type { Bill, Client } from '@/lib/types';
import { daysOverdue, formatINR, isOpen } from '@/lib/utils/utils';

export interface ProposalOptions {
  channel?: 'WHATSAPP' | 'EMAIL';
  urgency?: 'STANDARD' | 'PRIORITY';
  includeTimeline?: boolean;
}

/** Builds a client-facing proposal from that client's live bill data. */
export function buildProposal(client: Client, clientBills: Bill[], options: ProposalOptions = {}): string {
  const open = clientBills.filter(isOpen);
  const exports = open.filter((b) => b.lane === 'EX').length;
  const imports = open.length - exports;
  const overdue = open.filter((b) => daysOverdue(b) > 0).length;
  const pkg = recommendPackage(open.length);
  const channel = options.channel ?? 'WHATSAPP';
  const urgency = options.urgency ?? 'STANDARD';
  const includeTimeline = options.includeTimeline ?? true;

  const plural = (n: number) => (n === 1 ? '' : 's');
  const overdueLine = overdue
    ? `, and ${overdue} of them ${overdue === 1 ? 'is' : 'are'} past the due date`
    : '';
  const opener = channel === 'EMAIL' ? `Dear ${client.contact},` : `Hi ${client.contact},`;
  const urgencyLine =
    urgency === 'PRIORITY'
      ? 'Given current due-date pressure, we suggest starting with a priority batch and daily follow-up.'
      : 'We suggest starting with a structured batch so your team gets predictable closure progress every week.';
  const timelineLine = includeTimeline
    ? 'Typical onboarding timeline: day 1 data intake, day 2-3 discrepancy mapping, day 4 onward bank follow-ups till closure.'
    : '';
  const signoff = channel === 'EMAIL' ? 'Regards,' : 'Thanks,';

  return [
    opener,
    '',
    `We reviewed your EDPMS/IDPMS position with ${client.bank}. You currently have ${exports} open export bill${plural(exports)} (EDPMS) and ${imports} open import bill${plural(imports)} (IDPMS)${overdueLine}.`,
    '',
    `We recommend the ${pkg.name} package at ${formatINR(pkg.priceInr)}${pkg.key === 'PREMIUM' ? ' onwards' : ''}: bill-wise reconciliation, document gap review, and bank follow-up until each bill is regularised. For regular monthly upkeep, our retainer starts at ₹10,999 for up to 15 bills.`,
    '',
    urgencyLine,
    timelineLine,
    '',
    `Note: ${DISCLAIMER}`,
    '',
    signoff,
    'BillClear Desk',
  ]
    .filter(Boolean)
    .join('\n');
}
