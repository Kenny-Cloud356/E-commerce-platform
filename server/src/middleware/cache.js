const cacheService = require("../services/cacheService");

const cacheMiddleware = (ttl = 300) => async (req, res, next) => {
  if (req.method !== "GET") return next();

  const key = `cache:${req.originalUrl}`;
  const cached = await cacheService.get(key);

  if (cached) {
    return res.json(cached);
  }

  // Override res.json to cache the response
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200) {
      cacheService.set(key, data, ttl);
    }
    return originalJson(data);
  };

  next();
};

module.exports = { cacheMiddleware };
