"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/TextField";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useUploadImageMutation } from "@/redux/uploads/uploads-api";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/redux/products/products-api";
import type { IProduct, IProductInput } from "@/types/product.types";
import { PRODUCT_CATEGORIES } from "@/types/product.types";
import {
  productSchema,
  type ProductFormValues,
} from "@/validations/product-schema";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Form values → the backend `createProductSchema` payload (GHS → pesewas). */
function toPayload(v: ProductFormValues): IProductInput {
  return {
    name: v.name,
    category: v.category,
    description: v.description?.trim() || undefined,
    price: Math.round(Number(v.price) * 100),
    unit: v.unit,
    leadTimeDays: v.leadTimeDays === "" ? 0 : Number(v.leadTimeDays),
    image: v.image || undefined,
    isAvailable: v.isAvailable,
    stock: v.stock === "" ? null : Number(v.stock),
    position: v.position === "" ? 0 : Number(v.position),
  };
}

function toForm(p: IProduct): ProductFormValues {
  return {
    name: p.name,
    category: p.category,
    description: p.description ?? "",
    price: String(p.price / 100),
    unit: p.unit,
    leadTimeDays: String(p.leadTimeDays),
    image: p.image ?? "",
    isAvailable: p.isAvailable,
    stock: p.stock === null ? "" : String(p.stock),
    position: String(p.position),
  };
}

const EMPTY: ProductFormValues = {
  name: "",
  category: "BREAD",
  description: "",
  price: "",
  unit: "Each",
  leadTimeDays: "0",
  image: "",
  isAvailable: true,
  stock: "",
  position: "0",
};

const labelClass =
  "text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/60";

/** Create/edit form for a shop product. Price entered in GHS; empty stock
 * means made to order. The image uploads to Cloudinary first, then the URL is
 * saved with the product. */
export function ProductForm({ product }: { product?: IProduct }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [upload, { isLoading: uploading }] = useUploadImageMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? toForm(product) : EMPTY,
  });

  const image = watch("image");
  const [preview, setPreview] = useState<string>(product?.image ?? "");

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      notify.error("Image must be under 5MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await upload(formData).unwrap();
      setValue("image", res.data.url, { shouldDirty: true });
      setPreview(res.data.url);
    } catch (err) {
      notify.error("Couldn't upload the image", {
        description: extractApiError(err).message,
      });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (v: ProductFormValues) => {
    try {
      if (product) {
        await updateProduct({ id: product.id, body: toPayload(v) }).unwrap();
        notify.success("Product updated");
      } else {
        await createProduct(toPayload(v)).unwrap();
        notify.success("Product created");
      }
      router.push("/admin/items");
    } catch (err) {
      notify.error(
        editing ? "Couldn't save the product" : "Couldn't create the product",
        { description: extractApiError(err).message },
      );
    }
  };

  return (
    <form
      noValidate
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="grid gap-[18px]"
      style={{ animation: "kk-rise .5s both" }}
    >
      <Card className="grid gap-4 p-[clamp(20px,3vw,28px)]">
        <h2 className="font-serif text-[19px]">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            placeholder="e.g. Butter Croissant"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="grid gap-[7px]">
            <span className={labelClass}>Category</span>
            <Select {...register("category")}>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid gap-[7px]">
          <span className={labelClass}>Description</span>
          <textarea
            rows={4}
            placeholder="What makes this bake special?"
            {...register("description")}
            className="w-full rounded-[12px] border-[1.5px] border-ink/20 bg-cream px-[15px] py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-accent"
          />
          {errors.description ? (
            <span className="text-[12.5px] font-semibold text-danger">
              {errors.description.message}
            </span>
          ) : null}
        </div>
      </Card>

      <Card className="grid gap-4 p-[clamp(20px,3vw,28px)]">
        <h2 className="font-serif text-[19px]">Pricing & availability</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Price (GHS)"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message}
            {...register("price")}
          />
          <TextField
            label="Sale unit"
            placeholder='e.g. "Each", "Box of 6", "Per loaf"'
            error={errors.unit?.message}
            {...register("unit")}
          />
          <TextField
            label="Lead time (days)"
            type="number"
            min="0"
            hint="0 = available same day"
            error={errors.leadTimeDays?.message}
            {...register("leadTimeDays")}
          />
          <TextField
            label="Stock (optional)"
            type="number"
            min="0"
            hint="Leave empty for made to order (no cap)"
            error={errors.stock?.message}
            {...register("stock")}
          />
          <TextField
            label="Position"
            type="number"
            min="0"
            hint="Lower numbers show first in the shop"
            error={errors.position?.message}
            {...register("position")}
          />
          <label className="flex items-center gap-3 self-end pb-3 text-[14.5px] font-medium">
            <input
              type="checkbox"
              {...register("isAvailable")}
              className="h-[18px] w-[18px] accent-[--color-accent]"
            />
            Available in the shop
          </label>
        </div>
      </Card>

      <Card className="grid gap-4 p-[clamp(20px,3vw,28px)]">
        <h2 className="font-serif text-[19px]">Photo</h2>
        <div className="flex flex-wrap items-center gap-5">
          {preview || image ? (
            <Image
              src={preview || image}
              alt="Product"
              width={132}
              height={132}
              className="h-[132px] w-[132px] rounded-[16px] border border-ink/10 object-cover"
            />
          ) : (
            <div className="grid h-[132px] w-[132px] place-items-center rounded-[16px] border-[1.5px] border-dashed border-ink/25 text-[12px] text-ink/45">
              No photo yet
            </div>
          )}
          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Uploading…
                </span>
              ) : preview || image ? (
                "Replace photo"
              ) : (
                "Upload photo"
              )}
            </Button>
            <span className="text-[12.5px] text-ink/50">
              JPG or PNG, up to 5MB.
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void pickImage(e.target.files?.[0])}
          />
        </div>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/items")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={creating || updating}
          loadingText={editing ? "Saving…" : "Creating…"}
        >
          {editing ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
