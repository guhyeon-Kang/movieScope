// 사용자 관련 API
import apiClient from './client.js';

export const userApi = {
    // 회원가입
    signup: async (email, password) => {
        const response = await apiClient.post('/users/signup', {
            email,
            password,
        });
        return response.data;
    },

    // 로그인
    login: async (email, password) => {
        const response = await apiClient.post('/users/login', {
            email,
            password,
        });
        return response.data;
    },

    // 프로필 수정 (비밀번호 변경)
    updateProfile: async (newPassword) => {
        const response = await apiClient.put('/users/profile', {
            password: newPassword,
        });
        return response.data;
    },

    // 회원탈퇴
    deleteUser: async () => {
        const response = await apiClient.delete('/users');
        return response.data;
    },
};
