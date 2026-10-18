import express from "express";

import {
    getInterviewStatus,
    createInterview,
    getMyInterviews,
    getInterviewById,
    submitAnswer,
    saveQuestionFeedback,
    completeInterview,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.get("/", getInterviewStatus);
interviewRouter.post("/start", createInterview);
interviewRouter.get("/my", getMyInterviews);
interviewRouter.get("/:interviewId", getInterviewById);
interviewRouter.post("/:interviewId/answer", submitAnswer);
interviewRouter.patch("/:interviewId/feedback", saveQuestionFeedback);
interviewRouter.post("/:interviewId/complete", completeInterview);

export default interviewRouter;