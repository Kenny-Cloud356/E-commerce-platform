const { pool } = require("../config/database");

const Review = {
  async findByProduct(productId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`,
      [productId, limit, offset]
    );
    const { rows: countRows } = await pool.query(
      "SELECT COUNT(*) FROM reviews WHERE product_id = $1",
      [productId]
    );
    return { reviews: rows, total: parseInt(countRows[0].count) };
  },

  async findByUserAndProduct(userId, productId) {
    const { rows } = await pool.query(
      "SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    return rows[0];
  },

  async create({ user_id, product_id, rating, comment }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, product_id, rating, comment]
    );
    return rows[0];
  },

  async update(id, { rating, comment }) {
    const { rows } = await pool.query(
      `UPDATE reviews SET rating = COALESCE($1, rating), comment = COALESCE($2, comment), updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [rating, comment, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query("DELETE FROM reviews WHERE id = $1 RETURNING product_id", [id]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    return rows[0];
  },
};

module.exports = Review;
