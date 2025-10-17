// 사용자 인증 라우터
import express from 'express';
import { 
    signup, 
    login, 
    updateProfile, 
    deleteUser, 
    logout,
    getUserInfo,
    authenticateToken 
} from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/signup - 회원가입
router.post('/signup', signup);

// POST /api/users/login - 로그인
router.post('/login', login);

// GET /api/users/me - 사용자 정보 조회
router.get('/me', authenticateToken, getUserInfo);

// PUT /api/users/profile - 프로필 수정 (비밀번호 변경)
router.put('/profile', authenticateToken, updateProfile);

// DELETE /api/users - 회원탈퇴
router.delete('/', authenticateToken, deleteUser);

// POST /api/users/logout - 로그아웃
router.post('/logout', authenticateToken, logout);

export default router;
