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

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movies_director ON movies(director);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 샘플 데이터 삽입 (테스트용)
-- INSERT INTO users (email, password) VALUES ('test@example.com', '$2a$10$example_hashed_password');
