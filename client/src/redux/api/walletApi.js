import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletApi = createApi({

    reducerPath: "walletApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1/wallet/", credentials:"include" }),
    tagTypes: ["Wallet"],
    endpoints: (builder) => ({

        // add money to wallet api
        addMoneyToWallet: builder.mutation({
        query: (addMoney) => ({
            url: "add",
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(addMoney),
        }),
        invalidatesTags: ["Wallet"],
        }),
    }),
    });

export const { useAddMoneyToWalletMutation } = walletApi;