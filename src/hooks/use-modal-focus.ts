"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Shared dialog focus behavior: saves and restores the opener's focus, moves
 * focus into the container, traps Tab inside it, calls `onEscape` on Escape,
 * and locks body scroll while open. Powers the shared Modal and the
 * full-screen nav overlays so every `aria-modal` surface actually behaves
 * modally - `aria-modal` tells screen readers the page behind is inert, so
 * keyboard focus must be trapped to match.
 *
 * The container element needs `tabIndex={-1}` so it can receive initial focus.
 */
export function useModalFocus(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  { onEscape }: { onEscape?: () => void } = {},
) {
  // Keep the latest callback without making it an effect dependency -
  // otherwise an inline prop would re-run the effect on every render and
  // steal focus back to the dialog mid-typing.
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!open) return;
    const restore = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    containerRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapeRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusables = containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      restore?.focus?.();
    };
  }, [open, containerRef]);
}
