import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";

const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-8">No sales data available</p>;
  }

  const maxRevenue = Math.max(...data.map((d) => parseFloat(d.revenue)));

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Revenue (Last 30 Days)</h3>
      <div className="flex items-end gap-1 h-48">
        {data.map((day, i) => {
          const height = maxRevenue > 0 ? (parseFloat(day.revenue) / maxRevenue) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div className="hidden group-hover:block absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {new Date(day.date).toLocaleDateString()} - {formatCurrency(day.revenue)}
              </div>
              <div className="w-full bg-primary-500 rounded-t" style={{ height: `${Math.max(height, 2)}%` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesChart;
