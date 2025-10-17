// 관리자 계정 확인 및 생성 스크립트
import pool from '../src/db/connection.js';
import bcrypt from 'bcryptjs';

async function checkAndCreateAdmin() {
    try {
        console.log('🔍 관리자 계정 확인 중...');
        
        // 기존 관리자 계정 확인
        const [existingAdmins] = await pool.query(
            `SELECT u.id, u.email, a.role 
             FROM users u 
             LEFT JOIN admins a ON u.id = a.user_id 
             WHERE u.email = 'admin@moviescope.com'`
        );
        
        if (existingAdmins.length > 0) {
            console.log('✅ 관리자 계정이 이미 존재합니다:');
            console.log('   - ID:', existingAdmins[0].id);
            console.log('   - 이메일:', existingAdmins[0].email);
            console.log('   - 권한:', existingAdmins[0].role || 'user');
            
            if (!existingAdmins[0].role) {
                console.log('⚠️  관리자 권한이 없습니다. 권한을 추가합니다...');
                await pool.query(
                    'INSERT INTO admins (user_id, role) VALUES (?, ?)',
                    [existingAdmins[0].id, 'admin']
                );
                console.log('✅ 관리자 권한이 추가되었습니다.');
            }
        } else {
            console.log('📝 관리자 계정을 생성합니다...');
            
            // 비밀번호 해싱
            const adminPassword = 'admin123!';
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
            
            // 사용자 생성
            const [result] = await pool.query(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                ['admin@moviescope.com', hashedPassword]
            );
            
            const userId = result.insertId;
            console.log('✅ 사용자 계정 생성 완료. ID:', userId);
            
            // 관리자 권한 부여
            await pool.query(
                'INSERT INTO admins (user_id, role) VALUES (?, ?)',
                [userId, 'admin']
            );
            console.log('✅ 관리자 권한 부여 완료');
            
            console.log('📧 관리자 계정 정보:');
            console.log('   - 이메일: admin@moviescope.com');
            console.log('   - 비밀번호: admin123!');
        }
        
        // 최종 확인
        const [finalCheck] = await pool.query(
            `SELECT u.id, u.email, a.role 
             FROM users u 
             LEFT JOIN admins a ON u.id = a.user_id 
             WHERE u.email = 'admin@moviescope.com'`
        );
        
        console.log('🎯 최종 확인 결과:');
        console.log('   - ID:', finalCheck[0].id);
        console.log('   - 이메일:', finalCheck[0].email);
        console.log('   - 권한:', finalCheck[0].role);
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    } finally {
        await pool.end();
    }
}

checkAndCreateAdmin();
