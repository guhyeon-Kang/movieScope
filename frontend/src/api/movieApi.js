// 영화 관련 API
import apiClient from './client.js';

export const movieApi = {
    // 영화 상세 조회
    getMovieById: async (id) => {
        const response = await apiClient.get(`/movies/${id}`);
        return response.data;
    },

    // 자연어 검색
    searchMovies: async (query) => {
        const response = await apiClient.get(`/search?query=${encodeURIComponent(query)}`);
        return response.data;
    },

    // 영화 데이터 수집 (관리자용)
    importMovies: async (keyword) => {
        const response = await apiClient.get(`/movies?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    },
};
