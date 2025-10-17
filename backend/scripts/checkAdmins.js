// admins 테이블 확인 스크립트
import pool from '../src/db/connection.js';

async function checkAdmins() {
    try {
        console.log('🔍 admins 테이블 확인 중...');
        
        // admins 테이블의 모든 데이터 조회
        const [admins] = await pool.query(`
            SELECT a.admin_id, a.user_id, a.role, u.email 
            FROM admins a 
            LEFT JOIN users u ON a.user_id = u.id
        `);
        
        console.log('📋 admins 테이블 데이터:');
        if (admins.length === 0) {
            console.log('   ❌ 등록된 관리자가 없습니다.');
        } else {
            admins.forEach((admin, index) => {
                console.log(`   ${index + 1}. ID: ${admin.user_id}, 이메일: ${admin.email}, 권한: ${admin.role}`);
            });
        }
        
        // users 테이블의 모든 사용자 조회
        console.log('\n👥 전체 사용자 목록:');
        const [users] = await pool.query('SELECT id, email FROM users ORDER BY id');
        users.forEach((user, index) => {
            console.log(`   ${index + 1}. ID: ${user.id}, 이메일: ${user.email}`);
        });
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    } finally {
        await pool.end();
    }
}

checkAdmins();
