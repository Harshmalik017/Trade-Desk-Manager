import { Eye } from 'lucide-react';
import { Button } from './ui/button';

export function ViewActionButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      size="sm"
      className="bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
      onClick={onClick}
    >
      <Eye size={14} /> View
    </Button>
  );
}
