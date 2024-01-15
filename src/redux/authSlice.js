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
        createPostSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.posts.push(action.payload); // Thêm bài viết mới vào mảng posts
            state.login.error = false;
        },
        createPostFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    },
});

export const { loginFailed, loginStart, loginSuccess, createPostFailed, createPostSuccess } = authSlice.actions;
export default authSlice.reducer;
