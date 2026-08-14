"use client";

import { ActionMenu } from "@/components/admin/action-menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStatusColor } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

export interface StatusOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  /** Renders in the danger colour (destructive transitions like Reject). */
  danger?: boolean;
}

/**
 * The current status as a StatusBadge-coloured pill with a chevron; opening
 * it reveals the transitions the record can move to. Built on ActionMenu so
 * the portal, viewport flipping and keyboard nav are shared, not duplicated.
 * With no options it degrades to a plain (non-interactive) badge.
 */
export function StatusPicker<T extends string>({
  status,
  label,
  options,
  onSelect,
  className,
}: {
  /** Current status - colours the trigger via the shared status palette. */
  status: string;
  /** Display text for the current status; defaults to the status itself. */
  label?: string;
  options: StatusOption<T>[];
  onSelect: (value: T) => void;
  className?: string;
}) {
  const { bg, color } = getStatusColor(status);

  if (options.length === 0) {
    return <StatusBadge status={status} label={label} className={className} />;
  }

  return (
    <ActionMenu
      className={className}
      items={options.map((o) => ({
        label: o.label,
        disabled: o.disabled,
        variant: o.danger ? ("danger" as const) : ("default" as const),
        onClick: () => onSelect(o.value),
      }))}
      triggerAriaLabel={`Change status (currently ${label ?? status})`}
      triggerClassName="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border-none px-3 py-[5px] text-[11.5px] font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-85"
      triggerStyle={{ background: bg, color }}
      trigger={(open) => (
        <>
          {label ?? status}
          <svg
            viewBox="0 0 24 24"
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </>
      )}
    />
  );
}
