import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ORDER_STATUSES } from "../../../utils/constants";

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Recent Orders</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent orders</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = ORDER_STATUSES[order.status] || {};
              return (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                  <td className="py-3">{order.user_name}</td>
                  <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentOrders;
