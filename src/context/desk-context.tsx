'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { clearState, loadState, saveState, seedState, type DeskState } from '@/lib/data/desk-storage';
import { useAuth } from '@/context/auth-context';
import { makeId } from '@/lib/utils/id';
import { STATUS_LABEL } from '@/lib/constants';
import type { ActivityLog, ArchiveRecord, Bill, BillStatus, Client, CompanyProfile, Lane } from '@/lib/types';

export type ClientInput = Omit<Client, 'id'>;
export type BillInput = Omit<Bill, 'id'>;

export interface MutationResult {
  ok: boolean;
  error?: string;
}

interface DeskValue extends DeskState {
  clientById: (id: string) => Client | undefined;
  createClient: (input: ClientInput) => MutationResult;
  updateClient: (id: string, patch: Partial<ClientInput>) => MutationResult;
  deleteClient: (id: string) => MutationResult;
  createBill: (input: BillInput) => MutationResult;
  updateBill: (id: string, patch: Partial<BillInput>) => MutationResult;
  deleteBill: (id: string) => MutationResult;
  setStatus: (billId: string, status: BillStatus) => void;
  toggleDoc: (billId: string, index: number, present: boolean) => void;
  restoreArchived: (id: string) => MutationResult;
  deleteArchived: (id: string) => MutationResult;
  updateProfile: (patch: Partial<CompanyProfile>) => void;
  logAction: (action: string, meta?: { lane?: Lane; status?: BillStatus }) => void;
  clearLogs: () => void;
  resetDemoData: () => void;
}

const DeskContext = createContext<DeskValue | null>(null);

/**
 * Phase 1: the complete mock desk — clients, bills, logs, archive and the
 * company profile — held in React state and mirrored to localStorage.
 * Phase 2: replace this provider's internals with API-backed data access; the
 * value shape consumed by components stays the same.
 */
export function DeskProvider({ children }: { children: ReactNode }) {
  const { adminEmail } = useAuth();
  const [state, setState] = useState<DeskState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  // Read stored state after mount so server and client markup match.
  useEffect(() => {
    const stored = loadState();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const actorRef = useRef<string>('admin');
  actorRef.current = adminEmail ?? 'admin';

  const makeLog = useCallback(
    (action: string, meta?: { lane?: Lane; status?: BillStatus }): ActivityLog => ({
      id: makeId('log'),
      actor: actorRef.current,
      action,
      lane: meta?.lane ?? 'EX',
      status: meta?.status ?? 'UNDER_REVIEW',
      timestamp: new Date().toISOString(),
    }),
    [],
  );

  const logAction = useCallback(
    (action: string, meta?: { lane?: Lane; status?: BillStatus }) => {
      setState((prev) => ({ ...prev, logs: [makeLog(action, meta), ...prev.logs] }));
    },
    [makeLog],
  );

  const createClient = useCallback(
    (input: ClientInput): MutationResult => {
      const name = input.name.trim();
      setState((prev) => {
        if (prev.clients.some((c) => c.name.toLowerCase() === name.toLowerCase())) return prev;
        const client: Client = { ...input, name, id: makeId('c') };
        return {
          ...prev,
          clients: [client, ...prev.clients],
          logs: [makeLog(`Created client ${client.name}`), ...prev.logs],
        };
      });
      return { ok: true };
    },
    [makeLog],
  );

  const updateClient = useCallback(
    (id: string, patch: Partial<ClientInput>): MutationResult => {
      setState((prev) => {
        const existing = prev.clients.find((c) => c.id === id);
        if (!existing) return prev;
        const updated = { ...existing, ...patch };
        return {
          ...prev,
          clients: prev.clients.map((c) => (c.id === id ? updated : c)),
          logs: [makeLog(`Updated client ${updated.name}`), ...prev.logs],
        };
      });
      return { ok: true };
    },
    [makeLog],
  );

  const deleteClient = useCallback(
    (id: string): MutationResult => {
      const attached = state.bills.filter((b) => b.clientId === id).length;
      if (attached > 0) {
        return {
          ok: false,
          error: `This client still has ${attached} bill${attached === 1 ? '' : 's'}. Remove or reassign them before deleting.`,
        };
      }
      setState((prev) => {
        const existing = prev.clients.find((c) => c.id === id);
        if (!existing) return prev;
        return {
          ...prev,
          clients: prev.clients.filter((c) => c.id !== id),
          logs: [makeLog(`Deleted client ${existing.name}`), ...prev.logs],
        };
      });
      return { ok: true };
    },
    [makeLog, state.bills],
  );

  const createBill = useCallback(
    (input: BillInput): MutationResult => {
      setState((prev) => {
        const bill: Bill = { ...input, id: makeId('b') };
        const client = prev.clients.find((c) => c.id === bill.clientId);
        return {
          ...prev,
          bills: [bill, ...prev.bills],
          logs: [
            makeLog(`Created bill ${bill.ref} for ${client?.name ?? 'client'}`, {
              lane: bill.lane,
              status: bill.status,
            }),
            ...prev.logs,
          ],
        };
      });
      return { ok: true };
    },
    [makeLog],
  );

  const updateBill = useCallback(
    (id: string, patch: Partial<BillInput>): MutationResult => {
      setState((prev) => {
        const existing = prev.bills.find((b) => b.id === id);
        if (!existing) return prev;
        const updated = { ...existing, ...patch };
        return {
          ...prev,
          bills: prev.bills.map((b) => (b.id === id ? updated : b)),
          logs: [
            makeLog(`Updated bill ${updated.ref}`, { lane: updated.lane, status: updated.status }),
            ...prev.logs,
          ],
        };
      });
      return { ok: true };
    },
    [makeLog],
  );

  const deleteBill = useCallback(
    (id: string): MutationResult => {
      setState((prev) => {
        const existing = prev.bills.find((b) => b.id === id);
        if (!existing) return prev;
        return {
          ...prev,
          bills: prev.bills.filter((b) => b.id !== id),
          logs: [
            makeLog(`Deleted bill ${existing.ref}`, { lane: existing.lane, status: existing.status }),
            ...prev.logs,
          ],
        };
      });
      return { ok: true };
    },
    [makeLog],
  );

  /** Closing a bill moves it out of the active list and into the archive. */
  const setStatus = useCallback(
    (billId: string, status: BillStatus) => {
      setState((prev) => {
        const bill = prev.bills.find((b) => b.id === billId);
        if (!bill) return prev;
        const client = prev.clients.find((c) => c.id === bill.clientId);

        if (status === 'CLOSED') {
          const record: ArchiveRecord = {
            id: makeId('arc'),
            client: client?.name ?? 'Unknown client',
            lane: bill.lane,
            reference: bill.ref,
            closedOn: new Date().toISOString(),
            summary: `${bill.party} · ${bill.ccy} ${bill.amount} closed and regularised.`,
          };
          return {
            ...prev,
            bills: prev.bills.filter((b) => b.id !== billId),
            archive: [record, ...prev.archive],
            logs: [
              makeLog(`Closed and archived bill ${bill.ref}`, { lane: bill.lane, status: 'CLOSED' }),
              ...prev.logs,
            ],
          };
        }

        return {
          ...prev,
          bills: prev.bills.map((b) => (b.id === billId ? { ...b, status } : b)),
          logs: [
            makeLog(`Set ${bill.ref} to ${STATUS_LABEL[status]}`, { lane: bill.lane, status }),
            ...prev.logs,
          ],
        };
      });
    },
    [makeLog],
  );

  const toggleDoc = useCallback((billId: string, index: number, present: boolean) => {
    setState((prev) => ({
      ...prev,
      bills: prev.bills.map((b) =>
        b.id === billId ? { ...b, docs: b.docs.map((d, i) => (i === index ? present : d)) } : b,
      ),
    }));
  }, []);

  const restoreArchived = useCallback(
    (id: string): MutationResult => {
      const record = state.archive.find((a) => a.id === id);
      if (!record) return { ok: false, error: 'Archive record not found.' };

      const client = state.clients.find((c) => c.name === record.client);
      if (!client) {
        return { ok: false, error: `Client "${record.client}" no longer exists, so this case cannot be restored.` };
      }

      setState((prev) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        const bill: Bill = {
          id: makeId('b'),
          clientId: client.id,
          lane: record.lane,
          ref: record.reference,
          date: record.closedOn.slice(0, 10),
          party: record.summary.split(' · ')[0] ?? record.client,
          ccy: 'USD',
          amount: 0,
          dueDate: dueDate.toISOString().slice(0, 10),
          status: 'WITH_BANK',
          docs: [true, true, true, false, false],
        };
        return {
          ...prev,
          bills: [bill, ...prev.bills],
          archive: prev.archive.filter((a) => a.id !== id),
          logs: [
            makeLog(`Restored ${record.reference} from archive`, { lane: record.lane, status: 'WITH_BANK' }),
            ...prev.logs,
          ],
        };
      });
      return { ok: true };
    },
    [makeLog, state.archive, state.clients],
  );

  const deleteArchived = useCallback(
    (id: string): MutationResult => {
      setState((prev) => {
        const record = prev.archive.find((a) => a.id === id);
        if (!record) return prev;
        return {
          ...prev,
          archive: prev.archive.filter((a) => a.id !== id),
          logs: [
            makeLog(`Deleted archive record ${record.reference}`, { lane: record.lane, status: 'CLOSED' }),
            ...prev.logs,
          ],
        };
      });
      return { ok: true };
    },
    [makeLog],
  );

  const updateProfile = useCallback(
    (patch: Partial<CompanyProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
        logs: [makeLog('Updated company profile'), ...prev.logs],
      }));
    },
    [makeLog],
  );

  const clearLogs = useCallback(() => {
    setState((prev) => ({ ...prev, logs: [makeLog('Cleared activity logs')] }));
  }, [makeLog]);

  const resetDemoData = useCallback(() => {
    clearState();
    setState(seedState());
  }, []);

  const value = useMemo<DeskValue>(
    () => ({
      ...state,
      clientById: (id) => state.clients.find((c) => c.id === id),
      createClient,
      updateClient,
      deleteClient,
      createBill,
      updateBill,
      deleteBill,
      setStatus,
      toggleDoc,
      restoreArchived,
      deleteArchived,
      updateProfile,
      logAction,
      clearLogs,
      resetDemoData,
    }),
    [
      state,
      createClient,
      updateClient,
      deleteClient,
      createBill,
      updateBill,
      deleteBill,
      setStatus,
      toggleDoc,
      restoreArchived,
      deleteArchived,
      updateProfile,
      logAction,
      clearLogs,
      resetDemoData,
    ],
  );

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk(): DeskValue {
  const ctx = useContext(DeskContext);
  if (!ctx) throw new Error('useDesk must be used inside <DeskProvider>');
  return ctx;
}
