"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useModalFocus } from "@/hooks/use-modal-focus";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Center the card content (e.g. success confirmations). */
  centered?: boolean;
  /** id of the element that labels the dialog (usually the title). */
  labelledBy?: string;
  /** Mobile posture: "sheet" (default) slides up as a full-width bottom
   * sheet; "card" stays a centred floating card at every size (photo zooms,
   * small confirmations that shouldn't span the screen). */
  variant?: "sheet" | "card";
  /** When false, Escape and scrim clicks are ignored - use while a submit is
   * in flight so an accidental tap can't dismiss a working form. The close
   * button/Cancel action stays the caller's responsibility. */
  dismissible?: boolean;
}

/**
 * Accessible base modal - scrim, centered card, Escape-to-close, click-outside,
 * body scroll-lock, focus-in/restore, and a basic focus trap. Compose product
 * modals (confirmations, forms, success states) on top of it.
 */
export function Modal({
  open,
  onClose,
  children,
  className,
  centered = false,
  labelledBy,
  variant = "sheet",
  dismissible = true,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose/dismissible without re-running the focus effect -
  // an inline `onClose` prop would otherwise steal focus back mid-typing.
  const onCloseRef = useRef(onClose);
  const dismissibleRef = useRef(dismissible);
  useEffect(() => {
    onCloseRef.current = onClose;
    dismissibleRef.current = dismissible;
  });

  useModalFocus(open, cardRef, {
    onEscape: () => {
      if (dismissibleRef.current) onCloseRef.current();
    },
  });

  if (!open) return null;

  // Phones get a bottom sheet (full width, slides up, safe-area padding) -
  // or a centred floating card for variant="card". Larger screens always get
  // the centered card. justify-items stays centred in every posture so a
  // narrower card never pins to the sheet's end edge.
  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[200] grid justify-items-center sm:items-center sm:p-[clamp(16px,4vw,44px)]",
        variant === "sheet" ? "items-end" : "items-center p-4",
      )}
      style={{ background: "rgba(24,16,10,0.55)", animation: "kk-fadein .2s both" }}
      onMouseDown={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "w-full overflow-y-auto bg-card outline-none",
          variant === "sheet"
            ? "max-h-[92dvh] animate-[kk-sheetup_.28s_both] rounded-t-[22px] p-5 pb-[max(20px,env(safe-area-inset-bottom))] sm:rounded-[22px] sm:p-7"
            : "max-h-[calc(100dvh-32px)] animate-[kk-toastin_.25s_both] rounded-[22px] p-5 sm:p-7",
          "sm:max-h-[calc(100dvh-32px)] sm:max-w-[400px] sm:animate-[kk-toastin_.25s_both]",
          centered && "text-center",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
