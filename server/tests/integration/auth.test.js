const request = require("supertest");
const app = require("../../src/app");

describe("Auth API Integration", () => {
  describe("POST /api/auth/register", () => {
    it("should reject registration with missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject registration with invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "invalid-email", password: "password123" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject registration with weak password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "test@example.com", password: "short" });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should reject login with missing credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it("should reject login with invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "not-an-email", password: "password123" });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should reject with missing refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });
});
