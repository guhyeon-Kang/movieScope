// 사용자 인증 관련 컨트롤러
import pool from '../db/connection.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logLogin, logLogout } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 회원가입
export async function signup(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: '이메일과 비밀번호는 필수입니다.' });
    }

    try {
        // 이메일 중복 확인
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: '이미 존재하는 이메일입니다.' });
        }

        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 생성
        const [result] = await pool.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        const userId = result.insertId;

        // 관리자 권한 확인
        const [adminUsers] = await pool.query(
            'SELECT role FROM admins WHERE user_id = ?',
            [userId]
        );
        const isAdmin = adminUsers.length > 0;
        const role = isAdmin ? 'admin' : 'user';

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId, email, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`✅ 회원가입 성공: ${email}`);
        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            token,
            user: { id: userId, email, role }
        });

    } catch (error) {
        console.error('❌ 회원가입 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 로그인
export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: '이메일과 비밀번호는 필수입니다.' });
    }

    try {
        // 사용자 조회
        const [users] = await pool.query(
            'SELECT id, email, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        const user = users[0];

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        // 관리자 권한 확인
        const [adminUsers] = await pool.query(
            'SELECT role FROM admins WHERE user_id = ?',
            [user.id]
        );
        console.log('로그인 사용자 ID:', user.id);
        console.log('관리자 권한 조회 결과:', adminUsers);
        const isAdmin = adminUsers.length > 0;
        const role = isAdmin ? 'admin' : 'user';
        console.log('최종 권한:', role);

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user.id, email: user.email, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 로그인 로그 기록
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];
        
        await logLogin({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent
        });

        console.log(`✅ 로그인 성공: ${email}`);
        res.json({
            message: '로그인 성공',
            token,
            user: { id: user.id, email: user.email, role }
        });

    } catch (error) {
        console.error('❌ 로그인 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 프로필 수정 (비밀번호 변경)
export async function updateProfile(req, res) {
    const { password } = req.body;
    const userId = req.user?.userId; // 미들웨어에서 설정된 사용자 ID

    if (!userId) {
        return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    if (!password) {
        return res.status(400).json({ error: '새 비밀번호를 입력해주세요.' });
    }

    try {
        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 비밀번호 업데이트
        await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        console.log(`✅ 비밀번호 변경 완료: 사용자 ID ${userId}`);
        res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });

    } catch (error) {
        console.error('❌ 비밀번호 변경 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 회원탈퇴
export async function deleteUser(req, res) {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    try {
        // 로그아웃 로그 기록 (회원탈퇴 전)
        await logLogout(userId);
        
        // 사용자 삭제
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        console.log(`✅ 회원탈퇴 완료: 사용자 ID ${userId}`);
        res.json({ message: '회원탈퇴가 완료되었습니다.' });

    } catch (error) {
        console.error('❌ 회원탈퇴 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 로그아웃 처리 (프론트엔드에서 호출)
export async function logout(req, res) {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    try {
        // 로그아웃 로그 기록
        await logLogout(userId);

        console.log(`✅ 로그아웃 완료: 사용자 ID ${userId}`);
        res.json({ message: '로그아웃이 완료되었습니다.' });

    } catch (error) {
        console.error('❌ 로그아웃 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 사용자 정보 조회
export async function getUserInfo(req, res) {
    try {
        const userId = req.user.userId;
        
        // 사용자 기본 정보 조회
        const [users] = await pool.query(
            'SELECT id, email, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        const user = users[0];

        // 관리자 권한 확인
        const [adminUsers] = await pool.query(
            'SELECT role FROM admins WHERE user_id = ?',
            [userId]
        );
        
        const isAdmin = adminUsers.length > 0;
        const role = isAdmin ? 'admin' : 'user';

        res.json({
            user: { 
                id: user.id, 
                email: user.email, 
                role,
                created_at: user.created_at 
            }
        });

    } catch (error) {
        console.error('❌ 사용자 정보 조회 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// JWT 토큰 검증 미들웨어
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '토큰이 필요합니다.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
        }
        req.user = user;
        next();
    });
}
