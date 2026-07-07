/**
 * Inline, screen-reader-linked validation message for the public marketing
 * forms (checkout, application, …). Pair the `id` with the input's
 * `aria-describedby` and set `aria-invalid` on the input. Renders nothing when
 * there is no message.
 */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="text-[12.5px] font-semibold text-danger">
      {message}
    </span>
  );
}
