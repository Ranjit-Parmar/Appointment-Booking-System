import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentApi = createApi({
    reducerPath: "appointmentApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1/appointment/", credentials:"include" }),
    tagTypes: ["Appointment"],
    endpoints: (builder) => ({

        // book an appointment
        bookAppointment: builder.mutation({
        query: (appointmentData) => ({
            url: "book-appointment",
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        }),
        invalidatesTags: ["Appointment"],
        }),

        // get appointments for a doctor 
        getAllDoctorAppointments: builder.query({
        query: (id) => `doctor-appointments/${id}`,
        providesTags: ["Appointment"],
        }),
        
        // get appointments for a patient 
        getAllPatientAppointments: builder.query({
        query: (id) => `patient-appointments/${id}`,
        providesTags: ["Appointment"],
        }),

        // update appointment status
        updateAppointmentStatus: builder.mutation({
        query: ({ appointmentId, status }) => ({
            url: `${appointmentId}`,
            method: "PUT",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        }),
        invalidatesTags: ["Appointment"],
        }),

        // delete an appointment
        deleteAppointment: builder.mutation({
        query: (appointmentId) => ({
            url: `${appointmentId}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Appointment"],
        }),
    }),
    });

export const { useBookAppointmentMutation, useGetAllDoctorAppointmentsQuery, useGetAllPatientAppointmentsQuery, useUpdateAppointmentStatusMutation, useDeleteAppointmentMutation } = appointmentApi;