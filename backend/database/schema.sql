-- MovieScope 데이터베이스 스키마
-- MySQL 데이터베이스 생성 및 테이블 정의

-- 데이터베이스 생성 (이미 있다면 생략 가능)
-- CREATE DATABASE IF NOT EXISTS moviescope;
-- USE moviescope;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 영화 테이블
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    nation VARCHAR(50),
    director VARCHAR(100),
    actors TEXT,
    plot TEXT,
    poster VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 수집 로그 테이블 (S1-R41: 수집 로그 조회)
CREATE TABLE IF NOT EXISTS collection_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    page_number INT NOT NULL,
    result_code VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED', 'PARTIAL'
    movies_found INT DEFAULT 0,
    movies_saved INT DEFAULT 0,
    embedding_created INT DEFAULT 0,
    vectors_saved INT DEFAULT 0,
    error_message TEXT,
    collection_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_time_ms INT
);

-- 로그인 이력 테이블 (S1-R42: 로그인이력 조회)
CREATE TABLE IF NOT EXISTS login_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    login_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_datetime TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_duration_minutes INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 관리자 테이블 (관리자 권한 관리)
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movies_director ON movies(director);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_collection_logs_datetime ON collection_logs(collection_datetime);
CREATE INDEX IF NOT EXISTS idx_collection_logs_keyword ON collection_logs(keyword);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_datetime ON login_logs(login_datetime);
