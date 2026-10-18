import express from "express";
import { getCareerPath, getCareerPaths } from "../controllers/roadmap.controller.js";

const roadmapRouter = express.Router();

roadmapRouter.get("/", getCareerPaths);
roadmapRouter.get("/:careerId", getCareerPath);

export default roadmapRouter;
