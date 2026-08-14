import Link from "next/link";
import type { ReactNode } from "react";

function Wordmark() {
  return (
    <span className="font-serif text-[26px] text-ink">
      Khady&rsquo;s{" "}
      <span className="font-sans text-[23px] font-light italic">Kitchen</span>
    </span>
  );
}

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Footer link row under the card. Defaults to a "← Back to site" link. */
  footer?: ReactNode;
}

/**
 * Shared brand shell for the auth screens (sign in, forgot / reset password):
 * a centered card on the cream page with the wordmark, a title + subtitle, the
 * form, and a footer link. Presentational only - no client state - so it renders
 * on the server for the forgot/reset pages and client-side inside the login card.
 */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-[clamp(20px,5vw,48px)] py-16 text-ink">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Link href="/" className="no-underline">
            <Wordmark />
          </Link>
          <div className="mt-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-accent">
            Admin console
          </div>
        </div>

        <div className="rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,36px)]">
          <h1 className="mb-1.5 font-serif text-[26px] font-normal">{title}</h1>
          <p className="mb-6 text-[14.5px] leading-[1.6] text-ink/60">{subtitle}</p>
          {children}
        </div>

        <p className="mt-6 text-center text-[13.5px] text-ink/55">
          {footer ?? (
            <Link
              href="/"
              className="font-semibold text-ink/70 no-underline transition-colors hover:text-accent"
            >
              ← Back to site
            </Link>
          )}
        </p>
      </div>
    </main>
  );
}
