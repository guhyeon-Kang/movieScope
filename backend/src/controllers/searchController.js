// ✅ src/controllers/searchController.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SOLAR_KEY = process.env.SOLAR_KEY;
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const COLLECTION = process.env.QDRANT_COLLECTION;

export async function searchMovies(req, res) {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'query is required' });

        console.log(`🔍 [S1-R33] 자연어 검색: ${query}`);

        // 1️⃣ 임베딩 생성
        const embRes = await axios.post(
            'https://api.upstage.ai/v1/embeddings',
            { model: 'solar-embedding-1-large-query', input: query },
            { headers: { Authorization: `Bearer ${SOLAR_KEY}` } }
        );
        const embedding = embRes.data.data[0].embedding;
        console.log(`✅ 임베딩 생성 완료 (${embedding.length}차원)`);

        // 2️⃣ Qdrant 유사 벡터 검색 (v1.15.5 공식 문법)
        const qdrantRes = await axios.post(
            `${QDRANT_URL}/collections/${COLLECTION}/points/query`,
            {
                query: embedding, // ✅ vector → query
                using: 'default', // ✅ named vector 지정
                limit: 5,
                with_payload: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': QDRANT_API_KEY,
                },
            }
        );

        const results = qdrantRes.data.result.points.map((p) => ({
            id: p.id,
            score: p.score,
            payload: p.payload || {},
        }));

        console.log(`🎬 ${results.length}건의 유사 결과 반환`);
        res.json(results);
    } catch (err) {
        console.error('❌ Search Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Search failed' });
    }
}
