import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1, limit: 12, sort: "newest", ...initialFilters,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
      );
      const { data } = await api.get("/products", { params });
      setProducts(data.data);
      setPagination(data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, page: 1, ...newFilters }));
  };

  const goToPage = (page) => setFilters((prev) => ({ ...prev, page }));

  return { products, pagination, loading, filters, updateFilters, goToPage, refetch: fetchProducts };
};
