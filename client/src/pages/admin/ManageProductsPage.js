import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import ProductTable from "../../components/admin/products/ProductTable";
import ProductForm from "../../components/admin/products/ProductForm";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { productService } from "../../services/productService";
import { toast } from "react-toastify";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchProducts = (p = page) => {
    setLoading(true);
    productService.getAll({ page: p, limit: 20 })
      .then(({ data }) => { setProducts(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleEdit = (product) => { setEditing(product); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await productService.delete(id); toast.success("Product deleted"); fetchProducts(); }
    catch { toast.error("Delete failed"); }
  };
  const handleSave = () => { setShowForm(false); setEditing(null); toast.success("Product saved!"); fetchProducts(); };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>Add Product</Button>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="bg-white rounded-xl border">
              <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}

        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Product" : "New Product"}>
          <ProductForm product={editing} onSave={handleSave} onCancel={() => setShowForm(false)} />
        </Modal>
      </div>
    </div>
  );
};

export default ManageProductsPage;
