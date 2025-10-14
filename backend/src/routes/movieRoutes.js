// S1-R31: KMDb API 데이터 수집 라우터
import express from 'express';
import { importMovies } from '../controllers/movieController.js';

const router = express.Router();
router.get('/', importMovies);

export default router;
