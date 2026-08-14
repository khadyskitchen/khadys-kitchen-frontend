import { apiSlice } from "../api-slice";
import { toMultipart } from "@/lib/to-multipart";
import { toQueryString } from "@/lib/to-query-string";
import type { IMessageResponse } from "@/types/auth.types";
import type {
  IGalleryImageInput,
  IGalleryImageListResponse,
  IGalleryImageResponse,
  IGalleryImageUpdate,
  IGalleryListQuery,
} from "@/types/gallery.types";

/** The kitchen photo gallery - public browse (published photos only, newest
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

    // The photo travels WITH the save as multipart (payload JSON + file) - the
    // backend uploads it inside the same request and cleans up on failure, so
    // nothing is pre-uploaded or orphaned. A photo is required: it IS the record.
    createGalleryImage: builder.mutation<
      IGalleryImageResponse,
      { body: IGalleryImageInput; photo: File }
    >({
      query: ({ body, photo }) => ({
        url: "admin/gallery",
        method: "POST",
        body: toMultipart(body, { image: photo }),
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
        body: photo ? toMultipart(body, { image: photo }) : body,
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
