
import express from "express";
import upload from "../middleware/multer.js";

import {
    getResume,
    uploadResume,
} from "../controllers/resume.controller.js";

import {
    deductInterviewCoin,
} from "../middleware/deductinterviewCoin.js";

const resumeRouter = express.Router();

resumeRouter.post(
    "/upload",
    upload.single("resume"),
    deductInterviewCoin,
    uploadResume
);

resumeRouter.get("/get-resume", getResume);

export default resumeRouter;
