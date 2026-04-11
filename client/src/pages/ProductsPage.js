import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductList from "../components/products/ProductList";
import ProductFilter from "../components/products/ProductFilter";
import Pagination from "../components/common/Pagination";
import { useProducts } from "../hooks/useProducts";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const initialFilters = {
    category: searchParams.get("category") || "",
    q: searchParams.get("q") || "",
    featured: searchParams.get("featured") || "",
  };

  const { products, pagination, loading, filters, updateFilters, goToPage } = useProducts(initialFilters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {filters.q ? `Search: "${filters.q}"` : "All Products"}
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <ProductFilter filters={filters} onFilterChange={updateFilters} />
        </aside>
        <main className="flex-1">
          <ProductList products={products} loading={loading} />
          <Pagination pagination={pagination} onPageChange={goToPage} />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
