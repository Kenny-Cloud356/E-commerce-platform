export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-100" },
  processing: { label: "Processing", color: "text-blue-600 bg-blue-100" },
  shipped: { label: "Shipped", color: "text-purple-600 bg-purple-100" },
  delivered: { label: "Delivered", color: "text-green-600 bg-green-100" },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-100" },
};

export const USER_ROLES = { customer: "Customer", admin: "Admin" };

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];
