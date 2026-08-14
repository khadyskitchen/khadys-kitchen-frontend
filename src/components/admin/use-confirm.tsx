"use client";

import { useState, type ReactNode } from "react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

interface ConfirmOptions {
  title: string;
  description: ReactNode;
  confirmText?: string;
  isDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

/**
 * One confirmation dialog per page, opened imperatively. Every admin action
 * routes through `confirm({...})`; render `dialog` once. Keeps each page from
 * juggling a separate dialog + pending-state per action.
 */
export function useConfirm() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [pending, setPending] = useState(false);

  const confirm = (options: ConfirmOptions) => setOpts(options);

  const dialog = (
    <ConfirmationDialog
      open={opts !== null}
      onOpenChange={(open) => {
        if (!open && !pending) setOpts(null);
      }}
      title={opts?.title ?? ""}
      description={opts?.description ?? ""}
      confirmText={opts?.confirmText}
      isDestructive={opts?.isDestructive}
      isLoading={pending}
      closeOnConfirm={false}
      onConfirm={() => {
        // Hold the dialog open with a busy confirm button until the action
        // settles - a slow mutation otherwise gives no feedback. Each action
        // still owns its error toast.
        const run = opts?.onConfirm();
        if (run && typeof (run as Promise<void>).then === "function") {
          setPending(true);
          void (run as Promise<void>).finally(() => {
            setPending(false);
            setOpts(null);
          });
        } else {
          setOpts(null);
        }
      }}
    />
  );

  return { confirm, dialog };
}
