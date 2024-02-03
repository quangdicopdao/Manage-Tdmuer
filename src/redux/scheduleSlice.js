import { createSlice } from '@reduxjs/toolkit';

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        arrSchedules: {
            isFetching: false,
            newSchedule: [],
            error: false,
        },
    },
    reducers: {
        createScheduleStart: (state) => {
            state.arrSchedules.isFetching = true;
        },
        createScheduleSuccess: (state, action) => {
            state.arrSchedules.isFetching = false;
            state.arrSchedules.newSchedule.push(action.payload);
        },
        createScheduleFailer: (state) => {
            state.arrSchedules.isFetching = false;
            state.arrSchedules.error = true;
        },
        getScheduleStart: (state) => {
            state.arrSchedules.isFetching = true;
            state.arrSchedules.error = false;
        },
        getScheduleSuccess: (state, action) => {
            state.arrSchedules.isFetching = false;
            state.arrSchedules.newSchedule = action.payload;
            state.arrSchedules.error = false;
        },
        getScheduleFailer: (state) => {
            state.arrSchedules.isFetching = false;
            state.arrSchedules.error = true;
        },
    },
});
export const {
    createScheduleFailer,
    createScheduleStart,
    createScheduleSuccess,
    getScheduleSuccess,
    getScheduleFailer,
    getScheduleStart,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;
