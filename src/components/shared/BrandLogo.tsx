import { ShieldCheck } from 'lucide-react';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white ring-1 ring-white/30">
        <ShieldCheck size={18} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-wide text-white">BillClear Desk</span>
          <span className="block text-[11px] font-medium text-violet-100">Trade Compliance Partner</span>
        </span>
      )}
    </span>
  );
}
