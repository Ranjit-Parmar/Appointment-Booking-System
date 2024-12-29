import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../redux/reducer/authReducer';
import { authApi } from '../redux/api/authApi';
import { doctorApi } from '../redux/api/doctorApi';
import { walletApi } from '../redux/api/walletApi';
import { transactionApi } from '../redux/api/transactionApi';
import { appointmentApi } from '../redux/api/appointmentApi';


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [doctorApi.reducerPath]: doctorApi.reducer,
        [walletApi.reducerPath]: walletApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [appointmentApi.reducerPath]: appointmentApi.reducer,
        [authSlice.name]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, doctorApi.middleware, walletApi.middleware, transactionApi.middleware, appointmentApi.middleware),
    });

