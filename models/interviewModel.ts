import mongoose, { Schema, Document } from "mongoose";

export interface IInterview extends Document {
  userId: string;
  role: string;
  type: string; // e.g., "Technical", "Behavioral", "Portfolio"
  techstack: string[];
  level: string; // e.g., "Junior", "Mid-level", "Senior"
  questions: string[];
  finalized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Technical", "Behavioral", "Portfolio"],
      required: true,
    },
    techstack: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      enum: ["Junior", "Mid-level", "Senior", "Lead"],
      required: true,
    },
    questions: {
      type: [String],
      default: [],
    },
    finalized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Interview = mongoose.model<IInterview>("Interview", interviewSchema);

export default Interview;