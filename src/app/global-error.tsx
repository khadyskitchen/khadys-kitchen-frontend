"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import { devError } from "@/lib/log";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the whole document, so it must render its own <html>/<body> and can't rely on
 * the app's global stylesheet — everything here is inline-styled and
 * self-contained. Branded to match the warm bakery palette (globals.css).
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    devError(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "64px 20px",
          background: "#f6efe4",
          color: "#241a12",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <title>Something went wrong</title>
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            textAlign: "center",
            background: "#fdfaf3",
            border: "1px solid rgba(36,26,18,0.1)",
            borderRadius: 20,
            padding: "48px 32px",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 62,
              height: 62,
              borderRadius: "9999px",
              background: "rgba(36,26,18,0.07)",
              fontSize: 24,
            }}
          >
            !
          </span>
          <h1 style={{ margin: "16px 0 0", fontSize: 24, fontWeight: 600 }}>
            Something didn&apos;t rise.
          </h1>
          <p
            style={{
              margin: "10px auto 22px",
              maxWidth: "36ch",
              fontSize: 14.5,
              lineHeight: 1.6,
              color: "rgba(36,26,18,0.6)",
            }}
          >
            The bakery hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              cursor: "pointer",
              borderRadius: "9999px",
              border: "none",
              padding: "12px 26px",
              fontSize: 14,
              fontWeight: 600,
              background: "#241a12",
              color: "#f6efe4",
            }}
          >
            ↻ Try again
          </button>
        </div>
      </body>
    </html>
  );
}
