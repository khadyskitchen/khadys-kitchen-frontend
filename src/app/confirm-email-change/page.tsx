import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ConfirmEmailChangeForm } from "@/components/auth/confirm-email-change-form";

export const metadata: Metadata = {
  title: "Confirm your new email",
  // Auth plumbing - keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default async function ConfirmEmailChangePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const backToProfile = (
    <Link
      href="/admin/profile"
      className="font-semibold text-ink/70 no-underline transition-colors hover:text-accent"
    >
      ← Back to your profile
    </Link>
  );

  // A link with no token is unusable — the change must be requested again
  // from the profile page.
  if (!token) {
    return (
      <AuthCard
        title="Invalid confirmation link"
        subtitle="This link is missing its token or has already been used."
        footer={backToProfile}
      >
        <p className="text-[14.5px] leading-[1.6] text-ink/70">
          Email-change links expire after 30 minutes and can only be used once.
          Request the change again from your profile to get a fresh one.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Confirm your new sign-in email"
      subtitle="One click and the new address becomes your login."
      footer={backToProfile}
    >
      <ConfirmEmailChangeForm token={token} />
    </AuthCard>
  );
}
