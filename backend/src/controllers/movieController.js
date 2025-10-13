// S1-R31: KMDb 데이터 수집 컨트롤러
import { fetchMoviesByKeyword } from '../utils/kmdbFetch.js';
import { saveMovies } from '../models/Movie.js';

export async function importMovies(req, res) {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: 'keyword required' });

    const movies = await fetchMoviesByKeyword(keyword);
    await saveMovies(movies);

    res.json({
        message: `S1-R31: '${keyword}' 관련 영화 ${movies.length}건 저장 완료`,
    });
}
