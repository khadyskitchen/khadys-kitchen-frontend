import { apiSlice } from "../api-slice";
import { userLoggedIn, userLoggedOut } from "./auth-slice";
import type {
  ILoginResponse,
  IUserLoginInput,
  ITwoFactorVerifyInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IMessageResponse,
} from "@/types/auth.types";
import { isTwoFactorChallenge } from "@/types/auth.types";
import type { IUserResponse } from "@/types/user.types";

/**
 * Auth endpoints, injected into the single `apiSlice`. These mirror the
 * Khady's Kitchen backend's intended cookie-based contract (base `/api/v1`,
 * httpOnly `accessToken`/`refreshToken`/`twoFactorPending`). No `invalidatesTags`
 * here — session transitions are handled by dispatching auth actions and, on
 * logout, purging the whole cache with `resetApiState`.
 */
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, IUserLoginInput>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // A 2FA challenge is not a session — only store a real user.
          if (!isTwoFactorChallenge(data.data)) {
            dispatch(userLoggedIn({ user: data.data }));
          }
        } catch {
          // Surfaced to the caller via `unwrap()`.
        }
      },
    }),

    /** Step 2 of a 2FA login: exchanges the emailed code for a session. */
    verifyTwoFactor: builder.mutation<IUserResponse, ITwoFactorVerifyInput>({
      query: (body) => ({ url: "auth/2fa/verify", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.data }));
        } catch {
          // Surfaced to the caller via `unwrap()`.
        }
      },
    }),

    /** Re-send the 2FA code during a pending challenge. */
    resendTwoFactorCode: builder.mutation<IMessageResponse, void>({
      query: () => ({ url: "auth/2fa/resend", method: "POST" }),
    }),

    /** Emails a confirmation code before enabling 2FA on the account. */
    requestTwoFactorSetup: builder.mutation<IMessageResponse, void>({
      query: () => ({ url: "auth/2fa/enable", method: "POST" }),
    }),

    confirmTwoFactorSetup: builder.mutation<
      IUserResponse,
      ITwoFactorVerifyInput
    >({
      query: (body) => ({ url: "auth/2fa/enable/confirm", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.data }));
        } catch {
          // Surfaced to the caller via `unwrap()`.
        }
      },
    }),

    disableTwoFactor: builder.mutation<IUserResponse, { password: string }>({
      query: (body) => ({ url: "auth/2fa/disable", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.data }));
        } catch {
          // Surfaced to the caller via `unwrap()`.
        }
      },
    }),

    forgotPassword: builder.mutation<IMessageResponse, IForgotPasswordInput>({
      query: (body) => ({ url: "auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: builder.mutation<IMessageResponse, IResetPasswordInput>({
      query: (body) => ({ url: "auth/reset-password", method: "POST", body }),
    }),

    logout: builder.mutation<IMessageResponse, void>({
      query: () => ({ url: "auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear client session and purge cached data even if the server call
          // failed — the user intends to be logged out regardless.
          dispatch(userLoggedOut());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyTwoFactorMutation,
  useResendTwoFactorCodeMutation,
  useRequestTwoFactorSetupMutation,
  useConfirmTwoFactorSetupMutation,
  useDisableTwoFactorMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
