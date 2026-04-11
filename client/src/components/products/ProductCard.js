import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import Rating from "../common/Rating";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return toast.info("Please log in to add items to cart");
    try {
      await addItem(product.id);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">No Image</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.category_name}</p>
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <Rating value={product.avg_rating} count={product.num_reviews} size={14} />
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.compare_price && (
              <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(product.compare_price)}</span>
            )}
          </div>
          <button onClick={handleAddToCart} className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition">
            <FiShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
