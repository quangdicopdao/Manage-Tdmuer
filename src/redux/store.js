// redux/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== 'production', // Kích hoạt Redux DevTools Extension
});
export let persistor = persistStore(store);
//export default store;
