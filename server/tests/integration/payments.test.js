const request = require("supertest");
const app = require("../../src/app");

describe("Payments API Integration", () => {
  describe("POST /api/payments/create-intent", () => {
    it("should reject unauthenticated payment intent creation", async () => {
      const res = await request(app)
        .post("/api/payments/create-intent")
        .send({ amount: 49.99 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/payments/webhook", () => {
    it("should reject webhook with invalid signature", async () => {
      const res = await request(app)
        .post("/api/payments/webhook")
        .set("stripe-signature", "invalid-signature")
        .send(JSON.stringify({ type: "payment_intent.succeeded" }));

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Protected routes", () => {
    it("should reject cart access without token", async () => {
      const res = await request(app).get("/api/cart");
      expect(res.statusCode).toBe(401);
    });

    it("should reject review creation without token", async () => {
      const res = await request(app)
        .post("/api/reviews")
        .send({ product_id: "fake-id", rating: 5 });

      expect(res.statusCode).toBe(401);
    });

    it("should reject admin access without token", async () => {
      const res = await request(app).get("/api/admin/dashboard");
      expect(res.statusCode).toBe(401);
    });

    it("should reject upload without token", async () => {
      const res = await request(app).post("/api/upload/image");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("404 handling", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/nonexistent-route");
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
