"use client";

import { useEffect, useState } from "react";

/**
 * Dark banner shown while the browser is offline. Mount once near the top of a
 * layout. `forceVisible` is for previews/tests.
 */
export function OfflineBanner({ forceVisible }: { forceVisible?: boolean }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!(forceVisible ?? offline)) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-[14px] bg-ink px-[18px] py-[13px] text-cream"
    >
      <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#D9A441]" aria-hidden="true" />
      <span className="flex-1 text-[13.5px]">
        You&rsquo;re offline — showing saved data. We&rsquo;ll reconnect automatically.
      </span>
    </div>
  );
}
