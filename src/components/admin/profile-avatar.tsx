"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useUploadImageMutation } from "@/redux/uploads/uploads-api";
import { useUpdateMeMutation } from "@/redux/auth/auth-api";
import type { IUser } from "@/types/user.types";

const MAX_BYTES = 5 * 1024 * 1024;

/** Profile picture: click the avatar (or the link) to upload a new one, and the
 * magnifier to view it zoomed. */
export function ProfileAvatar({ user }: { user: IUser | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, { isLoading: uploading }] = useUploadImageMutation();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const busy = uploading || saving;
  const picture = user?.profilePicture ?? null;
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      notify.error("Image must be under 5MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await upload(formData).unwrap();
      await updateMe({ profilePicture: res.data.url }).unwrap();
      notify.success("Profile photo updated");
    } catch (err) {
      notify.error("Couldn't update your photo", {
        description: extractApiError(err).message,
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label="Change profile photo"
          className="group relative grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-full border border-ink/15 bg-oat/50 font-serif text-[26px] text-ink/70"
        >
          {picture ? (
            <Image src={picture} alt="Profile" fill sizes="92px" className="object-cover" />
          ) : (
            <span>{initials}</span>
          )}
          <span
            className={cn(
              "absolute inset-0 grid place-items-center bg-ink/45 text-[11px] font-semibold uppercase tracking-[0.08em] text-cream transition-opacity",
              busy ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            {busy ? <Spinner onAccent /> : "Change"}
          </span>
        </button>
        {picture ? (
          <button
            type="button"
            onClick={() => {
              setZoomed(false);
              setZoomOpen(true);
            }}
            aria-label="View photo"
            className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-ink/15 bg-card text-ink/70 shadow-sm transition-colors hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
          </button>
        ) : null}
      </div>

      <div>
        <div className="text-[15px] font-semibold text-ink">
          {user ? `${user.firstName} ${user.lastName}` : "—"}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-1 text-[13.5px] font-semibold text-accent disabled:opacity-50"
        >
          {picture ? "Change photo" : "Upload a photo"}
        </button>
        <p className="mt-1 text-[12px] text-ink/45">JPG, PNG or WebP · max 5MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <Modal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        className="max-w-[min(90vw,520px)] p-3"
      >
        {picture ? (
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[16px] bg-oat/40">
            {/* Square crop that fits the viewport; click zooms into the centre
                (overflow-hidden = no scrollbars). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={picture}
              alt="Profile"
              onClick={() => setZoomed((z) => !z)}
              className={cn(
                "h-full w-full origin-center object-cover transition-transform duration-200",
                zoomed ? "scale-[1.8] cursor-zoom-out" : "scale-100 cursor-zoom-in",
              )}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
