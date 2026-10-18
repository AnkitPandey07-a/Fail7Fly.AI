
import { StateGraph, START, END } from "@langchain/langgraph";
import { InterviewState } from "./state.js";

import {
    interviewNode,
    feedbackNode,
    summaryNode,
} from "./node.js";

// Decide which node should run first.
const actionRouter = (state) => {
    if (state.error) return "end";

    switch (state.action) {
        case "start":
            return "interview_node";

        case "feedback":
            return "feedback_node";

        default:
            return "end";
    }
};

// Stop the graph if question generation failed.
const interviewRouter = (state) => {
    if (state.error || !state.questions?.length) {
        return "end";
    }

    return "end";
};

// After evaluating an answer, generate a report only
// when all interview questions have been answered.
const feedbackRouter = (state) => {
    if (state.error) return "end";

    return state.completed ? "summary_node" : "end";
};

// Build the interview workflow.
const workflow = new StateGraph(InterviewState)
    .addNode("interview_node", interviewNode)
    .addNode("feedback_node", feedbackNode)
    .addNode("summary_node", summaryNode)

    .addConditionalEdges(START, actionRouter, {
        interview_node: "interview_node",
        feedback_node: "feedback_node",
        end: END,
    })

    .addConditionalEdges("interview_node", interviewRouter, {
        end: END,
    })

    .addConditionalEdges("feedback_node", feedbackRouter, {
        summary_node: "summary_node",
        end: END,
    })

    .addEdge("summary_node", END);

export const interviewGraph = workflow.compile();

export default interviewGraph;
