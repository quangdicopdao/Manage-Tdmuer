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
            state.arrSchedules.arrSchedules.error = false;
        },
        createScheduleSuccess: (state, action) => {
            state.arrSchedules.isFetching = false;
            state.arrSchedules.newSchedule.push(action.payload);
            state.arrSchedules.error = false;
        },
        createScheduleFailer: (state) => {
            state.arrSchedules.isFetching = false;
            state.arrSchedules.error = false;
        },
    },
});
export const { createScheduleFailer, createScheduleStart, createScheduleSuccess } = scheduleSlice.actions;
export default scheduleSlice.reducer;
