import React, { useState, useEffect } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { productService } from "../../../services/productService";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", compare_price: "", stock: "", category_id: "", featured: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    productService.getCategories().then(({ data }) => setCategories(data.data)).catch(() => {});
    if (product) {
      setForm({
        name: product.name, description: product.description || "", price: product.price,
        compare_price: product.compare_price || "", stock: product.stock,
        category_id: product.category_id || "", featured: product.featured,
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (form.compare_price) data.compare_price = parseFloat(form.compare_price);
      if (product) {
        await productService.update(product.id, data);
      } else {
        await productService.create(data);
      }
      onSave();
    } catch { /* handled by caller */ }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 h-24" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price" type="number" step="0.01" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input label="Compare Price" type="number" step="0.01" value={form.compare_price}
          onChange={(e) => setForm({ ...form, compare_price: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Stock" type="number" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border rounded-lg px-3 py-2">
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
        <span className="text-sm">Featured Product</span>
      </label>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{product ? "Update" : "Create"} Product</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default ProductForm;
