const { hashPassword, comparePassword, generateAccessToken, verifyAccessToken, generateResetToken } = require("../../src/services/authService");

describe("Auth Service", () => {
  describe("hashPassword & comparePassword", () => {
    it("should hash and verify a password correctly", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it("should return false for wrong password", async () => {
      const hash = await hashPassword("correctPassword1");
      const isMatch = await comparePassword("wrongPassword1", hash);
      expect(isMatch).toBe(false);
    });
  });

  describe("JWT tokens", () => {
    const mockUser = { id: "abc-123", email: "test@example.com", role: "customer" };

    it("should generate and verify an access token", () => {
      process.env.JWT_SECRET = "test-secret-key";
      process.env.JWT_EXPIRES_IN = "1h";

      const token = generateAccessToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = verifyAccessToken(token);
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it("should throw for an invalid token", () => {
      process.env.JWT_SECRET = "test-secret-key";
      expect(() => verifyAccessToken("invalid-token")).toThrow();
    });
  });

  describe("generateResetToken", () => {
    it("should return token, hash, and expiry", () => {
      const result = generateResetToken();
      expect(result.token).toBeDefined();
      expect(result.hash).toBeDefined();
      expect(result.expires).toBeInstanceOf(Date);
      expect(result.expires.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
