"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RippleLoader } from "@/components/ui/Loader";

/** The item URL is its edit surface — everything (details, availability,
 * photo, delete) lives on one form, so just forward there. */
export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/items/${id}/edit`);
  }, [id, router]);

  return (
    <div className="grid min-h-[50vh] place-items-center">
      <RippleLoader />
    </div>
  );
}
