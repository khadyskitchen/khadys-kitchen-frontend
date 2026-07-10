import { apiSlice } from "../api-slice";
import { toQueryString } from "@/lib/to-query-string";
import type { IMessageResponse } from "@/types/auth.types";
import type {
  IGalleryImageInput,
  IGalleryImageListResponse,
  IGalleryImageResponse,
  IGalleryImageUpdate,
  IGalleryListQuery,
} from "@/types/gallery.types";

/** Wraps a JSON body + image file into the multipart shape the backend's
 * `parseJsonPayload` + upload middleware expect. */
const toMultipart = (body: unknown, photo: File): FormData => {
  const form = new FormData();
  form.append("payload", JSON.stringify(body));
  form.append("image", photo);
  return form;
};

/** The kitchen photo gallery — public browse (published photos only, newest
 * first) and admin CRUD with the publish toggle. */
export const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Public ────────────────────────────────────────────────
    getPublicGalleryImages: builder.query<
      IGalleryImageListResponse,
      IGalleryListQuery | void
    >({
      query: (params) => ({
        url: `gallery${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: ["GalleryImages"],
    }),

    // ── Admin ─────────────────────────────────────────────────
    getGalleryImages: builder.query<
      IGalleryImageListResponse,
      IGalleryListQuery | void
    >({
      query: (params) => ({
        url: `admin/gallery${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "GalleryImage" as const,
                id,
              })),
              "GalleryImages",
            ]
          : ["GalleryImages"],
    }),

    // The photo travels WITH the save as multipart (payload JSON + file) — the
    // backend uploads it inside the same request and cleans up on failure, so
    // nothing is pre-uploaded or orphaned. A photo is required: it IS the record.
    createGalleryImage: builder.mutation<
      IGalleryImageResponse,
      { body: IGalleryImageInput; photo: File }
    >({
      query: ({ body, photo }) => ({
        url: "admin/gallery",
        method: "POST",
        body: toMultipart(body, photo),
      }),
      invalidatesTags: ["GalleryImages"],
    }),

    updateGalleryImage: builder.mutation<
      IGalleryImageResponse,
      { id: string; body: IGalleryImageUpdate; photo?: File }
    >({
      query: ({ id, body, photo }) => ({
        url: `admin/gallery/${id}`,
        method: "PATCH",
        body: photo ? toMultipart(body, photo) : body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "GalleryImage", id },
        "GalleryImages",
      ],
    }),

    setGalleryImagePublished: builder.mutation<
      IGalleryImageResponse,
      { id: string; isPublished: boolean }
    >({
      query: ({ id, isPublished }) => ({
        url: `admin/gallery/${id}/${isPublished ? "publish" : "unpublish"}`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "GalleryImage", id },
        "GalleryImages",
      ],
    }),

    deleteGalleryImage: builder.mutation<IMessageResponse, string>({
      query: (id) => ({ url: `admin/gallery/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "GalleryImage", id },
        "GalleryImages",
      ],
    }),
  }),
});

export const {
  useGetPublicGalleryImagesQuery,
  useGetGalleryImagesQuery,
  useCreateGalleryImageMutation,
  useUpdateGalleryImageMutation,
  useSetGalleryImagePublishedMutation,
  useDeleteGalleryImageMutation,
} = galleryApi;
