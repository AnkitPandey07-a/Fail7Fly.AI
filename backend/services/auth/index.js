import express from "express";
import "dotenv/config";
import { connectDB } from "./configs/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json())
app.use(cookieParser())


const PORT = process.env.PORT || 6000;

app.get("/", (reg, res) =>{
    res.send("hello from Auth Service");
})



// use krenge router ko
app.use("/",authRouter)


async function startServer() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Auth service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Auth Service:", error.message);
    process.exit(1);
  }
}

startServer();