import { apiSlice } from "../api-slice";
import { toQueryString } from "@/lib/to-query-string";
import type { IMessageResponse } from "@/types/auth.types";
import type {
  ITeamUserListQuery,
  ITeamUserListResponse,
  ITeamUserResponse,
  UserRole,
} from "@/types/user.types";

export interface ITeamUserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface ITeamUserUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
}

/** Team management (/admin/users) — list, create, edit, role changes and
 * activate/deactivate/delete. Role changes are super-admin only; the backend
 * enforces the real rank rules (this UI only hides what would be refused). */
export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ITeamUserListResponse, ITeamUserListQuery | void>({
      query: (params) => ({
        url: `admin/users${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              "Users",
            ]
          : ["Users"],
    }),

    createUser: builder.mutation<ITeamUserResponse, ITeamUserCreateInput>({
      query: (body) => ({ url: "admin/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<
      ITeamUserResponse,
      { id: string; body: ITeamUserUpdateInput }
    >({
      query: ({ id, body }) => ({
        url: `admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }, "Users"],
    }),

    changeUserRole: builder.mutation<
      ITeamUserResponse,
      { id: string; role: UserRole }
    >({
      query: ({ id, role }) => ({
        url: `admin/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }, "Users"],
    }),

    setUserActive: builder.mutation<
      ITeamUserResponse,
      { id: string; active: boolean }
    >({
      query: ({ id, active }) => ({
        url: `admin/users/${id}/${active ? "activate" : "deactivate"}`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }, "Users"],
    }),

    deleteUser: builder.mutation<IMessageResponse, string>({
      query: (id) => ({ url: `admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "User", id }, "Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangeUserRoleMutation,
  useSetUserActiveMutation,
  useDeleteUserMutation,
} = usersApi;
