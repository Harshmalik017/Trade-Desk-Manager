import { ClientDetail } from '@/components/ClientDetail';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProtectedRoute>
      <ClientDetail id={id} />
    </ProtectedRoute>
  );
}
