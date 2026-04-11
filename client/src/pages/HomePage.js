import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/products/ProductList";
import { productService } from "../services/productService";

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getAll({ featured: true, limit: 8 }),
      productService.getCategories(),
    ])
      .then(([productsRes, categoriesRes]) => {
        setFeatured(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to ShopHub</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl">
            Discover amazing products at great prices. From electronics to fashion, we have everything you need.
          </p>
          <Link to="/products" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`}
              className="bg-white border rounded-xl p-6 text-center hover:shadow-md transition">
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.description?.slice(0, 50)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products?featured=true" className="text-primary-600 hover:underline">View All</Link>
        </div>
        <ProductList products={featured} loading={loading} />
      </section>
    </div>
  );
};

export default HomePage;
