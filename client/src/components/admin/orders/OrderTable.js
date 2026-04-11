import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ORDER_STATUSES } from "../../../utils/constants";

const OrderTable = ({ orders, onStatusChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50 border-b">
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
              <td className="p-3">{order.user_name}<br /><span className="text-xs text-gray-400">{order.user_email}</span></td>
              <td className="p-3 font-medium">{formatCurrency(order.total)}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full ${order.payment_status === "paid" ? "text-green-600 bg-green-100" : "text-gray-600 bg-gray-100"}`}>
                  {order.payment_status}
                </span>
              </td>
              <td className="p-3">
                <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1">
                  {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </td>
              <td className="p-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
