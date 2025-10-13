// S1-R31: KMDb API 데이터 수집 기능
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchMoviesByKeyword(keyword, page = 1) {
    const apiKey = process.env.KMDB_KEY;
    const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&ServiceKey=${apiKey}&title=${encodeURIComponent(
        keyword
    )}&listCount=10&page=${page}&detail=N`;

    try {
        const { data } = await axios.get(url);
        const results = data?.Data?.[0]?.Result || [];

        return results.map((movie) => ({
            id: movie.DOCID,
            title: movie.title,
            genre: movie.genre,
            nation: movie.nation,
            director: movie.directors?.director?.[0]?.directorNm || '정보 없음',
            actors:
                movie.actors?.actor
                    ?.slice(0, 3)
                    .map((a) => a.actorNm)
                    .join(', ') || '정보 없음',
            plot: movie.plots?.plot?.[0]?.plotText || '',
            poster: movie.posters?.split('|')[0] || '',
        }));
    } catch (error) {
        console.error('❌ KMDb Fetch Error:', error.message);
        return [];
    }
}
