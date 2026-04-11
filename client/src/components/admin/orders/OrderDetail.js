import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ORDER_STATUSES } from "../../../utils/constants";

const OrderDetail = ({ order }) => {
  if (!order) return null;
  const status = ORDER_STATUSES[order.status] || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Order #{order.id?.slice(0, 8)}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.label}</span>
      </div>

      {order.items && (
        <div>
          <h4 className="font-medium mb-2">Items</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}

      {order.shipping_address && (
        <div>
          <h4 className="font-medium mb-2">Shipping Address</h4>
          <p className="text-sm text-gray-600">
            {order.shipping_address.street}<br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
            {order.shipping_address.country}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
