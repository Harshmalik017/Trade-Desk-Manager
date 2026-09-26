import { WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function NoNetworkState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="clay border-rose-200/70 bg-rose-50/70 p-5 dark:border-rose-900/60 dark:bg-rose-950/40">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
          <WifiOff size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">{title}</h3>
          <p className="mt-1 text-sm text-rose-800/90 dark:text-rose-200/90">{message}</p>
        </div>
      </div>
    </Card>
  );
}
