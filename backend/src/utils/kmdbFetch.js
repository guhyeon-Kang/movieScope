import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchMoviesByKeyword(keyword, page = 1) {
    const apiKey = process.env.KMDB_KEY;
    const url = 'https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp';

    // 다양한 정렬 방식으로 결과 다양화
    const sortOptions = ['prodYear,1', 'prodYear,0', 'title,1', 'title,0'];
    const sortBy = sortOptions[(page - 1) % sortOptions.length];

    try {
        const { data } = await axios.get(url, {
            params: {
                ServiceKey: apiKey,
                collection: 'kmdb_new2',
                query: keyword,
                detail: 'Y',
                listCount: 10,
                startCount: (page - 1) * 10,
                sort: sortBy, // 동적 정렬
            },
        });

        const results = data?.Data?.[0]?.Result || [];

        const filtered = results.filter((movie) => {
            const title = movie.title || '';
            const type = movie.type || '';
            return (
                (type.includes('극영화') || type === '') &&
                !title.includes('예능') &&
                !title.includes('뮤직') &&
                !title.includes('콘서트')
            );
        });

        return filtered.map((movie) => {
            // ✅ 포스터 추출 로직 (KMDb 실제 구조 기준)
            const poster =
                movie.posters?.split('|')[0] || // 대표 포스터
                movie.stlls?.split('|')[0] || // 스틸 이미지
                '';

            return {
                id: movie.DOCID,
                title: movie.title?.replace(/!HS|!HE/g, '').trim(),
                genre: movie.genre || '',
                nation: movie.nation || '',
                director: movie.directors?.director?.[0]?.directorNm || '정보 없음',
                actors:
                    movie.actors?.actor
                        ?.slice(0, 3)
                        .map((a) => a.actorNm)
                        .join(', ') || '정보 없음',
                plot: movie.plots?.plot?.[0]?.plotText?.replace(/!HS|!HE/g, '').trim() || '',
                poster, // ✅ 수정된 포스터 필드
                prodYear: movie.prodYear || '정보 없음',
                kmdbUrl: movie.kmdbUrl || '',
            };
        });
    } catch (error) {
        console.error('❌ KMDb Fetch Error:', error.response?.data || error.message);
        return [];
    }
}
