export interface ServicePackage {
  key: 'BASIC' | 'STANDARD' | 'PREMIUM';
  name: string;
  priceInr: number;
  priceLabel: string;
  scope: string;
  maxBills: number;
  features: string[];
}

export interface Retainer {
  priceInr: number;
  maxBills: number;
}

export const PACKAGES: ServicePackage[] = [
  {
    key: 'BASIC',
    name: 'Basic',
    priceInr: 4999,
    priceLabel: '₹4,999',
    scope: 'Up to 5 bills',
    maxBills: 5,
    features: [
      'Pending bills review',
      'Document verification',
      'Basic bill-wise reconciliation',
      'Discrepancy identification',
      'Bank coordination and follow-up',
      'Status updates',
    ],
  },
  {
    key: 'STANDARD',
    name: 'Standard',
    priceInr: 9999,
    priceLabel: '₹9,999',
    scope: '6 to 20 bills',
    maxBills: 20,
    features: [
      'Everything in Basic',
      'Detailed bill-wise reconciliation',
      'Invoice and shipping documents review',
      'Documentation gap identification',
      'Outstanding items tracking',
      'Multiple follow-ups, regular reports',
    ],
  },
  {
    key: 'PREMIUM',
    name: 'Premium',
    priceInr: 18999,
    priceLabel: '₹18,999 onwards',
    scope: '20+ bills or complex cases',
    maxBills: Infinity,
    features: [
      'Everything in Standard',
      'Old pending bills review',
      'Complex case handling',
      'Multiple-bank coordination',
      'Documentation assistance',
      'Repeated follow-ups, case-wise reports',
    ],
  },
];

export const RETAINERS: Retainer[] = [
  { priceInr: 10999, maxBills: 15 },
  { priceInr: 20999, maxBills: 40 },
  { priceInr: 30999, maxBills: 75 },
];

export const recommendPackage = (bills: number): ServicePackage =>
  PACKAGES.find((p) => bills <= p.maxBills) ?? PACKAGES[PACKAGES.length - 1];

/** Returns undefined above 75 bills (custom quote). */
export const recommendRetainer = (bills: number): Retainer | undefined =>
  RETAINERS.find((r) => bills <= r.maxBills);
