import { cn } from "@/lib/utils";

/**
 * A pill-shaped single-choice toggle used across the public forms (checkout
 * payment mode, application hostel/pay choices, contact topic). Behaves like a
 * radio: `aria-pressed` reflects the selection.
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
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "cursor-pointer rounded-full border-[1.5px] px-[22px] py-[11px] font-sans text-[14.5px] font-semibold transition-colors",
        selected
          ? "border-accent bg-accent text-[#FDFAF3]"
          : "border-ink/25 bg-transparent text-ink hover:border-ink/50",
      )}
    >
      {children}
    </button>
  );
}
