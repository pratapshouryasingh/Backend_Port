import express from 'express';
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experienceController.js';

const router = express.Router();
router.get('/', getExperiences);
router.post('/', addExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
