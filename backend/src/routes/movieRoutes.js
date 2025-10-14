// 영화 관련 라우터
import express from 'express';
import { importMovies, getMovieById } from '../controllers/movieController.js';

const router = express.Router();

// GET /api/movies - 영화 데이터 수집 (KMDb API)
router.get('/', importMovies);

// GET /api/movies/:id - 영화 상세 조회
router.get('/:id', getMovieById);

export default router;
