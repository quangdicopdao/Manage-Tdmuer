import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        myProfile: {
            isFetching: false,
            profiles: [],
            error: false,
        },
    },
    reducers: {
        createProfileStart: (state) => {
            state.myProfile.isFetching = true;
        },
        createProfileSuccess: (state, action) => {
            state.myProfile.isFetching = false;
            state.myProfile.profiles.push(action.payload);
        },
        createProfileFailer: (state) => {
            state.myProfile.isFetching = false;
            state.myProfile.error = true;
        },
        getProfileStart: (state) => {
            state.myProfile.isFetching = true;
            state.myProfile.error = false;
        },
        getProfileSuccess: (state, action) => {
            state.myProfile.isFetching = false;
            state.myProfile.profiles = action.payload;
            state.myProfile.error = false;
        },
        getProfileFailer: (state) => {
            state.myProfile.isFetching = false;
            state.myProfile.error = true;
        },
    },
});
export const {
    createProfileFailer,
    createProfileStart,
    createProfileSuccess,
    getProfileSuccess,
    getProfileFailer,
    getProfileStart,
} = profileSlice.actions;
export default profileSlice.reducer;
