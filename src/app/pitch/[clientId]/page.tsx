import { PitchBuilder } from '@/components/PitchBuilder';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return (
    <ProtectedRoute>
      <PitchBuilder initialClientId={clientId} />
    </ProtectedRoute>
  );
}
