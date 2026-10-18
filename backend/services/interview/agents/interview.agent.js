
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../config/llm.js";

import technicalInterviewPrompt from "../prompts/technicalinterviewPrompt.js";
import hrInterviewPrompt from "../prompts/hrinterviewPrompt.js";

// Convert the model response into a string.
// LangChain models can return either a string or content blocks.
const getResponseText = (response) => {
    const content = response?.content;

    if (typeof content === "string") {
        return content.trim();
    }

    if (Array.isArray(content)) {
        return content
            .filter((block) => block?.type === "text")
            .map((block) => block.text ?? "")
            .join("\n")
            .trim();
    }

    throw new Error("The AI returned an unsupported response format.");
};

// Parse JSON, including responses wrapped in Markdown code fences.
const parseJSONResponse = (response) => {
    const content = getResponseText(response);

    if (!content) {
        throw new Error("The AI returned an empty response.");
    }

    // Remove optional Markdown JSON fences.
    const cleaned = content
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        // Some models add a short explanation around the JSON.
        // Extract the first JSON array if possible.
        const start = cleaned.indexOf("[");
        const end = cleaned.lastIndexOf("]");

        if (start !== -1 && end > start) {
            try {
                return JSON.parse(cleaned.slice(start, end + 1));
            } catch {
                // Fall through to the descriptive error below.
            }
        }

        throw new Error("The AI returned invalid JSON for interview questions.");
    }
};

// Expected difficulty order for each interview type.
const getExpectedDifficulties = (type) => {
    if (type === "technical") {
        return ["easy", "easy", "medium", "hard", "medium", "hard"];
    }

    return ["easy", "easy", "medium", "medium", "hard", "hard"];
};

// Validate and normalize the generated questions.
const validateQuestions = (questions, type) => {
    if (!Array.isArray(questions) || questions.length !== 6) {
        throw new Error(
            `Expected 6 interview questions, received ${Array.isArray(questions) ? questions.length : "an invalid response"
            }.`
        );
    }

    const expectedDifficulties = getExpectedDifficulties(type);

    return questions.map((item, index) => {
        if (
            !item ||
            typeof item.question !== "string" ||
            !item.question.trim()
        ) {
            throw new Error(`Question ${index + 1} has invalid question text.`);
        }

        if (item.difficulty !== expectedDifficulties[index]) {
            throw new Error(
                `Question ${index + 1} must have difficulty "${expectedDifficulties[index]}".`
            );
        }

        // Normalize numeric timers in case the model returns them as strings.
        const timer = Number(item.timer);

        if (!Number.isInteger(timer) || timer < 60) {
            throw new Error(
                `Question ${index + 1} must have a timer of at least 60 seconds.`
            );
        }

        return {
            question: item.question.trim(),
            difficulty: item.difficulty,
            timer,
        };
    });
};

// Generate six interview questions for the selected role.
export const generateInterviewQuestions = async ({
    type,
    role,
    useResume = false,
    resume = null,
}) => {
    if (!["hr", "technical"].includes(type)) {
        throw new Error('Interview type must be "hr" or "technical".');
    }

    if (typeof role !== "string" || !role.trim()) {
        throw new Error("A valid candidate role is required.");
    }

    if (typeof useResume !== "boolean") {
        throw new Error("useResume must be a boolean.");
    }

    if (useResume && !resume) {
        throw new Error(
            "Resume-based questions were requested, but no resume was provided."
        );
    }

    const promptData = {
        role: role.trim(),
        useResume,
        resume: useResume ? resume : null,
    };

    // Select the prompt matching the requested interview type.
    const prompt =
        type === "technical"
            ? technicalInterviewPrompt(promptData)
            : hrInterviewPrompt(promptData);

    const response = await llm.invoke([
        new SystemMessage(`
You are an expert interviewer.

Return ONLY a valid JSON array containing exactly 6 question objects.
Do not use Markdown fences or add explanatory text.

Each object must contain:
- "question": a non-empty string
- "difficulty": the exact difficulty required by the prompt
- "timer": an integer representing seconds, at least 60

Follow the interview type, role, resume instructions, and question order
specified in the user prompt. Do not omit any required fields.
        `.trim()),
        new HumanMessage(prompt),
    ]);

    const parsedQuestions = parseJSONResponse(response);

    // Reject malformed output before it reaches the graph or database.
    const questions = validateQuestions(parsedQuestions, type);

    console.log(
        `Successfully generated ${questions.length} ${type} interview questions for "${role.trim()}".`
    );

    return questions;
};

export default generateInterviewQuestions;
