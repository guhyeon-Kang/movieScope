-- admins 테이블에 관리자 계정 추가하는 SQL
-- 이 SQL을 데이터베이스에서 실행하세요

-- 1. 먼저 기존 사용자 확인
SELECT id, email FROM users;

-- 2. 특정 사용자를 관리자로 만들기 (사용자 ID를 실제 ID로 변경하세요)
-- 예: 사용자 ID가 1인 경우
INSERT INTO admins (user_id, role) VALUES (1, 'admin');

-- 3. 또는 이메일로 관리자 만들기
INSERT INTO admins (user_id, role) 
SELECT id, 'admin' 
FROM users 
WHERE email = 'admin@moviescope.com';

-- 4. admins 테이블 확인
SELECT a.admin_id, a.user_id, a.role, u.email 
FROM admins a 
LEFT JOIN users u ON a.user_id = u.id;
