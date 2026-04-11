import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-700">ShopHub</Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-primary-600">Products</Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-primary-600">
            <FiShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600">
                <FiUser size={20} /> {user.name?.split(" ")[0]}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Login</Link>
          )}
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-2" />
          </form>
          <Link to="/products" className="block py-2" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/cart" className="block py-2" onClick={() => setMenuOpen(false)}>Cart ({itemCount})</Link>
          {user ? (
            <>
              <Link to="/profile" className="block py-2" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link to="/orders" className="block py-2" onClick={() => setMenuOpen(false)}>Orders</Link>
              {user.role === "admin" && <Link to="/admin" className="block py-2" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-red-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block py-2 text-primary-600" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
