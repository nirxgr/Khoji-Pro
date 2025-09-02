import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import updateRouter from "./routes/updateRoutes.js";
import experienceRouter from "./routes/experienceRoutes.js";
import educationRouter from "./routes/educationRoutes.js";
import skillRouter from "./routes/skillRoutes.js";
import favoritesRouter from "./routes/favoritesRoutes.js";
import professionRouter from "./routes/professionRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());

//helps read json data
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/update", updateRouter);
app.use("/api/exp", experienceRouter);
app.use("/api/edu", educationRouter);
app.use("/api/sk", skillRouter);
app.use("/api/fav", favoritesRouter);
app.use("/api/prof", professionRouter);

//Routes
app.get("/", (req, res) => {
  res.send("This is the landing page.");
});

export default app;
