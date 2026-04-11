import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import Pagination from "../components/common/Pagination";
import { orderService } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { ORDER_STATUSES } from "../utils/constants";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    orderService.getMyOrders({ page, limit: 10 })
      .then(({ data }) => { setOrders(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No orders yet</p>
          <Link to="/products" className="text-primary-600 hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = ORDER_STATUSES[order.status] || {};
            return (
              <Link key={order.id} to={`/orders`}
                className="block bg-white border rounded-xl p-5 hover:shadow-sm transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.label}</span>
                    <p className="font-semibold mt-1">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default OrdersPage;
