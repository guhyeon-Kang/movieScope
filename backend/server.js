import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './src/routes/movieRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// S1-B03 영화관리: 데이터 수집
app.use('/api/movies', movieRoutes);

app.listen(5000, () => console.log('✅ MovieScope Backend running on port 5000'));
