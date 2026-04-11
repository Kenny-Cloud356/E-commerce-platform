const { pool } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const [revenue, orderCount, userCount, productCount, recentOrders, topProducts] =
    await Promise.all([
      pool.query("SELECT COALESCE(SUM(total), 0) as total_revenue FROM orders WHERE payment_status = 'paid'"),
      pool.query("SELECT COUNT(*) FROM orders"),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'customer'"),
      pool.query("SELECT COUNT(*) FROM products WHERE is_active = true"),
      pool.query(
        `SELECT o.id, o.total, o.status, o.created_at, u.name as user_name
         FROM orders o JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC LIMIT 5`
      ),
      pool.query(
        `SELECT p.id, p.name, p.price, p.images, COUNT(oi.id) as order_count
         FROM products p
         JOIN order_items oi ON p.id = oi.product_id
         GROUP BY p.id ORDER BY order_count DESC LIMIT 5`
      ),
    ]);

  res.json({
    success: true,
    data: {
      totalRevenue: parseFloat(revenue.rows[0].total_revenue),
      totalOrders: parseInt(orderCount.rows[0].count),
      totalCustomers: parseInt(userCount.rows[0].count),
      totalProducts: parseInt(productCount.rows[0].count),
      recentOrders: recentOrders.rows,
      topProducts: topProducts.rows,
    },
  });
});

const getRevenueReport = asyncHandler(async (req, res) => {
  const { period = "30" } = req.query;
  const days = parseInt(period);

  const { rows } = await pool.query(
    `SELECT DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders
     FROM orders
     WHERE payment_status = 'paid' AND created_at >= NOW() - INTERVAL '${days} days'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`
  );

  res.json({ success: true, data: rows });
});

module.exports = { getDashboardStats, getRevenueReport };
