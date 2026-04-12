import express from "express";
import multer from "multer";
import * as dotenv from "dotenv";
dotenv.config();

import { uploadResume, replaceResume, analyzeResume } from "./routes/resumeRoutes.js";

const app = express();
app.use(express.json());

// multer keeps uploaded files in memory as req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.post("/upload-resume", upload.single("file"), uploadResume);
app.post("/replace-resume", upload.single("file"), replaceResume);
app.post("/analyze-resume", analyzeResume);

app.get("/", (req, res) => {
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
