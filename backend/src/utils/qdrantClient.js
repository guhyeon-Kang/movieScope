// ✅ Qdrant client (4096-dim + named vector 대응)
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.QDRANT_URL;
const collection = process.env.QDRANT_COLLECTION;
const headers = {
    'Content-Type': 'application/json',
    'api-key': process.env.QDRANT_API_KEY,
};

// ✅ 최신 Qdrant 컬렉션 초기화 (named vector = default)
export async function initQdrant() {
    try {
        await axios.put(
            `${baseUrl}/collections/${collection}`,
            {
                vectors: {
                    default: {
                        size: 4096, // SOLAR 임베딩 크기
                        distance: 'Cosine',
                    },
                },
            },
            { headers }
        );
        console.log(`✅ Qdrant collection '${collection}' ready`);
    } catch (err) {
        if (err.response?.status === 409) {
            console.log(`⚠️ Collection '${collection}' already exists — skip init`);
        } else {
            console.error('❌ Qdrant init error:', err.response?.data || err.message);
        }
    }
}

// ✅ 벡터 및 payload 저장
export async function saveVector(movieId, vector, payload = {}) {
    try {
        const id = typeof movieId === 'number' || /^[0-9a-fA-F-]{36}$/.test(movieId) ? movieId : uuidv4();

        await axios.put(
            `${baseUrl}/collections/${collection}/points?wait=true`,
            {
                points: [
                    {
                        id,
                        vectors: { default: vector },
                        payload,
                    },
                ],
            },
            { headers }
        );

        console.log(`✅ Qdrant 저장 완료: ${payload.title || movieId}`);
    } catch (err) {
        console.error('❌ Qdrant save error:', err.response?.data || err.message);
    }
}
