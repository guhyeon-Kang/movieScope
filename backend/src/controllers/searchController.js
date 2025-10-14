// ✅ 자연어 검색 컨트롤러 (Qdrant 1.15.5 대응)
import { createEmbedding } from '../utils/embedding.js';
import axios from 'axios';
import dotenv from 'dotenv';
import pool from '../db/connection.js';
dotenv.config();

const baseUrl = process.env.QDRANT_URL;
const collection = process.env.QDRANT_COLLECTION;
const headers = {
    'Content-Type': 'application/json',
    'api-key': process.env.QDRANT_API_KEY,
};

export async function searchMovies(req, res) {
    const { query } = req.query;
    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'query required' });
    }

    console.log(`🔍 [S1-R33] 자연어 검색: ${query}`);

    try {
        // 1️⃣ 검색 쿼리 임베딩 생성
        const embedding = await createEmbedding(query);
        if (!embedding || !Array.isArray(embedding)) {
            return res.status(500).json({ error: 'embedding failed' });
        }
        console.log(`✅ 임베딩 생성 완료 (4096차원)`);

        // 2️⃣ Qdrant 유사도 검색
        const response = await axios.post(
            `${baseUrl}/collections/${collection}/points/search`,
            {
                vector: {
                    name: 'default', // ✅ named vector 명시적 지정
                    vector: embedding, // ✅ 4096차원 임베딩 배열
                },
                limit: 5,
                with_payload: true,
            },
            { headers }
        );

        const results = response.data?.result || [];
        if (results.length === 0) {
            return res.json({ message: 'No similar movies found', results: [] });
        }

        console.log(`🎬 ${results.length}건의 유사 결과 반환`);

        // 3️⃣ 결과 정제 및 MySQL ID 조회
        const formatted = await Promise.all(results.map(async (r) => {
            // MySQL에서 실제 영화 ID 조회
            const [dbMovies] = await pool.query(
                'SELECT id FROM movies WHERE title = ? LIMIT 1',
                [r.payload?.title]
            );
            
            return {
                id: dbMovies.length > 0 ? dbMovies[0].id : r.id, // MySQL ID 우선, 없으면 Qdrant ID
                score: r.score,
                title: r.payload?.title || '제목 없음',
                genre: r.payload?.genre || '',
                nation: r.payload?.nation || '',
                director: r.payload?.director || '',
                actors: r.payload?.actors || '',
                plot: r.payload?.plot || '',
                poster: r.payload?.poster || '',
            };
        }));

        return res.json({ query, count: formatted.length, results: formatted });
    } catch (err) {
        console.error('❌ Search Error:', err.response?.data || err.message);
        return res.status(500).json({ error: 'search failed' });
    }
}
