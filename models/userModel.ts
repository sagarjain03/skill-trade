import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
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


    
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;