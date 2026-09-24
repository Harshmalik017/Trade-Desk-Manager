import { AdminLogin } from '@/components/AdminLogin';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AdminLogin nextPath={next} />;
}
