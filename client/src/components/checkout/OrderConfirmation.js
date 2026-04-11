import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import Button from "../common/Button";

const OrderConfirmation = ({ order }) => {
  return (
    <div className="text-center py-12">
      <FiCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-1">Thank you for your purchase.</p>
      <p className="text-gray-500 text-sm mb-8">Order ID: {order?.id?.slice(0, 8)}</p>
      <div className="flex gap-4 justify-center">
        <Link to="/orders"><Button variant="outline">View Orders</Button></Link>
        <Link to="/products"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
