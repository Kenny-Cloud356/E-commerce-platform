import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

import DashboardPage from "../pages/admin/DashboardPage";
import ManageProductsPage from "../pages/admin/ManageProductsPage";
import ManageOrdersPage from "../pages/admin/ManageOrdersPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/:slug" element={<ProductDetailPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
    <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
    <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

    <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
    <Route path="/admin/products" element={<AdminRoute><ManageProductsPage /></AdminRoute>} />
    <Route path="/admin/orders" element={<AdminRoute><ManageOrdersPage /></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
