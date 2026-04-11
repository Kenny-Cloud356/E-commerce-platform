const { pool } = require("../config/database");

const Order = {
  async create({ user_id, total, shipping_address, payment_intent_id }) {
    const { rows } = await pool.query(
      `INSERT INTO orders (user_id, total, shipping_address, payment_intent_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, total, JSON.stringify(shipping_address), payment_intent_id]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );
    return rows[0];
  },

  async findByUser(userId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const { rows: countRows } = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE user_id = $1",
      [userId]
    );
    return { orders: rows, total: parseInt(countRows[0].count) };
  },

  async findAll({ page = 1, limit = 20, status }) {
    let query = "SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id";
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` WHERE o.status = $${paramIndex++}`;
      params.push(status);
    }

    const countQuery = query.replace(/SELECT .* FROM/, "SELECT COUNT(*) FROM");
    const { rows: countRows } = await pool.query(countQuery, params);
    const total = parseInt(countRows[0].count);

    const offset = (page - 1) * limit;
    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { orders: rows, total };
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    return rows[0];
  },

  async updatePaymentStatus(paymentIntentId, paymentStatus) {
    const { rows } = await pool.query(
      `UPDATE orders SET payment_status = $1, updated_at = NOW()
       WHERE payment_intent_id = $2 RETURNING *`,
      [paymentStatus, paymentIntentId]
    );
    return rows[0];
  },
};

module.exports = Order;
