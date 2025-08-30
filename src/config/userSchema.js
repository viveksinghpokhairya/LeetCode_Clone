const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,   
        maxLength: 15   
    },
    email: {
        type: String,
        required: true,
        unique: true,  
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    user: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    problemSolved: [{
        type: Schema.Types.ObjectId,
        ref: "problem",
    }],
    joinedAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("user", userSchema);
module.exports = User;
