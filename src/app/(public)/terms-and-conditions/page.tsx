import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="clay rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/90">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          These terms govern use of the BillClear Desk demo website and admin mock panel.
        </p>
      </section>

      <Card className="clay space-y-4">
        <div>
          <h2 className="text-lg font-semibold">1. Demo-only environment</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The portal currently demonstrates Phase 1 UI workflows. It does not represent a production transaction
            system and should not be used for real financial records.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">2. Content usage</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Website copy, visuals, and process flows are for service communication and internal preview purposes.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">3. Responsibility</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Users are responsible for validating advice and process decisions before acting on any trade compliance
            workflow in real environments.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">4. Changes to terms</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Terms may be revised as feature scope expands beyond mock UI functionality.
          </p>
        </div>
      </Card>
    </div>
  );
}
