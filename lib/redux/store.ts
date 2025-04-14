import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/UserData/userDataSlice";
import communityReducer from "./features/CommunityData/communitySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;