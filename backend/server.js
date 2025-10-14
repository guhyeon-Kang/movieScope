import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './src/routes/movieRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js'; // ← 이미 있을 수 있음

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 여기서 movieRoutes 연결
app.use('/api/import', movieRoutes);
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ MovieScope Backend running on port ${PORT}`);
});
