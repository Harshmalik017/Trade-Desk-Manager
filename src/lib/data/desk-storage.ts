import type { ActivityLog, ArchiveRecord, Bill, Client, CompanyProfile } from '@/lib/types';
import { seedArchive, seedBills, seedClients, seedCompanyProfile, seedLogs } from '@/lib/data/mock-data';

const STORAGE_KEY = 'billclear_desk_state_v1';

export interface DeskState {
  clients: Client[];
  bills: Bill[];
  logs: ActivityLog[];
  archive: ArchiveRecord[];
  profile: CompanyProfile;
}

export function seedState(): DeskState {
  return {
    clients: seedClients.map((c) => ({ ...c })),
    bills: seedBills.map((b) => ({ ...b, docs: [...b.docs] })),
    logs: seedLogs.map((l) => ({ ...l })),
    archive: seedArchive.map((a) => ({ ...a })),
    profile: { ...seedCompanyProfile },
  };
}

/**
 * Phase 1 persistence: the whole mock desk lives in localStorage so demos
 * survive a refresh. Phase 2 replaces these helpers with API calls.
 */
export function loadState(): DeskState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeskState>;
    if (
      !Array.isArray(parsed.clients) ||
      !Array.isArray(parsed.bills) ||
      !Array.isArray(parsed.logs) ||
      !Array.isArray(parsed.archive) ||
      !parsed.profile
    ) {
      return null;
    }
    return {
      clients: parsed.clients,
      bills: parsed.bills,
      logs: parsed.logs,
      archive: parsed.archive,
      profile: parsed.profile,
    };
  } catch {
    return null;
  }
}

export function saveState(state: DeskState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — the in-memory state stays authoritative.
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
