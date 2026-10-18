
import { Annotation } from "@langchain/langgraph";

export const InterviewState = Annotation.Root({
    // Determines which workflow branch should execute.
    action: Annotation({
        reducer: (_, next) => next,
        default: () => "start",
    }),

    // Interview configuration.
    type: Annotation({
        reducer: (_, next) => next,
        default: () => "technical",
    }),

    role: Annotation({
        reducer: (_, next) => next,
        default: () => "",
    }),

    useResume: Annotation({
        reducer: (_, next) => next,
        default: () => false,
    }),

    resume: Annotation({
        reducer: (_, next) => next,
        default: () => null,
    }),

    // Complete list of generated interview questions and answers.
    questions: Annotation({
        reducer: (_, next) => next,
        default: () => [],
    }),

    // Index of the current question.
    currentQuestion: Annotation({
        reducer: (_, next) => next,
        default: () => 0,
    }),

    // Current question and submitted answer.
    question: Annotation({
        reducer: (_, next) => next,
        default: () => "",
    }),

    answer: Annotation({
        reducer: (_, next) => next,
        default: () => "",
    }),

    difficulty: Annotation({
        reducer: (_, next) => next,
        default: () => "easy",
    }),

    // Feedback generated for an answer.
    feedback: Annotation({
        reducer: (_, next) => next,
        default: () => null,
    }),

    // Final report fields.
    overallScore: Annotation({
        reducer: (_, next) => next,
        default: () => 0,
    }),

    summary: Annotation({
        reducer: (_, next) => next,
        default: () => "",
    }),

    strengths: Annotation({
        reducer: (_, next) => next,
        default: () => [],
    }),

    weaknesses: Annotation({
        reducer: (_, next) => next,
        default: () => [],
    }),

    recommendations: Annotation({
        reducer: (_, next) => next,
        default: () => [],
    }),

    // Error information returned by a failed node.
    error: Annotation({
        reducer: (_, next) => next,
        default: () => null,
    }),

    // True when the complete interview has finished.
    completed: Annotation({
        reducer: (_, next) => next,
        default: () => false,
    }),
});
