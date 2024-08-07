import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: "/api/v1",
		tagTypes: ["Channel", "Message"],
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
			providesTags: ["Channel"],
		}),
		addChannel: builder.mutation({
			query: (channel) => ({
				url: "/channels",
				method: "POST",
				body: channel,
			}),
			invalidatesTags: ["Channel"],
		}),
		renameChannel: builder.mutation({
			query: ({ id, name }) => ({
				url: `/channels/${id}`,
				method: "PATCH",
				body: { name }, // сервер ожидает получить объект, поэтому мы отправляем ему объект: { name: name }
			}),
			invalidatesTags: ["Channel"],
		}),
		removeChannel: builder.mutation({
			query: (id) => ({
				url: `/channels/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Channel", "Message"],
		}),

		getMessages: builder.query({
			query: () => "/messages",
			providesTags: ["Message"],
		}),
		addMessage: builder.mutation({
			query: (message) => ({
				url: "/messages",
				method: "POST",
				body: message,
			}),
			invalidatesTags: ["Message"],
		}),
		removeMessage: builder.mutation({
			query: (id) => ({
				url: `/messages/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Message"],
		}),
	}),
});

export const {
	useLoginMutation,
	useSignupMutation,

	useGetChannelsQuery,
	useAddChannelMutation,
	useRenameChannelMutation,
	useRemoveChannelMutation,

	useGetMessagesQuery,
	useAddMessageMutation,
	useRemoveMessageMutation,
} = api;
