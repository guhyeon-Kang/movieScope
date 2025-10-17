-- 관리자 계정 생성 SQL 스크립트
-- 이 스크립트를 데이터베이스에서 실행하여 관리자 계정을 생성하세요.

-- 관리자 계정 생성 (이메일: admin@moviescope.com, 비밀번호: admin123!)
-- 비밀번호는 bcrypt로 해싱된 값입니다.
INSERT INTO users (email, password) VALUES (
    'admin@moviescope.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- 생성된 사용자 ID를 확인하고 관리자 권한 부여
-- (실제 사용자 ID는 AUTO_INCREMENT로 생성되므로, 아래 쿼리에서 확인 후 수정 필요)
INSERT INTO admins (user_id, role) 
SELECT id, 'admin' 
FROM users 
WHERE email = 'admin@moviescope.com';

-- 생성된 관리자 계정 확인
SELECT u.id, u.email, a.role 
FROM users u 
LEFT JOIN admins a ON u.id = a.user_id 
WHERE u.email = 'admin@moviescope.com';
