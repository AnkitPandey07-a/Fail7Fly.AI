
import mongoose from "mongoose";

// File: backend/services/resume/models/resume.model.js
// Purpose: Define the structure of analyzed resumes stored in MongoDB.

const projectSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: { type: [String], default: [] },
    },
    { _id: false }
);

const educationSchema = new mongoose.Schema(
    {
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        institution: { type: String, default: "" },
        location: { type: String, default: "" },
        startYear: { type: Number, default: null },
        endYear: { type: Number, default: null },
        cgpa: { type: Number, default: null },
        percentage: { type: Number, default: null },
        level: { type: String, default: "" },
        coursework: { type: [String], default: [] },
    },
    { _id: false }
);

const experienceSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        description: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
    },
    { _id: false }
);

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
            ref: "User",
        },

        // Selected role used for the latest analysis.
        jobRole: {
            type: String,
            default: "Full Stack Developer",
            trim: true,
        },

        suggestedRole: {
            type: String,
            default: "",
        },

        // Original extracted text used for analysis.
        extractedText: {
            type: String,
            required: true,
        },

        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        summary: { type: String, default: "" },

        skills: {
            type: [String],
            default: [],
        },

        achievements: {
            type: [String],
            default: [],
        },

        strengths: {
            type: [String],
            default: [],
        },

        weaknesses: {
            type: [String],
            default: [],
        },

        missingSkills: {
            type: [String],
            default: [],
        },

        recommendations: {
            type: [String],
            default: [],
        },

        projects: {
            type: [projectSchema],
            default: [],
        },

        education: {
            type: [educationSchema],
            default: [],
        },

        experience: {
            type: [experienceSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
