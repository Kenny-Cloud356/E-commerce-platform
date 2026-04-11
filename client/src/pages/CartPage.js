import React from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import Loader from "../components/common/Loader";
import { useCart } from "../hooks/useCart";

const CartPage = () => {
  const { items, total, itemCount, loading, clearCart } = useCart();

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/products" className="text-primary-600 hover:underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">{itemCount} items</span>
              <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
            </div>
            {items.map((item) => <CartItem key={item.id} item={item} />)}
          </div>
          <div className="w-full lg:w-80">
            <CartSummary total={total} itemCount={itemCount} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
