import api from "./api";

export const orderService = {
  createOrder: (shippingAddress) => api.post("/orders", { shippingAddress }),
  getMyOrders: (params) => api.get("/orders/my-orders", { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrders: (params) => api.get("/orders/all", { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};
