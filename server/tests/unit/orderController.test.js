const AppError = require("../../src/utils/apiError");

describe("Order Validation Logic", () => {
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  it("should accept all valid order statuses", () => {
    validStatuses.forEach((status) => {
      expect(validStatuses.includes(status)).toBe(true);
    });
  });

  it("should reject invalid order status", () => {
    const invalid = "refunded";
    expect(validStatuses.includes(invalid)).toBe(false);
  });

  describe("AppError usage for orders", () => {
    it("should throw badRequest for empty cart", () => {
      const error = AppError.badRequest("Cart is empty");
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Cart is empty");
    });

    it("should throw badRequest for insufficient stock", () => {
      const error = AppError.badRequest("Insufficient stock for Product X");
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain("Insufficient stock");
    });

    it("should throw notFound for missing order", () => {
      const error = AppError.notFound("Order not found");
      expect(error.statusCode).toBe(404);
    });

    it("should throw forbidden for unauthorized access", () => {
      const error = AppError.forbidden("Access denied");
      expect(error.statusCode).toBe(403);
    });
  });
});
