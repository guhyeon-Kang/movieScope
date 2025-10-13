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

// ✅ 최신 Qdrant: named vector "default"
export async function initQdrant() {
    try {
        await axios.put(
            `${baseUrl}/collections/${collection}`,
            {
                vectors: {
                    default: {
                        // ✅ named vector 필드
                        size: 4096,
                        distance: 'Cosine',
                    },
                },
            },
            { headers }
        );
        console.log(`✅ Qdrant collection '${collection}' ready`);
    } catch (err) {
        console.error('❌ Qdrant init error:', err.message);
    }
}

export async function saveVector(movieId, vector) {
    try {
        // ✅ Qdrant가 허용하는 UUID 형식으로 변환
        const id =
            typeof movieId === 'string'
                ? uuidv4() // 문자열이면 UUID로 대체
                : movieId;

        await axios.put(
            `${baseUrl}/collections/${collection}/points?wait=true`,
            {
                points: [
                    {
                        id: id,
                        vectors: { default: vector },
                    },
                ],
            },
            { headers }
        );

        console.log(`✅ Qdrant 저장 완료: ${movieId} (as ${id})`);
    } catch (err) {
        console.error('❌ Qdrant save error:', err.response?.data || err.message);
    }
}
