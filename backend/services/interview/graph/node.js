
import { generateInterviewQuestions } from "../agents/interview.agent.js";
import { generateFeedback } from "../agents/feedback.agent.js";
import { generateInterviewSummary } from "../agents/summary.agent.js";

// Node 1: Generate and validate interview questions.
export const interviewNode = async (state) => {
    try {
        // Ask the AI agent to generate questions for the selected role.
        const generatedQuestions = await generateInterviewQuestions({
            type: state.type,
            role: state.role,
            useResume: state.useResume,
            resume: state.resume,
        });

        // An empty response must be treated as a generation failure.
        if (
            !Array.isArray(generatedQuestions) ||
            generatedQuestions.length === 0
        ) {
            throw new Error(
                "The AI agent did not generate any interview questions."
            );
        }

        // Normalize each question so the rest of the application
        // receives a consistent data structure.
        const questions = generatedQuestions.map((item, index) => {
            // Reject invalid entries instead of saving broken questions.
            if (
                !item ||
                typeof item.question !== "string" ||
                !item.question.trim()
            ) {
                throw new Error(
                    `Generated question ${index + 1} is invalid.`
                );
            }

            const allowedDifficulties = ["easy", "medium", "hard"];
            const difficulty = allowedDifficulties.includes(
                item.difficulty
            )
                ? item.difficulty
                : "easy";

            return {
                question: item.question.trim(),
                difficulty,
                // Keep the timer if the agent generated one.
                ...(Number.isFinite(Number(item.timer)) &&
                    Number(item.timer) > 0
                    ? { timer: Number(item.timer) }
                    : {}),
            };
        });

        // Return the generated questions and initialize the first question.
        return {
            questions,
            currentQuestion: 0,
            question: questions[0].question,
            difficulty: questions[0].difficulty,
            answer: "",
            feedback: null,
            completed: false,
            error: null,
        };
    } catch (error) {
        console.error("Interview question generation failed:", error);

        return {
            questions: [],
            error:
                error.message ||
                "Failed to generate interview questions.",
        };
    }
};

// Node 2: Evaluate the submitted answer.
export const feedbackNode = async (state) => {
    try {
        const index = state.currentQuestion;
        const questions = [...state.questions];

        if (index < 0 || index >= questions.length) {
            throw new Error("Invalid current question index.");
        }

        if (typeof state.answer !== "string" || !state.answer.trim()) {
            throw new Error(
                "Please submit an answer before requesting feedback."
            );
        }

        const currentQuestion = {
            ...questions[index],
            userAnswer: state.answer.trim(),
        };

        // Generate AI feedback for the current answer.
        const feedback = await generateFeedback({
            question: currentQuestion.question,
            answer: currentQuestion.userAnswer,
            difficulty: currentQuestion.difficulty,
        });

        questions[index] = {
            ...currentQuestion,
            feedback,
        };

        const completed = index >= questions.length - 1;
        const nextIndex = completed ? index : index + 1;
        const nextQuestion = questions[nextIndex];

        return {
            questions,
            feedback,
            completed,
            currentQuestion: completed ? index : index + 1,
            question: completed ? "" : nextQuestion.question,
            answer: "",
            difficulty: completed
                ? currentQuestion.difficulty
                : nextQuestion.difficulty,
            error: null,
        };
    } catch (error) {
        console.error("Answer feedback generation failed:", error);

        return {
            error: error.message || "Failed to evaluate the answer.",
        };
    }
};

// Node 3: Generate the final interview report.
export const summaryNode = async (state) => {
    try {
        const report = await generateInterviewSummary({
            type: state.type,
            role: state.role,
            questions: state.questions,
        });

        return {
            overallScore: report.overallScore,
            summary: report.summary,
            strengths: report.strengths,
            weaknesses: report.weaknesses,
            recommendations: report.recommendations,
            completed: true,
            error: null,
        };
    } catch (error) {
        console.error("Interview summary generation failed:", error);

        return {
            error: error.message || "Failed to generate the interview summary.",
        };
    }
};
