import type { IPaginationMeta } from "./training.types";

/** A kitchen gallery photo, mirroring the backend `toGalleryImageDTO`. The
 * photo IS the record — `image` is always set; `caption` doubles as the
 * public alt text. */
export interface IGalleryImage {
  id: string;
  image: string;
  caption: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGalleryImageResponse {
  message: string;
  data: IGalleryImage;
}

export interface IGalleryImageListResponse {
  message: string;
  data: IGalleryImage[];
  meta: IPaginationMeta;
}

export interface IGalleryListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  /** `true` = published only, `false` = hidden only (admin list). */
  published?: boolean;
  /** Matches against captions. */
  search?: string;
}

/** Mirrors the backend `createGalleryImageSchema` (gallery-validation.ts).
 * The photo itself travels only as the multipart file — never a URL. */
export interface IGalleryImageInput {
  caption?: string;
  isPublished?: boolean;
}

/** Mirrors the backend `updateGalleryImageSchema` — `caption: null` clears
 * an existing caption; a replacement photo travels as the multipart file. */
export interface IGalleryImageUpdate {
  caption?: string | null;
}
