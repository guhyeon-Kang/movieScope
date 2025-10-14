import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './src/routes/movieRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

dotenv.config();
const app = express();

// CORS 설정 강화
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 테스트 엔드포인트
app.get('/api/test', (req, res) => {
    res.json({ message: 'MovieScope API is working!', timestamp: new Date().toISOString() });
});

// S1-B03 영화관리: 데이터 수집
app.use('/api/movies', movieRoutes);

// S1-R33 자연어 기반 영화 검색
app.use('/api', searchRoutes);

// 사용자 인증 관련 API
app.use('/api/users', userRoutes);

// 관리자 API
app.use('/api/admin', adminRoutes);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ MovieScope Backend running on port ${PORT}`);
});