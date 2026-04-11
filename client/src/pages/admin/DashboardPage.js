import React, { useState, useEffect } from "react";
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox } from "react-icons/fi";
import Sidebar from "../../components/layout/Sidebar";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import SalesChart from "../../components/admin/dashboard/SalesChart";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import Loader from "../../components/common/Loader";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getDashboard(), adminService.getRevenue(30)])
      .then(([dashRes, revRes]) => {
        setStats(dashRes.data.data);
        setRevenue(revRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex"><Sidebar /><div className="flex-1"><Loader /></div></div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={FiDollarSign} color="text-green-600 bg-green-50" />
          <StatsCard title="Total Orders" value={stats?.totalOrders || 0} icon={FiShoppingBag} color="text-blue-600 bg-blue-50" />
          <StatsCard title="Customers" value={stats?.totalCustomers || 0} icon={FiUsers} color="text-purple-600 bg-purple-50" />
          <StatsCard title="Products" value={stats?.totalProducts || 0} icon={FiBox} color="text-orange-600 bg-orange-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={revenue} />
          <RecentOrders orders={stats?.recentOrders || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
