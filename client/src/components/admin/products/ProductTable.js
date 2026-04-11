import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "../../../utils/formatCurrency";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50 border-b">
            <th className="p-3">Product</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Category</th>
            <th className="p-3">Featured</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                    {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
              </td>
              <td className="p-3">{formatCurrency(product.price)}</td>
              <td className="p-3">
                <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
              </td>
              <td className="p-3 text-gray-500">{product.category_name || "—"}</td>
              <td className="p-3">{product.featured ? "Yes" : "No"}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800"><FiEdit size={16} /></button>
                  <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
