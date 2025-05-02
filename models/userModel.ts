import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    rank: {
        type: String,
        enum: ["Beginner", "D", "C", "B", "A", "S"],
        default: "Beginner",
    },
    profilePic: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    skillsToTeach: {
        type: [String],
    },
    skillsToLearn: {    
        type: [String],
    },
    currentlyLearning: {
        type: String,
        default: "",
    },
    // New field to track whether the user is actively finding a match  
    isFindingMatch: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;