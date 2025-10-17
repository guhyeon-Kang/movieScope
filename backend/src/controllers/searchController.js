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

        // 2️⃣ Qdrant 유사도 검색 (필터링을 고려하여 더 많은 결과 요청)
        const response = await axios.post(
            `${baseUrl}/collections/${collection}/points/search`,
            {
                vector: {
                    name: 'default', // ✅ named vector 명시적 지정
                    vector: embedding, // ✅ 4096차원 임베딩 배열
                },
                limit: 10, // 필터링을 고려하여 10개 요청
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
        const formatted = [];
        const posterMovies = []; // 포스터가 있는 영화들
        const noPosterMovies = []; // 포스터가 없는 영화들
        
        // 에로 콘텐츠 필터링 함수
        const isAdultContent = (title, genre) => {
            const adultKeywords = ['에로', '성인', '19금', '야한', '섹스', '성인영화', '에로영화'];
            return adultKeywords.some(keyword => 
                title.toLowerCase().includes(keyword.toLowerCase()) ||
                genre.toLowerCase().includes(keyword.toLowerCase())
            );
        };
        
        for (const r of results) {
            // MySQL에서 실제 영화 정보 조회
            const [dbMovies] = await pool.query(
                'SELECT id, title, genre, nation, director, actors, plot, poster FROM movies WHERE title = ? LIMIT 1',
                [r.payload?.title]
            );
            
            if (dbMovies.length > 0) {
                const movie = {
                    id: dbMovies[0].id,
                    score: r.score,
                    title: dbMovies[0].title,
                    genre: dbMovies[0].genre || '',
                    nation: dbMovies[0].nation || '',
                    director: dbMovies[0].director || '',
                    actors: dbMovies[0].actors || '',
                    plot: dbMovies[0].plot || '',
                    poster: dbMovies[0].poster || '',
                };
                
                // 에로 콘텐츠 필터링
                if (isAdultContent(movie.title, movie.genre)) {
                    console.log(`🚫 에로 콘텐츠 제외: ${movie.title}`);
                    continue;
                }
                
                // 포스터 유무에 따라 분류
                if (dbMovies[0].poster && dbMovies[0].poster.trim() !== '') {
                    posterMovies.push(movie);
                } else {
                    noPosterMovies.push(movie);
                }
            } else {
                // MySQL에서 찾지 못한 경우 Qdrant 데이터 사용
                const movie = {
                    id: r.id,
                    score: r.score,
                    title: r.payload?.title || '제목 없음',
                    genre: r.payload?.genre || '',
                    nation: r.payload?.nation || '',
                    director: r.payload?.director || '',
                    actors: r.payload?.actors || '',
                    plot: r.payload?.plot || '',
                    poster: r.payload?.poster || '',
                };
                
                // 에로 콘텐츠 필터링
                if (isAdultContent(movie.title, movie.genre)) {
                    console.log(`🚫 에로 콘텐츠 제외: ${movie.title}`);
                    continue;
                }
                
                if (r.payload?.poster && r.payload.poster.trim() !== '') {
                    posterMovies.push(movie);
                } else {
                    noPosterMovies.push(movie);
                }
            }
        }
        
        // 포스터가 있는 영화를 먼저, 그 다음 포스터가 없는 영화를 추가
        formatted.push(...posterMovies, ...noPosterMovies);
        
        // 최종 결과를 6개로 제한
        const finalResults = formatted.slice(0, 6);

        return res.json({ query, count: finalResults.length, results: finalResults });
    } catch (err) {
        console.error('❌ Search Error:', err.response?.data || err.message);
        return res.status(500).json({ error: 'search failed' });
    }
}
