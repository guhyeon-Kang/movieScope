// S1-R32: KMDb 데이터 수집 + 임베딩 변환 + Qdrant 벡터 저장
import { fetchMoviesByKeyword } from '../utils/kmdbFetch.js';
import { saveMovies } from '../models/Movie.js';
import { createEmbedding } from '../utils/embedding.js';
import { initQdrant, saveVector } from '../utils/qdrantClient.js';

export async function importMovies(req, res) {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'keyword required' });
    }

    console.log(`🔎 [S1-R31] '${keyword}' 영화 데이터 수집 시작`);

    // 1️⃣ KMDb API 수집
    const movies = await fetchMoviesByKeyword(keyword);
    await saveMovies(movies);
    console.log(`✅ ${movies.length} movies saved to MySQL`);

    // 2️⃣ Qdrant 초기화
    await initQdrant();

    // 3️⃣ 임베딩 생성 + 벡터 저장
    let successCount = 0;
    for (const movie of movies) {
        if (!movie.plot) {
            console.log(`⚠️ ${movie.title} → plot 없음`);
            continue;
        }

        console.log(`🧠 임베딩 생성 중: ${movie.title}`);
        const embedding = await createEmbedding(movie.plot);

        if (embedding && Array.isArray(embedding)) {
            await saveVector(movie.id, embedding);
            successCount++;
            console.log(`✅ Qdrant 저장 완료: ${movie.title}`);
        } else {
            console.log(`❌ 임베딩 실패: ${movie.title}`);
        }
    }

    console.log(`🎬 총 ${successCount}건의 벡터 저장 완료`);
    res.json({
        message: `S1-R31~32 완료: '${keyword}' 영화 ${movies.length}건 중 ${successCount}건 벡터화 완료`,
    });
}
