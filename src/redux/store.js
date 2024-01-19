// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import scheduleReducer from './scheduleSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        schedule: scheduleReducer,
    },
    devTools: process.env.NODE_ENV !== 'production', // Kích hoạt Redux DevTools Extension
});

export default store;
