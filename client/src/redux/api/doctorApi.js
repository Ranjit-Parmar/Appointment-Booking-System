import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const doctorApi = createApi({
    reducerPath: "doctorApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1/doctor/", credentials:"include" }),
    tagTypes: ["Doctor"],
    endpoints: (builder) => ({

        // get all doctors
        getAllDoctors: builder.query({
        query: (sortData) => {
            let base_url = "getAllDoctors";
            if(sortData) base_url += `?sort=${sortData}`;
            return base_url;
        },
        providesTags: ["Doctor"],
        }),

        // get all specialization
        getSpecialization: builder.query({
        query: () => "getSpecialization",
        providesTags: ["Doctor"],
        }),

        // get doctor by id
        getDoctorDetails: builder.query({
        query: (id) => id,
        providesTags: ["Doctor"],
        }),

        // create doctor profile
        createDoctorProfile: builder.mutation({
        query: (doctorProfileData) => ({
            url: "setProfile",
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(doctorProfileData),
        }),
        invalidatesTags: ["Doctor"],
        }),

        // update doctor profile
        updateDoctorProfile: builder.mutation({
        query: (doctorProfileData) => ({
            url: `updateProfile`,
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(doctorProfileData),
        }),
        invalidatesTags: ["Doctor"],
        }),

        // update doctor availability
        updateDoctorAvailability: builder.mutation({
        query: (updateDoctorAvailabilityData) => ({
            url: 'availability',
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(updateDoctorAvailabilityData),
        }),
        invalidatesTags: ["Doctor"],
        }),
    }),
    });

export const { useGetAllDoctorsQuery, useGetSpecializationQuery, useGetDoctorDetailsQuery, useCreateDoctorProfileMutation, useUpdateDoctorAvailabilityMutation, useUpdateDoctorProfileMutation } = doctorApi;