import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiArrowLeft } from "react-icons/fi";

const links = [
  { to: "/admin", icon: FiGrid, label: "Dashboard" },
  { to: "/admin/products", icon: FiBox, label: "Products" },
  { to: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === to ? "bg-primary-600" : "hover:bg-gray-800"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <Link to="/" className="flex items-center gap-2 mt-12 text-gray-400 hover:text-white">
        <FiArrowLeft /> Back to Store
      </Link>
    </aside>
  );
};

export default Sidebar;
