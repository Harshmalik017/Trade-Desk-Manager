'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { seedBills, seedClients } from '@/lib/mock-data';
import type { Bill, BillStatus, Client } from '@/lib/types';

interface DeskValue {
  clients: Client[];
  bills: Bill[];
  clientById: (id: string) => Client | undefined;
  setStatus: (billId: string, status: BillStatus) => void;
  toggleDoc: (billId: string, index: number, present: boolean) => void;
}

const DeskContext = createContext<DeskValue | null>(null);

/**
 * Phase 1: in-memory state seeded from mock data.
 * Phase 2: replace this provider's internals with API-backed data access.
 */
export function DeskProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(seedBills);
  const clients = seedClients;

  const setStatus = useCallback((billId: string, status: BillStatus) => {
    setBills((prev) => prev.map((b) => (b.id === billId ? { ...b, status } : b)));
  }, []);

  const toggleDoc = useCallback((billId: string, index: number, present: boolean) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId ? { ...b, docs: b.docs.map((d, i) => (i === index ? present : d)) } : b,
      ),
    );
  }, []);

  const value = useMemo<DeskValue>(
    () => ({
      clients,
      bills,
      clientById: (id) => clients.find((c) => c.id === id),
      setStatus,
      toggleDoc,
    }),
    [clients, bills, setStatus, toggleDoc],
  );

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk(): DeskValue {
  const ctx = useContext(DeskContext);
  if (!ctx) throw new Error('useDesk must be used inside <DeskProvider>');
  return ctx;
}
