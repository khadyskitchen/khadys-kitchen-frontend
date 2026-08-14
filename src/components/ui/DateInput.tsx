"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text shown while the field is empty - mobile browsers render an empty
   * `<input type="date">` as a bare box with no hint at all. */
  placeholder?: string;
  /** Classes for the relative wrapper (sizing usually lives here). */
  wrapperClassName?: string;
  /** Position/typography overrides for the placeholder overlay - match the
   * input's horizontal padding (defaults to `left-3` for `px-3` inputs). */
  placeholderClassName?: string;
}

/**
 * Native date input with a real placeholder. While empty, the input's own
 * text is made transparent (Chrome's "mm/dd/yyyy" ghost included) and a
 * custom hint is overlaid; on focus the native text returns so keyboard
 * entry stays visible. Clicking anywhere on the field opens the picker.
 * Works controlled (pass `value`) or uncontrolled via react-hook-form's
 * `register` - emptiness is then read off the DOM node so `reset()` is
 * picked up too.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput(
    {
      placeholder = "Select date",
      wrapperClassName,
      placeholderClassName,
      className,
      value,
      onChange,
      ...props
    },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement | null>(null);
    // Uncontrolled usage: emptiness must be read off the DOM node after every
    // render - react-hook-form's reset() writes the value without an event, so
    // the deliberately dependency-less effect re-checks each render (the
    // same-value setState bails out, so this can't loop).
    const [domEmpty, setDomEmpty] = useState(!props.defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (value === undefined) setDomEmpty(!innerRef.current?.value);
    });
    const empty = value !== undefined ? value === "" : domEmpty;

    return (
      <span className={cn("group relative block min-w-0", wrapperClassName)}>
        <input
          {...props}
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="date"
          value={value}
          onChange={(e) => {
            if (value === undefined) setDomEmpty(!e.target.value);
            onChange?.(e);
          }}
          onClick={(e) => {
            try {
              e.currentTarget.showPicker?.();
            } catch {
              // Unsupported (older iOS) - the native tap behaviour still opens it.
            }
          }}
          className={cn(
            "cursor-pointer",
            className,
            empty && "text-transparent focus:text-ink",
          )}
        />
        {empty ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 left-3 z-[1] flex items-center text-[13.5px] text-ink/45 group-focus-within:hidden",
              placeholderClassName,
            )}
          >
            {placeholder}
          </span>
        ) : null}
      </span>
    );
  },
);
