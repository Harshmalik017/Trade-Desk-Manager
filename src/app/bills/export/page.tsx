import { BillTracker } from '@/components/BillTracker';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <BillTracker lane="EX" />
    </ProtectedRoute>
  );
}
