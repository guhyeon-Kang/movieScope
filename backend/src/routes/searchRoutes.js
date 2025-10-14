import express from 'express';
import { searchMovies } from '../controllers/searchController.js';

const router = express.Router();
router.post('/', searchMovies);
export default router;
