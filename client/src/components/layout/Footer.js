import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">ShopHub</h3>
          <p className="text-sm">Your one-stop shop for everything you need. Quality products, fast shipping.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-white">Featured</Link></li>
            <li><Link to="/products?sort=newest" className="hover:text-white">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/orders" className="hover:text-white">Order History</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white">help@shophub.com</span></li>
            <li><span className="hover:text-white">1-800-SHOP-HUB</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-6 text-sm">
        &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
