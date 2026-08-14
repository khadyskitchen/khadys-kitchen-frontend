import { cn } from "@/lib/utils";

/**
 * A pill-shaped single-choice option used across the public forms (checkout
 * payment mode, application hostel/pay choices, contact topic). A real radio
 * to assistive tech: place a set inside a `ChoiceGroup`, which provides the
 * `radiogroup` role and arrow-key movement; the selected pill is the group's
 * Tab stop (roving tabindex).
 */
export function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      onClick={onClick}
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      className={cn(
        "cursor-pointer rounded-full border-[1.5px] px-[22px] py-[11px] font-sans text-[14.5px] font-semibold transition-colors",
        selected
          ? "border-accent bg-accent text-card"
          : "border-ink/25 bg-transparent text-ink hover:border-ink/50",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Radiogroup wrapper for a row of ChoiceButtons: arrow keys move between the
 * options and select as they go (standard radio behavior), wrapping at the
 * ends. Pass the visible label's text (or an explicit `label`) so the group
 * is announced.
 */
export function ChoiceGroup({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const backward = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!forward && !backward) return;
    const radios = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]:not([disabled])',
      ),
    );
    if (radios.length === 0) return;
    const current = radios.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      radios[
        current === -1
          ? 0
          : (current + (forward ? 1 : -1) + radios.length) % radios.length
      ];
    e.preventDefault();
    next.focus();
    next.click();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={className}
    >
      {children}
    </div>
  );
}
