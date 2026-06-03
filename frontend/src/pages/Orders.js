import React, { useEffect, useState } from "react";
import {
  getOrders, createOrder, deleteOrder,
  getCustomers, getProducts,
} from "../api/client";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [o, c, p] = await Promise.all([getOrders(), getCustomers(), getProducts()]);
      setOrders(o.data);
      setCustomers(c.data);
      setProducts(p.data);
    } catch {
      setError("Failed to load data");
    }
  };

  useEffect(() => { load(); }, []);

  const updateItem = (idx, field, value) => {
    const next = [...items];
    next[idx][field] = value;
    setItems(next);
  };

  const addItemRow = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const removeItemRow = (idx) => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createOrder({
        customer_id: parseInt(customerId, 10),
        items: items.map((it) => ({
          product_id: parseInt(it.product_id, 10),
          quantity: parseInt(it.quantity, 10),
        })),
      });
      setCustomerId("");
      setItems([{ product_id: "", quantity: 1 }]);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create order");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    try { await deleteOrder(id); load(); }
    catch { setError("Failed to delete order"); }
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Create Order</h2>
        <form onSubmit={handleSubmit}>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
            ))}
          </select>

          {items.map((it, idx) => (
            <div className="form-row" key={idx} style={{ alignItems: "center" }}>
              <select value={it.product_id}
                onChange={(e) => updateItem(idx, "product_id", e.target.value)} required>
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price.toFixed(2)}, stock: {p.quantity})
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="number" min="1" value={it.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)} required />
                {items.length > 1 && (
                  <button type="button" className="btn btn-danger"
                    onClick={() => removeItemRow(idx)}>✕</button>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="btn" style={{ background: "#718096", marginBottom: "12px" }}
            onClick={addItemRow}>+ Add Item</button>
          <br />
          <button className="btn" type="submit">Create Order</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const cust = customers.find((c) => c.id === o.customer_id);
              return (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{cust ? cust.full_name : `#${o.customer_id}`}</td>
                  <td>{o.items.length} item(s)</td>
                  <td>${o.total_amount.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center", color: "#a0aec0" }}>No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}