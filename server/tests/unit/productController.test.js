const { slugify, buildPaginationMeta, pick } = require("../../src/utils/helpers");
const AppError = require("../../src/utils/apiError");

describe("Helpers", () => {
  describe("slugify", () => {
    it("should create a valid slug", () => {
      expect(slugify("Wireless Bluetooth Headphones")).toBe("wireless-bluetooth-headphones");
      expect(slugify("USB-C Fast Charging Cable 3-Pack")).toBe("usb-c-fast-charging-cable-3-pack");
      expect(slugify("  Hello   World  ")).toBe("hello-world");
      expect(slugify("Special @#$ Characters!")).toBe("special-characters");
    });
  });

  describe("buildPaginationMeta", () => {
    it("should calculate pagination correctly", () => {
      const meta = buildPaginationMeta(100, 1, 12);
      expect(meta.total).toBe(100);
      expect(meta.page).toBe(1);
      expect(meta.limit).toBe(12);
      expect(meta.totalPages).toBe(9);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(false);
    });

    it("should handle last page correctly", () => {
      const meta = buildPaginationMeta(100, 9, 12);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(true);
    });

    it("should handle single page", () => {
      const meta = buildPaginationMeta(5, 1, 12);
      expect(meta.totalPages).toBe(1);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(false);
    });
  });

  describe("pick", () => {
    it("should pick specified keys from an object", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });

    it("should ignore undefined keys", () => {
      const obj = { a: 1 };
      expect(pick(obj, ["a", "b"])).toEqual({ a: 1 });
    });
  });
});

describe("AppError", () => {
  it("should create errors with correct status codes", () => {
    const badReq = AppError.badRequest("Bad input");
    expect(badReq.statusCode).toBe(400);
    expect(badReq.message).toBe("Bad input");
    expect(badReq.isOperational).toBe(true);

    expect(AppError.unauthorized().statusCode).toBe(401);
    expect(AppError.forbidden().statusCode).toBe(403);
    expect(AppError.notFound().statusCode).toBe(404);
    expect(AppError.conflict().statusCode).toBe(409);
    expect(AppError.internal().statusCode).toBe(500);
  });
});
