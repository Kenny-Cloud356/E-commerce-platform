import React, { useState } from "react";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import Rating from "../common/Rating";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) return toast.info("Please log in to add items to cart");
    try {
      await addItem(product.id, quantity);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
          {product.images?.[selectedImage] ? (
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">No Image</div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? "border-primary-600" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-primary-600 font-medium mb-2">{product.category_name}</p>
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
        <Rating value={product.avg_rating} count={product.num_reviews} size={18} />

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
          {product.compare_price && (
            <span className="text-xl text-gray-400 line-through">{formatCurrency(product.compare_price)}</span>
          )}
        </div>

        <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

        <div className="mt-6">
          <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100"><FiMinus /></button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-gray-100"><FiPlus /></button>
            </div>
            <Button onClick={handleAddToCart} className="flex items-center gap-2 flex-1">
              <FiShoppingCart /> Add to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
