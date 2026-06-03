import React, { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../api/client";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", sku: "", price: "", quantity: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createProduct({
        name: form.name,
        sku: form.sku,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      });
      setForm({ name: "", sku: "", price: "", quantity: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await deleteProduct(id); load(); }
    catch { setError("Failed to delete product"); }
  };

  return (
    <div className="container">
      <h1>Products</h1>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="SKU" value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          </div>
          <div className="form-row">
            <input type="number" step="0.01" placeholder="Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input type="number" placeholder="Quantity" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          </div>
          <button className="btn" type="submit">Add Product</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${p.quantity < 10 ? "badge-low" : ""}`}>
                    {p.quantity}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center", color: "#a0aec0" }}>No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}