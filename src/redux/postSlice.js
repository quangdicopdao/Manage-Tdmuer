import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'Post',
    initialState: {
        arrPosts: {
            isFetching: false,
            newPost: [],
            error: false,
        },
    },
    reducers: {
        createPostStart: (state) => {
            state.arrPosts.isFetching = true;
        },
        createPostSuccess: (state, action) => {
            state.arrPosts.isFetching = false;
            state.arrPosts.newPost.push(action.payload);
        },
        createPostFailer: (state) => {
            state.arrPosts.isFetching = false;
            state.arrPosts.error = true;
        },
        getPostStart: (state) => {
            state.arrPosts.isFetching = true;
            state.arrPosts.error = false;
        },
        getPostSuccess: (state, action) => {
            state.arrPosts.isFetching = false;
            state.arrPosts.newPost = action.payload;
            state.arrPosts.error = false;
        },
        getPostFailer: (state) => {
            state.arrPosts.isFetching = false;
            state.arrPosts.error = true;
        },
    },
});
export const { createPostFailer, createPostStart, createPostSuccess, getPostSuccess, getPostFailer, getPostStart } =
    postSlice.actions;
export default postSlice.reducer;
