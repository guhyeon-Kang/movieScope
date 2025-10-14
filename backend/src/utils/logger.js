// 로그 기록 유틸리티
import pool from '../db/connection.js';

// 수집 로그 기록
export async function logCollection({
    keyword,
    pageNumber,
    resultCode,
    moviesFound = 0,
    moviesSaved = 0,
    embeddingCreated = 0,
    vectorsSaved = 0,
    errorMessage = null,
    processingTimeMs = 0
}) {
    try {
        await pool.query(
            `INSERT INTO collection_logs 
            (keyword, page_number, result_code, movies_found, movies_saved, 
             embedding_created, vectors_saved, error_message, processing_time_ms) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [keyword, pageNumber, resultCode, moviesFound, moviesSaved, 
             embeddingCreated, vectorsSaved, errorMessage, processingTimeMs]
        );
        console.log(`📝 수집 로그 기록 완료: ${keyword} - ${resultCode}`);
    } catch (error) {
        console.error('❌ 수집 로그 기록 실패:', error);
    }
}

// 로그인 로그 기록
export async function logLogin({ userId, email, ipAddress, userAgent }) {
    try {
        await pool.query(
            `INSERT INTO login_logs (user_id, email, ip_address, user_agent) 
            VALUES (?, ?, ?, ?)`,
            [userId, email, ipAddress, userAgent]
        );
        console.log(`📝 로그인 로그 기록 완료: ${email}`);
    } catch (error) {
        console.error('❌ 로그인 로그 기록 실패:', error);
    }
}

// 로그아웃 로그 업데이트
export async function logLogout(userId) {
    try {
        const [loginLogs] = await pool.query(
            `SELECT log_id, login_datetime FROM login_logs 
            WHERE user_id = ? AND logout_datetime IS NULL 
            ORDER BY login_datetime DESC LIMIT 1`,
            [userId]
        );

        if (loginLogs.length > 0) {
            const log = loginLogs[0];
            const loginTime = new Date(log.login_datetime);
            const logoutTime = new Date();
            const durationMs = logoutTime - loginTime;
            const durationMinutes = Math.round(durationMs / 60000);

            await pool.query(
                `UPDATE login_logs 
                SET logout_datetime = ?, session_duration_minutes = ? 
                WHERE log_id = ?`,
                [logoutTime, durationMinutes, log.log_id]
            );
            console.log(`📝 로그아웃 로그 기록 완료: 사용자 ${userId}`);
        }
    } catch (error) {
        console.error('❌ 로그아웃 로그 기록 실패:', error);
    }
}
