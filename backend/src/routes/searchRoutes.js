// ✅ 검색 라우터
import express from 'express';
import { searchMovies } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search?query=감동적인 영화
router.get('/search', searchMovies);

export default router;
