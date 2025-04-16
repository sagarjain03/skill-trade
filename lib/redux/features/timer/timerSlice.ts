// timerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/redux/store";

interface TimerState {
    time: number;
    isRunning: boolean;
    intervalId: number | null;
    duration: number; // Total duration in seconds
}

const initialState: TimerState = {
    time: 0,
    isRunning: false,
    intervalId: null,
    duration: 0,
};

const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        startTimer: (state) => {
            state.isRunning = true;
        },
        stopTimer: (state) => {
            state.isRunning = false;
        },
        resetTimer: (state) => {
            state.time = 0;
            state.isRunning = false;
        },
        incrementTime: (state) => {
            state.time += 1;
        },
        setIntervalId: (state, action: PayloadAction<number | null>) => {
            state.intervalId = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            // Duration in minutes, convert to seconds
            state.duration = action.payload * 60;
        },
    },
});

export const {
    startTimer,
    stopTimer,
    resetTimer,
    incrementTime,
    setIntervalId,
    setDuration
} = timerSlice.actions;

// Thunk actions
export const startTimerAsync = () => (dispatch: AppDispatch) => {
    const intervalId = window.setInterval(() => {
        dispatch(incrementTime());
    }, 1000);
    dispatch(setIntervalId(intervalId));
    dispatch(startTimer());
};

export const stopTimerAsync = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { intervalId } = getState().timer;
    if (intervalId) {
        clearInterval(intervalId);
    }
    dispatch(stopTimer());
    dispatch(setIntervalId(null));
};

// Timer-related selectors
export const selectTimeElapsed = (state: RootState) => state.timer.time;
export const selectTimeRemaining = (state: RootState) =>
    Math.max(0, state.timer.duration - state.timer.time);
export const selectIsRunning = (state: RootState) => state.timer.isRunning;
export const selectTimeRemainingFormatted = (state: RootState) => {
    const timeRemaining = selectTimeRemaining(state);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
export const selectPercentTimeRemaining = (state: RootState) =>
    state.timer.duration > 0
        ? (selectTimeRemaining(state) / state.timer.duration) * 100
        : 0;

export default timerSlice.reducer;