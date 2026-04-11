import React from "react";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Img</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.slug}`} className="font-medium hover:text-primary-600 truncate block">
          {item.name}
        </Link>
        <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
      </div>

      <div className="flex items-center border rounded-lg">
        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="p-1.5 hover:bg-gray-100"><FiMinus size={14} /></button>
        <span className="px-3 text-sm font-medium">{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1.5 hover:bg-gray-100"><FiPlus size={14} /></button>
      </div>

      <span className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</span>

      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
