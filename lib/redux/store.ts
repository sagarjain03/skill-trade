import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "./features/UserData/userDataSlice";
import communityReducer from "./features/CommunityData/communitySlice";
import timerReducer from "@/lib/redux/features/timer/timerSlice";
import challengeReducer from "@/lib/redux/features/ChallengeData/challengeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    community: communityReducer,
    timer: timerReducer,
    challenge: challengeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;