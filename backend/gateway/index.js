import express from "express";
import "dotenv/config";
import proxy from "express-http-proxy";
import cors from "cors"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { isAuth } from "./middleware/isAuth.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";

const app = express();
app.use(express.json())

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(morgan("dev"))
app.use(cookieParser())

const PORT = process.env.PORT || 8000;

app.get("/", (reg, res) =>{
    res.send("hello from Gateway");
})

// yeha hum proxy ka use karenge auth service ke liye
app.use("/api/auth", proxy(process.env.Auth_SERVICE_URL));

// yeha hum interview walal kaam kr rhe h
app.use("/api/interview", isAuth, proxyWithHeaders(process.env.Interview_SERVICE_URL));


// yeha hum proxy ka use karenge resume service ke liye aur isAuth middleware ka use karenge user ko authenticate karne ke liye
app.use(
  "/api/resume",
  isAuth,
  proxyWithHeaders(process.env.Resume_SERVICE_URL, { limit: "21mb" })
);

app.use(
  "/api/roadmap",
  isAuth,
  proxyWithHeaders(
    process.env.Roadmap_SERVICE_URL || "http://localhost:8009"
  )
);

app.use(
  "/api/resources",
  isAuth,
  proxyWithHeaders(
    process.env.Resources_SERVICE_URL || "http://localhost:8001"
  )
);


// yeha hum isAuth middleware ka use karenge getCurrentUser ke liye session ko validate karne ke liye aur agar session valid hai toh user ko access denge
app.get("/api/me",isAuth,getCurrentUser);


app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});
app









//    Interview Controller
//          |
//          v
//     graph.invoke(state)
//            |
//            v
//         LangGraph
//           |
//  +--------------------- +
//   |                     |
//  action = start        action = feedback
//      |                     |
//      v                     v
// Interview Node         Feedback Node
//  |                     |
//  v                     v
// Interview Agent        Feedback Agent
//  |                     |
//  v                     v
//     Groq LLM              Groq LLM
//  |                     |
//  v                     v
//  Questions JSON         Feedback JSON