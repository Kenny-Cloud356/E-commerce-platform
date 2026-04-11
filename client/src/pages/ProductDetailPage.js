import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../components/products/ProductDetail";
import ProductReviews from "../components/products/ProductReviews";
import Loader from "../components/common/Loader";
import { productService } from "../services/productService";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    productService.getBySlug(slug)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductDetail product={product} />
      <ProductReviews productId={product.id} />
    </div>
  );
};

export default ProductDetailPage;
