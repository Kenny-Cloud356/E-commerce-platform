const { pool } = require("../config/database");

const Cart = {
  async getOrCreateCart(userId) {
    let { rows } = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
    if (rows.length === 0) {
      ({ rows } = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [userId]
      ));
    }
    return rows[0];
  },

  async getCartWithItems(userId) {
    const cart = await this.getOrCreateCart(userId);
    const { rows: items } = await pool.query(
      `SELECT ci.id, ci.quantity, ci.product_id,
              p.name, p.price, p.images, p.stock, p.slug
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1
       ORDER BY ci.created_at DESC`,
      [cart.id]
    );
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { cart, items, total: parseFloat(total.toFixed(2)) };
  },

  async addItem(userId, productId, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);
    const { rows } = await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [cart.id, productId, quantity]
    );
    return rows[0];
  },

  async updateQuantity(userId, itemId, quantity) {
    const cart = await this.getOrCreateCart(userId);
    const { rows } = await pool.query(
      `UPDATE cart_items SET quantity = $1
       WHERE id = $2 AND cart_id = $3 RETURNING *`,
      [quantity, itemId, cart.id]
    );
    return rows[0];
  },

  async removeItem(userId, itemId) {
    const cart = await this.getOrCreateCart(userId);
    await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND cart_id = $2",
      [itemId, cart.id]
    );
  },

  async clear(userId) {
    const cart = await this.getOrCreateCart(userId);
    await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);
  },
};

module.exports = Cart;
