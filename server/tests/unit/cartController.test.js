const asyncHandler = require("../../src/utils/asyncHandler");

describe("asyncHandler", () => {
  it("should call the function and pass to next on error", async () => {
    const error = new Error("Test error");
    const fn = jest.fn().mockRejectedValue(error);
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should not call next on success", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
