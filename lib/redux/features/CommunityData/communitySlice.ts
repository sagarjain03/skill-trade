import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommunityState {
  likedPosts: Record<string, boolean>; // Map postId to liked status (true = liked, false = not liked)
}

const initialState: CommunityState = {
  likedPosts: {},
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      if (!postId) {
        console.error("Invalid postId provided to toggleLike reducer");
        return;
      }
      
      // Toggle the liked status
      state.likedPosts[postId] = !state.likedPosts[postId];
      
      // If the new value is false (unlike), remove it from the object to keep it clean
      if (state.likedPosts[postId] === false) {
        delete state.likedPosts[postId];
      }
    },
    setPostLikeStatus: (state, action: PayloadAction<{postId: string, isLiked: boolean}>) => {
      const { postId, isLiked } = action.payload;
      if (isLiked) {
        state.likedPosts[postId] = true;
      } else {
        delete state.likedPosts[postId];
      }
    },
    syncLikedPosts: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.likedPosts = action.payload;
    }
  },
});

export const { toggleLike, setPostLikeStatus, syncLikedPosts } = communitySlice.actions;
export default communitySlice.reducer;