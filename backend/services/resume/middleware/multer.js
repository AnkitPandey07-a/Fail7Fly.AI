
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// File: backend/services/resume/config/upload.js
// Purpose: Accept PDF uploads and save them temporarily.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    // Do not use the original filename as the stored filename.
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.pdf`;

    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" &&
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (!isPdf) {
    const error = new Error("Only PDF files are allowed.");
    error.status = 400;
    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export default upload;
