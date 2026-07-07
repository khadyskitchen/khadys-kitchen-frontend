import { apiSlice } from "../api-slice";

/** Public contact message. Fire-and-forget POST — no cache tags to invalidate. */
export interface ISendContactMessageInput {
  name: string;
  contact: string;
  message: string;
  topic?: string;
  /** Honeypot — must stay empty. */
  website?: string;
}

export interface ISendContactMessageResponse {
  message: string;
}

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<
      ISendContactMessageResponse,
      ISendContactMessageInput
    >({
      query: (body) => ({ url: "contact", method: "POST", body }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
