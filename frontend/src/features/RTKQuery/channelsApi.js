import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const channelsApi = createApi({
  reducerPath: 'channels', // имя группы редюсеров (reducers)
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/channels' }),
  endpoints: (builder) => ({
    getChannels: builder.query({ // builder.query → query используется для get-запросов
      query: () => '', // сюда подставится значение из baseUrl, а именно: '/api/channels'
    }),
    getChannelById: builder.query({
      query: (id) => id, // значение id добавится к baseUrl, получится: '/api/channels/:id'
    }),
    addChannel: builder.mutation({ // builder.mutation → mutation используется для остальных запросов. Надо в поле method указать, какой именно это тип запроса: POST, DELETE
      query: (channel) => ({
        method: 'POST',
        body: channel,
      }),
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: id,
        method: 'DELETE',
      }),
    }),
  }),
});

// Это хуки для каждого действия, чтобы затем использовать
// данное API в компонентах.
// Каждый хук создаётся соответствующим билдером:
export const {
  useGetChannelsQuery, // создан builder.query
  useGetChannelByIdQuery, // создан builder.query
  useAddChannelMutation, // создан builder.mutation
  useRemoveChannelMutation // создан builder.mutation
} = channelsApi;