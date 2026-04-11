import api from "./api";

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  getRevenue: (period = 30) => api.get(`/admin/revenue?period=${period}`),
  getUsers: (params) => api.get("/users", { params }),
  toggleUserStatus: (id) => api.put(`/users/${id}/toggle-status`),
};
