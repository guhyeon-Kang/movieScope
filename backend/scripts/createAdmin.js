// 관리자 계정 생성 스크립트
import pool from '../src/db/connection.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        // 관리자 이메일과 비밀번호
        const adminEmail = 'admin@moviescope.com';
        const adminPassword = 'admin123!';
        
        // 기존 관리자 확인
        const [existingAdmins] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [adminEmail]
        );
        
        if (existingAdmins.length > 0) {
            console.log('✅ 관리자 계정이 이미 존재합니다.');
            return;
        }
        
        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
        
        // 사용자 생성
        const [result] = await pool.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [adminEmail, hashedPassword]
        );
        
        const userId = result.insertId;
        
        // 관리자 권한 부여
        await pool.query(
            'INSERT INTO admins (user_id, role) VALUES (?, ?)',
            [userId, 'admin']
        );
        
        console.log('✅ 관리자 계정이 성공적으로 생성되었습니다.');
        console.log(`📧 이메일: ${adminEmail}`);
        console.log(`🔑 비밀번호: ${adminPassword}`);
        
    } catch (error) {
        console.error('❌ 관리자 계정 생성 실패:', error);
    } finally {
        await pool.end();
    }
}

createAdmin();
