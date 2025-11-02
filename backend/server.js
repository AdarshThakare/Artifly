import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import webhookRoute from "./routes/webhookRoute.js";
import socialPostRoute from "./routes/socialPostRoute.js";
import userRoute from "./routes/userRoute.js";
import transcriptionRoute from "./routes/transcriptionRoute.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ type: "audio/webm", limit: "10mb" }));

app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/v1/webhook", webhookRoute);
app.use("/api/v1/post", socialPostRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/transcribe", transcriptionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
