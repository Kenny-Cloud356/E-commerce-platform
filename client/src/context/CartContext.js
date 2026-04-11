import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); setTotal(0); return; }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(data.data.items);
      setTotal(data.data.total);
    } catch { /* ignore */ }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/add", { productId, quantity });
    setItems(data.data.items);
    setTotal(data.data.total);
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setItems(data.data.items);
    setTotal(data.data.total);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setItems(data.data.items);
    setTotal(data.data.total);
  }, []);

  const clearCart = useCallback(async () => {
    await api.delete("/cart/clear");
    setItems([]);
    setTotal(0);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, itemCount, loading, addItem, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
