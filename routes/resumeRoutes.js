import express from 'express';
import multer from 'multer';
import path from 'path';
import { UPLOADS_DIR } from '../config/db.js';
import { getResume, uploadResume, deleteResume } from '../controllers/resumeController.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `resume-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

const router = express.Router();
router.get('/', getResume);
router.post('/upload', upload.single('resume'), uploadResume);
router.post('/', uploadResume);
router.delete('/', deleteResume);

export default router;
