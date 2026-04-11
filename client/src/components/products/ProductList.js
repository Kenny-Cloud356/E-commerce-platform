import React from "react";
import ProductCard from "./ProductCard";
import Loader from "../common/Loader";

const ProductList = ({ products, loading }) => {
  if (loading) return <Loader />;

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-xl mb-2">No products found</p>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
