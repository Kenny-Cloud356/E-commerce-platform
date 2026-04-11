const request = require("supertest");
const app = require("../../src/app");

describe("Orders API Integration", () => {
  describe("POST /api/orders", () => {
    it("should reject unauthenticated order creation", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "US",
          },
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/orders/my-orders", () => {
    it("should reject unauthenticated access", async () => {
      const res = await request(app).get("/api/orders/my-orders");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/orders/all", () => {
    it("should reject unauthenticated access", async () => {
      const res = await request(app).get("/api/orders/all");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/orders/:id/status", () => {
    it("should reject unauthenticated status update", async () => {
      const res = await request(app)
        .put("/api/orders/fake-id/status")
        .send({ status: "processing" });

      expect(res.statusCode).toBe(401);
    });
  });
});
