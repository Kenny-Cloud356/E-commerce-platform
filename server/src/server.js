require("dotenv").config();
const app = require("./app");
const { connectDB, pool } = require("./config/database");
const { connectRedis, redisClient } = require("./config/redis");
const logger = require("./config/logger");
const { startEmailWorker } = require("./jobs/emailQueue");
const { startCleanupWorker } = require("./jobs/orderCleanup");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();

    // Start background workers
    startEmailWorker();
    startCleanupWorker();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await pool.end();
        await redisClient.quit();
        logger.info("Server shut down complete");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
