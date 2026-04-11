const { pool } = require("../config/database");
const logger = require("../config/logger");

const cleanupAbandonedCarts = async () => {
  try {
    const result = await pool.query(
      `DELETE FROM cart_items WHERE cart_id IN (
        SELECT c.id FROM carts c
        LEFT JOIN cart_items ci ON c.id = ci.cart_id
        WHERE ci.created_at < NOW() - INTERVAL '7 days'
      )`
    );
    if (result.rowCount > 0) {
      logger.info(`Cleaned up ${result.rowCount} abandoned cart items`);
    }
  } catch (err) {
    logger.error("Cart cleanup error:", err);
  }
};

const cancelUnpaidOrders = async () => {
  try {
    const result = await pool.query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW()
       WHERE status = 'pending' AND payment_status = 'unpaid'
       AND created_at < NOW() - INTERVAL '24 hours'`
    );
    if (result.rowCount > 0) {
      logger.info(`Cancelled ${result.rowCount} unpaid orders`);
    }
  } catch (err) {
    logger.error("Order cleanup error:", err);
  }
};

// Run cleanup every hour
const startCleanupWorker = () => {
  setInterval(() => {
    cleanupAbandonedCarts();
    cancelUnpaidOrders();
  }, 60 * 60 * 1000);
  logger.info("Cleanup worker started");
};

module.exports = { startCleanupWorker };
