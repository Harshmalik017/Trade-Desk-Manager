import { AdminLogin } from '@/components/admin/auth/AdminLogin';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="admin-auth-layer">
      <AdminLogin nextPath={next} />
    </div>
  );
}