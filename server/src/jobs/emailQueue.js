const { redisClient } = require("../config/redis");
const emailService = require("../services/emailService");
const logger = require("../config/logger");

const QUEUE_KEY = "email:queue";

const enqueue = async (type, data) => {
  await redisClient.lPush(QUEUE_KEY, JSON.stringify({ type, data, createdAt: Date.now() }));
};

const processQueue = async () => {
  const item = await redisClient.rPop(QUEUE_KEY);
  if (!item) return;

  const { type, data } = JSON.parse(item);

  try {
    switch (type) {
      case "welcome":
        await emailService.sendWelcome(data);
        break;
      case "password-reset":
        await emailService.sendPasswordReset(data.user, data.resetUrl);
        break;
      case "order-confirmation":
        await emailService.sendOrderConfirmation(data.user, data.order);
        break;
      default:
        logger.warn(`Unknown email type: ${type}`);
    }
  } catch (err) {
    logger.error(`Failed to process email job (${type}):`, err);
    // Re-queue failed jobs (max 3 retries tracked by attempt count)
    const parsed = JSON.parse(item);
    if ((parsed.attempts || 0) < 3) {
      parsed.attempts = (parsed.attempts || 0) + 1;
      await redisClient.lPush(QUEUE_KEY, JSON.stringify(parsed));
    }
  }
};

// Process emails every 5 seconds
const startEmailWorker = () => {
  setInterval(processQueue, 5000);
  logger.info("Email queue worker started");
};

module.exports = { enqueue, startEmailWorker };
