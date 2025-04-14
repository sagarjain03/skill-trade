import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
//     content: { type: String, required: true },
//     replies: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
//         content: { type: String },
//       },
//     ],
//   },
//   { timestamps: true }
// );

const communityPostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rank: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profilePic: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CommunityPost =
  mongoose.models.CommunityPost || mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;