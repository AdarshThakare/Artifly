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
import speech from "@google-cloud/speech";
import multer from "multer";
import fs from "fs";

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

const upload = multer({ dest: "uploads/" });

const client = new speech.SpeechClient({
  keyFilename: "./google-credentials.json",
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const audioBytes = fs.readFileSync(filePath).toString("base64");

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: "WEBM_OPUS", // or "LINEAR16" if PCM WAV
      sampleRateHertz: 48000,
      languageCode: "en-IN", // Indian English
      enableAutomaticPunctuation: true,
    };

    const [response] = await client.recognize({ audio, config });
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    fs.unlinkSync(filePath); // clean up
    res.json({ success: true, transcript: transcription });
  } catch (error) {
    console.error("Error in transcription:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use("/api/v1/webhook", webhookRoute);
app.use("/api/v1/post", socialPostRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/transcribe", transcriptionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
