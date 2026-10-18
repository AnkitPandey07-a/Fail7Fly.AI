
import mongoose from "mongoose";
import Interview from "../models/interview.model.js";
import interviewGraph from "../graph/graph.js";
const MAX_QUESTIONS = 20;

export const getInterviewStatus = async (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Interview API is working",
    });
};


const isValidObjectId = (id) =>
    mongoose.Types.ObjectId.isValid(id);

const normalizeFeedback = (feedback = {}) => ({
    score: Number(feedback.score ?? 0),
    correctness: Number(feedback.correctness ?? 0),
    clarity: Number(feedback.clarity ?? 0),
    relevance: Number(feedback.relevance ?? 0),
    detail: Number(feedback.detail ?? 0),
    efficiency: Number(feedback.efficiency ?? 0),
    communication: Number(feedback.communication ?? 0),
    problemSolving: Number(feedback.problemSolving ?? 0),
    creativity: Number(feedback.creativity ?? 0),
    feedback: String(feedback.feedback ?? ""),
    improvements: Array.isArray(feedback.improvements)
        ? feedback.improvements.map(String)
        : [],
});

const validateFeedback = (feedback) => {
    const scores = [
        "score",
        "correctness",
        "clarity",
        "relevance",
        "detail",
        "efficiency",
        "communication",
        "problemSolving",
        "creativity",
    ];

    for (const key of scores) {
        const value = Number(feedback[key] ?? 0);

        if (!Number.isFinite(value) || value < 0 || value > 100) {
            return `${key} must be between 0 and 100.`;
        }
    }

    return null;
};

// Create a new interview.

export const createInterview = async (req, res) => {
    try {
        // The authentication middleware must set req.userId.
        const userId = req.userId;

        if (!userId || !isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        const {
            type,
            role,
            useResume = false,
        } = req.body ?? {};

        // Validate interview type.
        if (!["hr", "technical"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Interview type must be "hr" or "technical".',
            });
        }

        // Validate the job role.
        if (
            typeof role !== "string" ||
            !role.trim() ||
            role.trim().length > 200
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid job role is required.",
            });
        }

        if (typeof useResume !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "useResume must be true or false.",
            });
        }

        const storedResume = useResume
            ? await mongoose.connection.collection("resumes").findOne(
                { userId: new mongoose.Types.ObjectId(userId) },
                {
                    projection: {
                        summary: 1,
                        skills: 1,
                        projects: 1,
                        strengths: 1,
                        weaknesses: 1,
                        missingSkills: 1,
                        recommendations: 1,
                    },
                }
            )
            : null;

        if (useResume && !storedResume) {
            return res.status(404).json({
                success: false,
                message: "Upload a resume before starting a resume-based interview.",
            });
        }

        const resume = storedResume
            ? {
                ...storedResume,
                projects: (storedResume.projects ?? []).map((project) =>
                    [
                        project.name,
                        project.description,
                        project.technologies?.join(", "),
                    ]
                        .filter(Boolean)
                        .join(": ")
                ),
            }
            : null;

        // Generate questions using LangGraph; never trust frontend question data.
        const graphResult = await interviewGraph.invoke({
            action: "start",
            type,
            role: role.trim(),
            useResume,
            resume,
            questions: [],
            currentQuestion: 0,
        });

        // Surface graph/LLM failures instead of saving an empty interview.
        if (graphResult.error) {
            console.error(
                "Interview graph error:",
                graphResult.error
            );

            return res.status(502).json({
                success: false,
                message: "AI could not generate interview questions.",
                error: graphResult.error,
            });
        }

        const generatedQuestions = graphResult.questions;

        if (
            !Array.isArray(generatedQuestions) ||
            generatedQuestions.length !== 6
        ) {
            console.error(
                "Invalid graph result:",
                graphResult
            );

            return res.status(502).json({
                success: false,
                message:
                    "AI did not return the required six interview questions.",
            });
        }

        // Validate and normalize the questions before database persistence.
        const normalizedQuestions = generatedQuestions.map(
            (item, index) => {
                if (
                    !item ||
                    typeof item.question !== "string" ||
                    !item.question.trim()
                ) {
                    throw new Error(
                        `Generated question ${index + 1} is invalid.`
                    );
                }

                return {
                    question: item.question.trim(),
                    difficulty: item.difficulty,
                    timer: item.timer,
                };
            }
        );

        // Save the generated questions, not an empty request array.
        const interview = await Interview.create({
            userId,
            type,
            role: role.trim(),
            useResume,
            questions: normalizedQuestions,
            currentQuestion: 0,
            status: "created",
        });

        return res.status(201).json({
            success: true,
            message: "Interview created successfully.",
            data: interview,
        });
    } catch (error) {
        console.error("Create interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create interview.",
            error: error.message,
        });
    }
};


// Get all interviews belonging to the logged-in user.
export const getMyInterviews = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId || !isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        const interviews = await Interview.find({ userId })
            .select("-questions.userAnswer")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews,
        });
    } catch (error) {
        console.error("Get interviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch interviews.",
        });
    }
};

// Get one interview owned by the logged-in user.
export const getInterviewById = async (req, res) => {
    try {
        const userId = req.userId;
        const { interviewId } = req.params;

        if (!userId || !isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        if (!isValidObjectId(interviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview ID.",
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            userId,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: interview,
        });
    } catch (error) {
        console.error("Get interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch interview.",
        });
    }
};

// Save an answer for a question.
export const submitAnswer = async (req, res) => {
    try {
        const userId = req.userId;
        const { interviewId } = req.params;
        const { questionIndex, answer } = req.body ?? {};

        if (!userId || !isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        if (!isValidObjectId(interviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview ID.",
            });
        }

        if (
            !Number.isInteger(questionIndex) ||
            questionIndex < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid questionIndex is required.",
            });
        }

        if (typeof answer !== "string" || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: "Answer cannot be empty.",
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            userId,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found.",
            });
        }

        if (
            interview.status === "completed" ||
            interview.status === "cancelled"
        ) {
            return res.status(409).json({
                success: false,
                message: "This interview is no longer active.",
            });
        }

        if (questionIndex >= interview.questions.length) {
            return res.status(400).json({
                success: false,
                message: "Question index is out of range.",
            });
        }

        const graphResult = await interviewGraph.invoke({
            action: "feedback",
            type: interview.type,
            role: interview.role,
            questions: interview.questions.map((question) =>
                question.toObject()
            ),
            currentQuestion: questionIndex,
            answer: answer.trim(),
        });

        if (
            graphResult.error ||
            !graphResult.feedback ||
            !Array.isArray(graphResult.questions)
        ) {
            console.error(
                "Interview feedback graph error:",
                graphResult.error || "Invalid graph response."
            );

            return res.status(502).json({
                success: false,
                message: "AI could not evaluate this answer. Please try again.",
            });
        }

        interview.questions[questionIndex].userAnswer = answer.trim();
        interview.questions[questionIndex].feedback = graphResult.feedback;
        interview.currentQuestion = graphResult.currentQuestion;

        const completed = graphResult.completed === true;
        interview.status = completed ? "completed" : "in-progress";

        if (completed) {
            interview.overallScore = graphResult.overallScore;
            interview.summary = graphResult.summary;
            interview.strengths = graphResult.strengths;
            interview.weaknesses = graphResult.weaknesses;
            interview.recommendations = graphResult.recommendations;
        }

        await interview.save();

        return res.status(200).json({
            success: true,
            message: completed
                ? "Interview completed successfully."
                : "Answer evaluated successfully.",
            data: {
                interview,
                interviewId: interview._id,
                currentQuestion: interview.currentQuestion,
                questionIndex,
                feedback: interview.questions[questionIndex].feedback,
                completed,
                report: completed
                    ? {
                        overallScore: interview.overallScore,
                        summary: interview.summary,
                        strengths: interview.strengths,
                        weaknesses: interview.weaknesses,
                        recommendations: interview.recommendations,
                    }
                    : null,
            },
        });
    } catch (error) {
        console.error("Submit answer error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save answer.",
        });
    }
};

// Save feedback for one question.
// This endpoint should only be called by a trusted evaluator/backend.
export const saveQuestionFeedback = async (req, res) => {
    try {
        const userId = req.userId;
        const { interviewId } = req.params;
        const { questionIndex, feedback } = req.body ?? {};

        if (!userId || !isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        if (!isValidObjectId(interviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview ID.",
            });
        }

        if (
            !Number.isInteger(questionIndex) ||
            questionIndex < 0 ||
            !feedback ||
            typeof feedback !== "object" ||
            Array.isArray(feedback)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid questionIndex and feedback are required.",
            });
        }

        const normalized = normalizeFeedback(feedback);
        const validationError = validateFeedback(normalized);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            userId,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found.",
            });
        }

        if (questionIndex >= interview.questions.length) {
            return res.status(400).json({
                success: false,
                message: "Question index is out of range.",
            });
        }

        interview.questions[questionIndex].feedback = normalized;

        await interview.save();

        return res.status(200).json({
            success: true,
            message: "Question feedback saved.",
            data: interview.questions[questionIndex].feedback,
        });
    } catch (error) {
        console.error("Save feedback error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save question feedback.",
        });
    }
};

// Complete an interview and calculate its average question score.
export const completeInterview = async (req, res) => {
    try {
        const userId = req.userId;
        const { interviewId } = req.params;

        if (!userId || !isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        if (!isValidObjectId(interviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview ID.",
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            userId,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found.",
            });
        }

        if (interview.status === "completed") {
            return res.status(200).json({
                success: true,
                message: "Interview is already completed.",
                data: interview,
            });
        }

        if (interview.status === "cancelled") {
            return res.status(409).json({
                success: false,
                message: "Cancelled interviews cannot be completed.",
            });
        }

        if (interview.questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Add interview questions before completing.",
            });
        }

        const answeredQuestions = interview.questions.filter(
            (item) => item.userAnswer.trim().length > 0
        );

        if (answeredQuestions.length !== interview.questions.length) {
            return res.status(400).json({
                success: false,
                message: "Please answer every question before completing.",
                answered: answeredQuestions.length,
                total: interview.questions.length,
            });
        }

        const scores = interview.questions.map(
            (item) => item.feedback.score
        );

        interview.overallScore = Math.round(
            scores.reduce((total, score) => total + score, 0) /
            scores.length
        );

        interview.status = "completed";
        interview.currentQuestion = interview.questions.length;

        await interview.save();

        return res.status(200).json({
            success: true,
            message: "Interview completed successfully.",
            data: interview,
        });
    } catch (error) {
        console.error("Complete interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to complete interview.",
        });
    }
};
