"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { apiSlice } from "@/redux/api-slice";
import { useConfirmEmailChangeMutation } from "@/redux/auth/auth-api";
import { userLoggedOut } from "@/redux/auth/auth-slice";

/**
 * Deliberately a button, not an on-load effect: link scanners and prefetchers
 * must never consume the single-use token — only a real click applies the
 * change. On success every session is dead (the backend bumps the session
 * epoch), so the client state is cleared and the user lands on /login.
 */
export function ConfirmEmailChangeForm({ token }: { token: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [confirmEmailChange, { isLoading }] = useConfirmEmailChangeMutation();

  const onConfirm = async () => {
    try {
      await confirmEmailChange({ token }).unwrap();
      dispatch(userLoggedOut());
      dispatch(apiSlice.util.resetApiState());
      notify.success("Sign-in email updated", {
        description: "Sign in again with your new email address.",
      });
      router.replace("/login");
    } catch (err) {
      const { message } = extractApiError(err);
      notify.error("Couldn't update your email", { description: message });
    }
  };

  return (
    <div className="grid gap-5">
      <p className="text-[14.5px] leading-[1.6] text-ink/70">
        Confirming applies the new sign-in email and signs you out of every
        device — you&rsquo;ll sign in again with the new address.
      </p>
      <Button
        size="lg"
        className="w-full"
        isLoading={isLoading}
        loadingText="Confirming…"
        onClick={() => void onConfirm()}
      >
        Confirm email change
      </Button>
    </div>
  );
}
