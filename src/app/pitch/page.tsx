import { PitchBuilder } from '@/components/PitchBuilder';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <PitchBuilder />
    </ProtectedRoute>
  );
}
