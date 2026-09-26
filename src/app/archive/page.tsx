import { ArchivePage } from '@/components/ArchivePage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <ArchivePage />
    </ProtectedRoute>
  );
}
