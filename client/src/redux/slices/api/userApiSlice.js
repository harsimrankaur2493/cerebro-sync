const USER_URL = "/user";
import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getTeamList: builder.query({
      query: () => ({
        url: `${USER_URL}/get-team`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getNotofications: builder.query({
      query: () => ({
        url: `${USER_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),

    markNotiAsRead: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data.id}`, // Corrected query string
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${USER_URL}/read-all-noti`, // Endpoint to mark all notifications as read
        method: "PUT",
        credentials: "include",
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

// Export the hooks for using the endpoints
export const {
  useUpdateUserMutation,
  useGetTeamListQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotoficationsQuery,
  useMarkNotiAsReadMutation,
  useMarkAllAsReadMutation, // Export the hook for marking all notifications as read
  useChangePasswordMutation,
} = userApiSlice;
