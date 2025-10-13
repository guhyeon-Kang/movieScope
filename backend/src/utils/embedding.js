// S1-R32: Upstage 최신 Embedding API (2025)
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function createEmbedding(text) {
    try {
        const res = await axios.post(
            'https://api.upstage.ai/v1/embeddings',
            {
                model: 'solar-embedding-1-large-query', // ✅ 최신 모델명으로 변경
                input: text,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.SOLAR_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const vector = res.data.data[0].embedding;
        console.log('✅ Embedding 생성 성공, 벡터 길이:', vector.length); // ← 이 줄 추가
        return vector;
    } catch (err) {
        console.error('❌ Embedding Error:', err.response?.data || err.message);
        return null;
    }
}
