import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../config/llm.js";
import summaryPrompt from "../prompts/summaryPrompt.js";

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

export const generateInterviewSummary = async ({
    type,
    role,
    questions,
}) => {
    if (!["hr", "technical"].includes(type)) {
        throw new Error("Interview type must be hr or technical.");
    }

    if (typeof role !== "string" || !role.trim()) {
        throw new Error("Candidate role is required.");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Interview questions and answers are required.");
    }

    const prompt = summaryPrompt({
        type,
        role,
        questions,
    });

    const response = await llm.invoke([
        new SystemMessage(
            "Generate an evidence-based interview report. Return only valid JSON."
        ),
        new HumanMessage(prompt),
    ]);

    const report = parseJSONResponse(response);

    if (
        !Number.isInteger(report.overallScore) ||
        report.overallScore < 0 ||
        report.overallScore > 100 ||
        typeof report.summary !== "string" ||
        !Array.isArray(report.strengths) ||
        report.strengths.length < 3 ||
        report.strengths.length > 5 ||
        !Array.isArray(report.weaknesses) ||
        report.weaknesses.length < 3 ||
        report.weaknesses.length > 5 ||
        !Array.isArray(report.recommendations) ||
        report.recommendations.length !== 5
    ) {
        throw new Error("Invalid interview summary response.");
    }

    return {
        overallScore: report.overallScore,
        summary: report.summary,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations,
    };
};

export default generateInterviewSummary;