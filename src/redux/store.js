// redux/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import scheduleReducer from './scheduleSlice';
import postsReducer from './postSlice';
import profileReducer from './profileSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};
const rootReducer = combineReducers({
    auth: authReducer,
    schedule: scheduleReducer,
    post: postsReducer,
    profile: profileReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production', // Kích hoạt Redux DevTools Extension
});
export let persistor = persistStore(store);
//export default store;
