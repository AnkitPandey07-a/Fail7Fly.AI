
import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

// File: backend/services/resume/config/llm.js
// Purpose: Configure the Groq model used by the Resume AI Agent.

if (!process.env.GROQ_API_KEY) {
    throw new Error(
        "GROQ_API_KEY is missing. Add it to the backend environment."
    );
}

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    maxTokens: 5000,
    maxRetries: 3,
});

export default llm;
