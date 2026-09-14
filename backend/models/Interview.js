const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        interviewType: {
            type: String,
            enum: ["Technical", "HR", "Behavioral", "Mixed"],
            required: true,
        },

        numberOfQuestions: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },

        questions: [
    {
        question: { type: String },

        answer: {
            type: String,
            default: "",
        },

        feedback: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            default: 0,
        },

        strengths: {
            type: [String],
            default: [],
        },

        improvements: {
            type: [String],
            default: [],
        },
    },
],

        overallScore: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["created", "in-progress", "completed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Interview", interviewSchema);