import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../config/llm.js";
import feedbackPrompt from "../prompts/feedbackPrompt.js";

const parseJSONResponse = (response) => {
    const content = response?.content;

    if (typeof content !== "string") {
        throw new Error("LLM returned an invalid response format.");
    }

    const cleaned = content
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");

    try {
        return JSON.parse(cleaned);
    } catch {
        throw new Error("LLM returned invalid JSON.");
    }
};

export const generateFeedback = async ({
    question,
    answer,
    difficulty,
}) => {
    if (typeof question !== "string" || !question.trim()) {
        throw new Error("Interview question is required.");
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
        throw new Error("Invalid question difficulty.");
    }

    const prompt = feedbackPrompt({
        question,
        answer: answer ?? "",
        difficulty,
    });

    const response = await llm.invoke([
        new SystemMessage(
            "Evaluate the answer fairly. Return only valid JSON."
        ),
        new HumanMessage(prompt),
    ]);

    const feedback = parseJSONResponse(response);

    const scoreFields = [
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

    for (const field of scoreFields) {
        if (
            !Number.isInteger(feedback[field]) ||
            feedback[field] < 0 ||
            feedback[field] > 100
        ) {
            throw new Error(`Invalid feedback score: ${field}`);
        }
    }

    if (
        typeof feedback.feedback !== "string" ||
        !Array.isArray(feedback.improvements) ||
        feedback.improvements.length !== 3 ||
        !feedback.improvements.every(
            (item) => typeof item === "string"
        )
    ) {
        throw new Error("Invalid feedback response.");
    }

    return feedback;
};

export default generateFeedback;