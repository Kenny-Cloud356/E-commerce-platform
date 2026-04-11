const request = require("supertest");
const app = require("../../src/app");

describe("Products API Integration", () => {
  describe("GET /api/products", () => {
    it("should return products list with pagination", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("pagination");
    });

    it("should support query parameters", async () => {
      const res = await request(app).get("/api/products?page=1&limit=5&sort=price_asc");
      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.limit).toBe(5);
    });
  });

  describe("GET /api/products/search", () => {
    it("should require search query", async () => {
      const res = await request(app).get("/api/products/search");
      expect(res.statusCode).toBe(400);
    });

    it("should return search results", async () => {
      const res = await request(app).get("/api/products/search?q=headphones");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/products", () => {
    it("should reject unauthenticated product creation", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Test Product", price: 9.99, stock: 10 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/categories", () => {
    it("should return categories list", async () => {
      const res = await request(app).get("/api/categories");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
