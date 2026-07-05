"use client";

import { Toaster } from "react-hot-toast";

/**
 * Mounts the toast portal once (bottom-right). Toast cards are rendered by
 * `notify.*` via `toast.custom`, so this just handles positioning + stacking.
 */
export function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      gutter={12}
      containerClassName="!inset-4"
      toastOptions={{ duration: 5000 }}
    />
  );
}
