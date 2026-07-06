"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/admin/ui";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateMeMutation } from "@/redux/auth/auth-api";
import { ProfileAvatar } from "@/components/admin/profile-avatar";

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(50),
  lastName: z.string().trim().min(1, "Required").max(50),
});
type Values = z.infer<typeof schema>;

export default function ProfilePage() {
  const user = useCurrentUser();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      await updateMe(values).unwrap();
      notify.success("Profile updated");
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          setError(field as keyof Values, { message: msg });
        }
      }
      notify.error("Couldn't update your profile", { description: message });
    }
  };

  return (
    <div style={{ animation: "kk-rise .5s both" }} className="max-w-[640px]">
      <Card className="p-[clamp(20px,3vw,28px)]">
        <h2 className="mb-1 font-serif text-[20px]">Your profile</h2>
        <p className="mb-5 text-[14px] text-ink/55">
          Update your photo and name. Email and role are managed by the system.
        </p>
        <div className="mb-6 border-b border-ink/10 pb-6">
          <ProfileAvatar user={user} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-[18px]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[18px]">
            <TextField
              label="First name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <TextField
              label="Last name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <TextField label="Email" value={user?.email ?? ""} readOnly />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[18px]">
            <TextField
              label="Role"
              value={user?.role ?? ""}
              readOnly
              className="capitalize"
            />
            <TextField label="Phone" value={user?.phone ?? "—"} readOnly />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} loadingText="Saving…">
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
