// 관리자 기능 컨트롤러
import pool from '../db/connection.js';
import { authenticateToken } from './userController.js';

// 관리자 권한 확인 미들웨어
export async function isAdmin(req, res, next) {
    const userId = req.user?.userId;
    
    if (!userId) {
        return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    try {
        const [admins] = await pool.query(
            'SELECT * FROM admins WHERE user_id = ?',
            [userId]
        );

        if (admins.length === 0) {
            return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
        }

        req.admin = admins[0];
        next();
    } catch (error) {
        console.error('❌ 관리자 권한 확인 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// S1-R41: 수집 로그 조회
export async function getCollectionLogs(req, res) {
    const { page = 1, limit = 20, keyword, resultCode } = req.query;
    const offset = (page - 1) * limit;

    try {
        let whereClause = '';
        let params = [];

        // 필터 조건 추가
        const conditions = [];
        if (keyword) {
            conditions.push('keyword LIKE ?');
            params.push(`%${keyword}%`);
        }
        if (resultCode) {
            conditions.push('result_code = ?');
            params.push(resultCode);
        }

        if (conditions.length > 0) {
            whereClause = 'WHERE ' + conditions.join(' AND ');
        }

        // 로그 조회
        const [logs] = await pool.query(
            `SELECT * FROM collection_logs 
            ${whereClause}
            ORDER BY collection_datetime DESC 
            LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        // 총 개수 조회
        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total FROM collection_logs ${whereClause}`,
            params
        );

        const total = countResult[0].total;

        console.log(`✅ 수집 로그 조회 완료: ${logs.length}건`);
        res.json({
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('❌ 수집 로그 조회 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// S1-R42: 로그인 이력 조회
export async function getLoginLogs(req, res) {
    const { page = 1, limit = 20, email, userId } = req.query;
    const offset = (page - 1) * limit;

    try {
        let whereClause = '';
        let params = [];

        // 필터 조건 추가
        const conditions = [];
        if (email) {
            conditions.push('email LIKE ?');
            params.push(`%${email}%`);
        }
        if (userId) {
            conditions.push('user_id = ?');
            params.push(userId);
        }

        if (conditions.length > 0) {
            whereClause = 'WHERE ' + conditions.join(' AND ');
        }

        // 로그인 로그 조회
        const [logs] = await pool.query(
            `SELECT * FROM login_logs 
            ${whereClause}
            ORDER BY login_datetime DESC 
            LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        // 총 개수 조회
        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total FROM login_logs ${whereClause}`,
            params
        );

        const total = countResult[0].total;

        console.log(`✅ 로그인 이력 조회 완료: ${logs.length}건`);
        res.json({
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('❌ 로그인 이력 조회 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 관리자 대시보드 통계
export async function getDashboardStats(req, res) {
    try {
        // 전체 통계 조회
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [movieCount] = await pool.query('SELECT COUNT(*) as count FROM movies');
        const [collectionLogCount] = await pool.query('SELECT COUNT(*) as count FROM collection_logs');
        const [loginLogCount] = await pool.query('SELECT COUNT(*) as count FROM login_logs');

        // 최근 활동
        const [recentCollections] = await pool.query(
            'SELECT * FROM collection_logs ORDER BY collection_datetime DESC LIMIT 5'
        );
        const [recentLogins] = await pool.query(
            'SELECT * FROM login_logs ORDER BY login_datetime DESC LIMIT 5'
        );

        // 결과 코드별 통계
        const [resultCodeStats] = await pool.query(
            'SELECT result_code, COUNT(*) as count FROM collection_logs GROUP BY result_code'
        );

        res.json({
            stats: {
                totalUsers: userCount[0].count,
                totalMovies: movieCount[0].count,
                totalCollections: collectionLogCount[0].count,
                totalLogins: loginLogCount[0].count
            },
            recentActivities: {
                collections: recentCollections,
                logins: recentLogins
            },
            resultCodeStats
        });

    } catch (error) {
        console.error('❌ 대시보드 통계 조회 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}
