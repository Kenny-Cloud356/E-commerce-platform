const { pool } = require("../config/database");

const Category = {
  async findAll() {
    const { rows } = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    return rows[0];
  },

  async findBySlug(slug) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE slug = $1", [slug]);
    return rows[0];
  },

  async create({ name, slug, description, image, parent_id }) {
    const { rows } = await pool.query(
      `INSERT INTO categories (name, slug, description, image, parent_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, slug, description, image, parent_id || null]
    );
    return rows[0];
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE categories SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  },
};

module.exports = Category;
