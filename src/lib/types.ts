/** Export (EDPMS) or Import (IDPMS). The two lanes are always kept separate. */
export type Lane = 'EX' | 'IM';

export type BillStatus = 'DOCS_PENDING' | 'UNDER_REVIEW' | 'WITH_BANK' | 'CLOSED';

export interface Client {
  id: string;
  name: string;
  contact: string;
  city: string;
  bank: string;
  plan: string;
  /** Monthly fee billed to this client, in INR. */
  feeInr: number;
}

export interface Bill {
  id: string;
  clientId: string;
  lane: Lane;
  /** Shipping Bill no. (export) or Bill of Entry no. (import). */
  ref: string;
  /** ISO date of the bill. */
  date: string;
  /** Buyer (export) or supplier (import). */
  party: string;
  ccy: string;
  amount: number;
  /** Realise-by date (export) or remit-by date (import), ISO. */
  dueDate: string;
  status: BillStatus;
  /** Aligned to DOC_CHECKLISTS[lane]. */
  docs: boolean[];
}
