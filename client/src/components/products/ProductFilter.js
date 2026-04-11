import React, { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { SORT_OPTIONS } from "../../utils/constants";

const ProductFilter = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getCategories().then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select value={filters.sort || "newest"} onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full border rounded-lg px-3 py-2">
          {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <select value={filters.category || ""} onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full border rounded-lg px-3 py-2">
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice || ""}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-1/2 border rounded-lg px-3 py-2" min="0" />
          <input type="number" placeholder="Max" value={filters.maxPrice || ""}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-1/2 border rounded-lg px-3 py-2" min="0" />
        </div>
      </div>

      <button onClick={() => onFilterChange({ category: "", minPrice: "", maxPrice: "", sort: "newest" })}
        className="text-sm text-primary-600 hover:underline">Clear Filters</button>
    </div>
  );
};

export default ProductFilter;
