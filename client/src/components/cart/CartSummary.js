import React from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

const CartSummary = ({ total, itemCount }) => {
  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
      {total > 0 && (
        <Link to="/checkout">
          <Button className="w-full mt-6">Proceed to Checkout</Button>
        </Link>
      )}
      {total > 0 && total < 50 && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Add {formatCurrency(50 - total)} more for free shipping!
        </p>
      )}
    </div>
  );
};

export default CartSummary;
