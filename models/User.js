const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async create({ username, password, role = 'user' }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        return { id: result.insertId, username, role };
    }

    static async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async updateRefreshToken(userId, refreshToken) {
        await pool.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
    }

    static async findByRefreshToken(refreshToken) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
        return rows[0];
    }
}

module.exports = User;