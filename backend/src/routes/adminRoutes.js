// 관리자 라우터
import express from 'express';
import { authenticateToken } from '../controllers/userController.js';
import { 
    isAdmin, 
    getCollectionLogs, 
    getLoginLogs, 
    getDashboardStats 
} from '../controllers/adminController.js';

const router = express.Router();

// 모든 관리자 라우트는 인증과 관리자 권한 필요
router.use(authenticateToken);
router.use(isAdmin);

// GET /api/admin/dashboard - 관리자 대시보드 통계
router.get('/dashboard', getDashboardStats);

// GET /api/admin/collection-logs - 수집 로그 조회 (S1-R41)
router.get('/collection-logs', getCollectionLogs);

// GET /api/admin/login-logs - 로그인 이력 조회 (S1-R42)
router.get('/login-logs', getLoginLogs);

export default router;
