import express from 'express';
import { getHomeContent, updateHomeContent } from '../controllers/homeController.js';

const router = express.Router();
router.get('/', getHomeContent);
router.put('/', updateHomeContent);
router.post('/', updateHomeContent);

export default router;
