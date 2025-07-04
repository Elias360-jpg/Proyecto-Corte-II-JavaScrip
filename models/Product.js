const pool = require('../config/db');

class Product {
    static async create({ name, description, price, stock }) {
        const [result] = await pool.execute(
            'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
            [name, description, price, stock]
        );
        return { id: result.insertId, name, description, price, stock };
    }

    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM products');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, { name, description, price, stock }) {
        const [result] = await pool.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
            [name, description, price, stock, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;