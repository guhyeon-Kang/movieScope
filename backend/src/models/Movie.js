// S1-R31: KMDb 영화데이터 저장
import pool from '../db/connection.js';

export async function saveMovies(movies) {
    const conn = await pool.getConnection();
    try {
        const query = `
      INSERT IGNORE INTO movies (id, title, genre, nation, director, actors, plot, poster)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        for (const m of movies) {
            await conn.query(query, [m.id, m.title, m.genre, m.nation, m.director, m.actors, m.plot, m.poster]);
        }
        console.log(`✅ ${movies.length} movies saved`);
    } finally {
        conn.release();
    }
}
