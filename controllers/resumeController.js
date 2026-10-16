import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDatabase, writeDatabase } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const getResume = (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.resumeFile || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResume = (req, res) => {
  try {
    const db = readDatabase();

    // Check if uploaded via multer multipart
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;
      const resumeFile = {
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      };

      writeDatabase({ ...db, resumeFile });
      return res.status(201).json({
        success: true,
        data: resumeFile,
        message: 'Resume PDF uploaded successfully'
      });
    }

    // Or check if uploaded as JSON base64 / dataUrl
    if (req.body && req.body.dataUrl) {
      const { name, size, dataUrl } = req.body;
      const filename = `resume-${Date.now()}.pdf`;
      const filePath = path.join(UPLOADS_DIR, filename);

      const base64Data = dataUrl.replace(/^data:application\/pdf;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      const resumeFile = {
        name: name || 'resume.pdf',
        filename,
        size: size || fs.statSync(filePath).size,
        url: `/uploads/${filename}`,
        dataUrl,
        uploadedAt: new Date().toISOString()
      };

      writeDatabase({ ...db, resumeFile });
      return res.status(201).json({
        success: true,
        data: resumeFile,
        message: 'Resume PDF saved successfully'
      });
    }

    res.status(400).json({ success: false, message: 'No resume file provided' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = (req, res) => {
  try {
    const db = readDatabase();
    if (db.resumeFile && db.resumeFile.filename) {
      const filePath = path.join(UPLOADS_DIR, db.resumeFile.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not remove resume file:', e.message);
        }
      }
    }

    writeDatabase({ ...db, resumeFile: null });
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
