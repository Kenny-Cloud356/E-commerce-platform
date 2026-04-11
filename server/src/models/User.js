const { pool } = require("../config/database");

const User = {
  async findById(id) {
    const { rows } = await pool.query(
      "SELECT id, name, email, role, avatar, phone, is_active, created_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  },

  async create({ name, email, password_hash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [name, email, password_hash]
    );
    return rows[0];
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1
       RETURNING id, name, email, role, avatar, phone, is_active`,
      [id, ...values]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  },

  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT id, name, email, role, is_active, created_at
       FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const {
      rows: [{ count }],
    } = await pool.query("SELECT COUNT(*) FROM users");
    return { users: rows, total: parseInt(count) };
  },

  async setResetToken(email, token, expires) {
    const { rows } = await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING id`,
      [token, expires, email]
    );
    return rows[0];
  },

  async findByResetToken(token) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [token]
    );
    return rows[0];
  },
};

module.exports = User;
