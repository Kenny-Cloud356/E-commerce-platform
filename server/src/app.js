const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/apiError");
const { generalLimiter, authLimiter } = require("./middleware/rateLimiter");
const { metricsMiddleware, metricsEndpoint } = require("./middleware/metrics");

const app = express();

// Metrics
app.use(metricsMiddleware);
app.get("/api/metrics", metricsEndpoint);

// Security
app.use(helmet());
app.use(generalLimiter);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing — raw body needed for Stripe webhooks
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Compression & logging
app.use(compression());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Route mounting ──
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// 404 handler
app.all("*", (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.originalUrl}`));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
