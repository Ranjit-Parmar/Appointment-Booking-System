import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/v1/auth/', credentials: 'include' }),
    tagTypes: ['auth'],
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (authData) => ({
                url: 'register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            }),
            invalidatesTags: ['auth'],
        }),
        login: builder.mutation({
            query: (authData) => ({
                url: 'login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            }),
            invalidatesTags: ['auth'],
        }),
    }),
})

export const { useSignupMutation, useLoginMutation } = authApi;