
import mongoose from "mongoose";

// Feedback for an individual interview answer
const feedbackSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        correctness: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        clarity: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        relevance: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        detail: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        efficiency: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        communication: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        problemSolving: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        creativity: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        feedback: {
            type: String,
            default: "",
        },

        improvements: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

// Individual interview question
const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },

        userAnswer: {
            type: String,
            default: "",
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "easy",
        },

        timer: {
            type: Number,
            default: 0,
            min: 0,
        },

        feedback: {
            type: feedbackSchema,
            default: () => ({}),
        },
    },
    { _id: false }
);

// Main interview document
const interviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ["hr", "technical"],
            required: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        useResume: {
            type: Boolean,
            default: false,
        },

        currentQuestion: {
            type: Number,
            default: 0,
            min: 0,
        },

        questions: {
            type: [questionSchema],
            default: [],
        },

        overallScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        strengths: {
            type: [String],
            default: [],
        },

        weaknesses: {
            type: [String],
            default: [],
        },

        recommendations: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: ["created", "in-progress", "completed",],
            default: "created",
        },
        summary: {
             type: String, 
             default: "" 
        },

    },
    {
        timestamps: true,
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
