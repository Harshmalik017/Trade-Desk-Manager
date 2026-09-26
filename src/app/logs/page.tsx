import { LogsPage } from '@/components/LogsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <LogsPage />
    </ProtectedRoute>
  );
}
