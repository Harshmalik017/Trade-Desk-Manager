import { DOC_CHECKLISTS } from '@/lib/constants';
import type { Bill } from '@/lib/types';

interface Props {
  bill: Bill;
  onToggle: (index: number, present: boolean) => void;
}

export function DocChecklist({ bill, onToggle }: Props) {
  return (
    <div>
      {DOC_CHECKLISTS[bill.lane].map((doc, i) => (
        <label key={doc} className="check">
          <input type="checkbox" checked={bill.docs[i]} onChange={(e) => onToggle(i, e.target.checked)} />
          {doc}
          {!bill.docs[i] && <span className="tag warn">Missing</span>}
        </label>
      ))}
    </div>
  );
}
