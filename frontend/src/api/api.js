import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: "/api/v1",
		prepareHeaders: (headers, { getState }) => {
			// const token = getState().auth.token;
			const token = localStorage.getItem("token");

			// If we have a token set in state, let's assume that we should be passing it.
			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			}

			return headers;
		},
	}),
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/login",
				method: "POST",
				body: credentials,
			}),
		}),
		signup: builder.mutation({
			query: (credentials) => ({
				url: "/signup",
				method: "POST",
				body: credentials,
			}),
		}),
		getChannels: builder.query({
			query: () => "/channels",
		}),
		addChannel: builder.mutation({
			query: (channel) => ({
				url: "/channels",
				method: "POST",
				body: channel,
			}),
		}),
		// removeChannel: builder.mutation({
		//     query: (channel) => ({
		//         url
		//     })
		// }),
		getMessages: builder.query({
			query: () => "/messages",
			providesTags: ["Messages"],
		}),

		addMessage: builder.mutation({
			query: (message) => ({
				url: "/messages",
				method: "POST",
				body: message,
			}),
		}),
		removeMessage: builder.mutation({
			query: (id) => ({
				url: `/messages/${id}`,
				method: "DELETE",
				body: id,
			}),
			invalidatesTags: ["Messages"],
		}),
	}),
});

export const {
	useLoginMutation,
	useSignupMutation,

	useGetChannelsQuery,
	useAddChannelMutation,

	useGetMessagesQuery,
	useAddMessageMutation,
	useRemoveMessageMutation,
} = api;
