// 관리자 관련 API
import apiClient from './client.js';

export const adminApi = {
    // 관리자 대시보드 통계
    getDashboardStats: async () => {
        const response = await apiClient.get('/admin/dashboard');
        return response.data;
    },

    // 수집 로그 조회 (S1-R41)
    getCollectionLogs: async (params = {}) => {
        const response = await apiClient.get('/admin/collection-logs', { params });
        return response.data;
    },

    // 로그인 이력 조회 (S1-R42)
    getLoginLogs: async (params = {}) => {
        const response = await apiClient.get('/admin/login-logs', { params });
        return response.data;
    },
};
