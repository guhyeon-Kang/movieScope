-- 간단한 관리자 계정 생성 SQL
-- 이 SQL을 데이터베이스에서 실행하세요

-- 1. 관리자 사용자 생성 (비밀번호: admin123!)
INSERT INTO users (email, password) VALUES (
    'admin@moviescope.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- 2. 관리자 권한 부여
INSERT INTO admins (user_id, role) 
SELECT id, 'admin' 
FROM users 
WHERE email = 'admin@moviescope.com';

-- 3. 확인
SELECT u.email, a.role 
FROM users u 
LEFT JOIN admins a ON u.id = a.user_id 
WHERE u.email = 'admin@moviescope.com';
