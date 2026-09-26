import { Inbox } from 'lucide-react';
import { Card } from './ui/card';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="clay p-8 text-center">
      <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
        <Inbox size={18} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </Card>
  );
}
