import express from "express";
import multer from "multer";
import * as dotenv from "dotenv";
dotenv.config();

import { uploadResume, replaceResume, analyzeResume } from "./routes/resumeRoutes.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
app.use(express.json());

// multer keeps uploaded files in memory as req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Routes — authMiddleware runs first (reads header only, fast),
// then multer parses the multipart body, then the handler runs.
// If auth fails, multer never runs and no file buffer is allocated.
app.post("/upload-resume",  authMiddleware, upload.single("file"), uploadResume);
app.post("/replace-resume", authMiddleware, upload.single("file"), replaceResume);
app.post("/analyze-resume", authMiddleware, analyzeResume);

app.get("/", (_req, res) => {
  res.json({
    app: "ResumeIQ",
    status: "running",
    routes: ["POST /upload-resume", "POST /replace-resume", "POST /analyze-resume"],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
