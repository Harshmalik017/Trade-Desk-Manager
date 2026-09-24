import type { BillStatus, Lane } from './types';

/**
 * Fixed "today" so demos are repeatable.
 * Replace with `new Date()` when real data is connected (Phase 2).
 */
export const DEMO_TODAY = new Date('2026-09-25');

export const STATUS_ORDER: BillStatus[] = ['DOCS_PENDING', 'UNDER_REVIEW', 'WITH_BANK', 'CLOSED'];

export const STATUS_LABEL: Record<BillStatus, string> = {
  DOCS_PENDING: 'Docs pending',
  UNDER_REVIEW: 'Under review',
  WITH_BANK: 'With bank',
  CLOSED: 'Closed',
};

export const LANE_LABEL: Record<Lane, string> = {
  EX: 'Export · EDPMS',
  IM: 'Import · IDPMS',
};

export const LANE_HINT: Record<Lane, string> = {
  EX: 'Realisation of export proceeds against each shipping bill',
  IM: 'Import remittance matched against each Bill of Entry',
};

export const LANE_SLUG: Record<Lane, 'export' | 'import'> = { EX: 'export', IM: 'import' };

export const DOC_CHECKLISTS: Record<Lane, string[]> = {
  EX: [
    'Commercial invoice',
    'Packing list',
    'Shipping bill + EGM status',
    'Bank realisation advice / FIRC',
    'e-BRC / BRC',
  ],
  IM: [
    'Commercial invoice',
    'Bill of Entry',
    'Bill of Lading / AWB',
    'SWIFT / remittance advice',
    'Form A1 / LC documents',
  ],
};

export const DISCLAIMER =
  'Final regularization is subject to verification and processing by the concerned AD Bank/authority.';
