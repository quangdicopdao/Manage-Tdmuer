// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            posts: [],
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },
        logout: {
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        createPostSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.posts.push(action.payload); // Thêm bài viết mới vào mảng posts
            state.login.error = false;
        },
        createPostFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutSuccess: (state, action) => {
            state.logout.isFetching = false;
            state.login.currentUser = null;
            state.logout.error = false;
        },
        logoutFailed: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },

        logoutStart: (state) => {
            state.logout = { isFetching: true, error: false }; // Khởi tạo state.logout nếu nó chưa tồn tại
        },
    },
});

export const { loginFailed, loginStart, loginSuccess, registerStart, registerSuccess, registerFailed } =
    authSlice.actions;

export const { logoutStart, logoutSuccess, logoutFailed, createPostFailed, createPostSuccess } = authSlice.actions;
export default authSlice.reducer;
