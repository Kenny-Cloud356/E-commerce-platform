const { pool } = require("../config/database");

const OrderItem = {
  async createBulk(orderId, items) {
    const values = items
      .map((_, i) => `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`)
      .join(", ");
    const params = [orderId];
    items.forEach((item) => {
      params.push(item.product_id, item.quantity, item.price);
    });

    const { rows } = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ${values} RETURNING *`,
      params
    );
    return rows;
  },

  async findByOrder(orderId) {
    const { rows } = await pool.query(
      `SELECT oi.*, p.name, p.slug, p.images
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return rows;
  },
};

module.exports = OrderItem;
