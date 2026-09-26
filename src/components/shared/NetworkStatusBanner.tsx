'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatusBanner() {
  const [online, setOnline] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    setReady(true);
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  if (!ready || online) {
    return null;
  }

  return (
    <div className="sticky top-[68px] z-10 border-b border-rose-200 bg-rose-600 px-4 py-2 text-center text-xs font-semibold text-white sm:px-6 lg:px-8">
      <span className="inline-flex items-center gap-2">
        <WifiOff size={14} />
        You are offline. Some actions are temporarily unavailable.
        <Wifi size={14} className="opacity-70" />
      </span>
    </div>
  );
}
