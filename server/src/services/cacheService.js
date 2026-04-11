const { redisClient } = require("../config/redis");
const logger = require("../config/logger");

const DEFAULT_TTL = 3600; // 1 hour

const get = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error("Cache get error:", err);
    return null;
  }
};

const set = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    logger.error("Cache set error:", err);
  }
};

const del = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error("Cache delete error:", err);
  }
};

const invalidatePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    logger.error("Cache invalidate error:", err);
  }
};

module.exports = { get, set, del, invalidatePattern };
