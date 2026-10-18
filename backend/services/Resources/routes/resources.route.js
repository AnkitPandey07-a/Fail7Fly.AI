import express from "express";
import {
    getCareerResources,
    getResourcesForCareer,
} from "../controllers/resources.controller.js";

const resourcesRouter = express.Router();

resourcesRouter.get("/", getCareerResources);
resourcesRouter.get("/:careerId", getResourcesForCareer);

export default resourcesRouter;
