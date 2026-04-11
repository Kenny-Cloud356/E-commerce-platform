const { pool } = require("../config/database");

const Address = {
  async findByUser(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC",
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM addresses WHERE id = $1", [id]);
    return rows[0];
  },

  async create(userId, data) {
    // If setting as default, unset existing default first
    if (data.is_default) {
      await pool.query("UPDATE addresses SET is_default = false WHERE user_id = $1", [userId]);
    }
    const { rows } = await pool.query(
      `INSERT INTO addresses (user_id, label, street, city, state, zip, country, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, data.label, data.street, data.city, data.state, data.zip, data.country, data.is_default || false]
    );
    return rows[0];
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE addresses SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM addresses WHERE id = $1", [id]);
  },
};

module.exports = Address;
