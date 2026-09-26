import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="clay rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/90">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          BillClear Desk uses this demo website to present service workflows and admin mock screens. This policy
          explains what information is shown and how demo data is handled.
        </p>
      </section>

      <Card className="clay space-y-4">
        <div>
          <h2 className="text-lg font-semibold">1. Information on this website</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Public pages contain service descriptions, pricing illustrations, and contact details. Admin pages contain
            demo data only and are not connected to production systems.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">2. Demo credentials and mock records</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The admin login is for mock presentation only. Client names, bill details, and logs are sample records for
            UI demonstration.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">3. Contact submissions</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            If you share details over email or phone, they are used only for consultation follow-up and service
            discussions.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">4. Updates</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This policy can be updated as product workflows evolve from mock UI to production systems.
          </p>
        </div>
      </Card>
    </div>
  );
}
