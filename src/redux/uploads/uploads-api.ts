import { apiSlice } from "../api-slice";

/** Generic single-image upload (multipart) → returns the hosted URL. Used for
 * profile pictures and any other admin image. */
export const uploadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<
      { message: string; data: { url: string } },
      FormData
    >({
      query: (body) => ({ url: "admin/uploads/image", method: "POST", body }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadsApi;
