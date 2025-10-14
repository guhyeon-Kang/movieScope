// ✅ KMDb 데이터 수집 + 임베딩 변환 + Qdrant 벡터 저장
import { fetchMoviesByKeyword } from '../utils/kmdbFetch.js';
import { createEmbedding } from '../utils/embedding.js';
import { initQdrant, saveVector } from '../utils/qdrantClient.js';
import pool from '../db/connection.js';

export async function importMovies(req, res) {
    const { keyword, page = 1 } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'keyword required' });
    }

    console.log(`🔎 [S1-R31] '${keyword}' 영화 데이터 수집 시작 (페이지 ${page})`);

    // 1️⃣ KMDb 데이터 수집
    const movies = await fetchMoviesByKeyword(keyword, parseInt(page));
    if (!movies || movies.length === 0) {
        console.log('✅ 0 movies saved');
        return res.status(200).json({ message: `No movies found for '${keyword}'` });
    }

    // 2️⃣ MySQL 저장 (중복 방지)
    let dbCount = 0;
    for (const movie of movies) {
        const [exist] = await pool.query('SELECT * FROM movies WHERE title = ?', [movie.title]);
        if (exist.length > 0) continue;

        await pool.query(
            'INSERT INTO movies (title, genre, nation, director, actors, plot, poster) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [movie.title, movie.genre, movie.nation, movie.director, movie.actors, movie.plot, movie.poster]
        );
        dbCount++;
    }
    console.log(`✅ ${dbCount} movies saved to MySQL`);

    // 3️⃣ Qdrant 초기화
    await initQdrant();

    // 4️⃣ 임베딩 생성 + 벡터 저장
    let successCount = 0;
    for (const movie of movies) {
        if (!movie.plot || movie.plot.trim() === '') {
            console.log(`⚠️ ${movie.title} → plot 없음 (스킵)`);
            continue;
        }

        console.log(`🧠 임베딩 생성 중: ${movie.title}`);
        const embedding = await createEmbedding(movie.plot);

        if (embedding && Array.isArray(embedding)) {
            await saveVector(movie.DOCID || movie.id || movie.title, embedding, {
                title: movie.title,
                genre: movie.genre,
                nation: movie.nation,
                director: movie.director,
                actors: movie.actors,
                plot: movie.plot,
                poster: movie.poster,
            });
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

// 영화 상세 조회
export async function getMovieById(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: '영화 ID가 필요합니다.' });
    }

    try {
        // MySQL에서 영화 정보 조회
        const [movies] = await pool.query(
            'SELECT * FROM movies WHERE id = ?',
            [id]
        );

        if (movies.length === 0) {
            return res.status(404).json({ error: '영화를 찾을 수 없습니다.' });
        }

        const movie = movies[0];
        console.log(`✅ 영화 조회 성공: ${movie.title}`);

        res.json(movie);

    } catch (error) {
        console.error('❌ 영화 조회 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}