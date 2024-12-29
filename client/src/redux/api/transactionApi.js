import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1/transaction/", credentials:"include" }),
    tagTypes: ["Transaction"],
    endpoints: (builder) => ({

        // get all transactions for a patient
        patientFinancialReport: builder.query({
        query: ({patientId, filter}) => `patientreport/${patientId}?filter=${filter}`,
        providesTags: ["Transaction"],
        }),

        // get all transactions for a doctor
        doctorFinancialReport: builder.query({
        query: ({doctorId, filter}) => `doctorReport/${doctorId}?filter=${filter}`,
        providesTags: ["Transaction"],
        }),

    }),
    });

export const { usePatientFinancialReportQuery, useDoctorFinancialReportQuery } = transactionApi;