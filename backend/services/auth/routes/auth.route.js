import express from "express";
import { GoogleAuth, logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// 
authRouter.post("/login",GoogleAuth);


//http://localhost:8000/api/auth/login
// 
authRouter.get("/logout",logout);

export default authRouter;