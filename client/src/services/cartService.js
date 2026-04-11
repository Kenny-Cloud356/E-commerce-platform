import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),
  addItem: (productId, quantity = 1) => api.post("/cart/add", { productId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),
};
