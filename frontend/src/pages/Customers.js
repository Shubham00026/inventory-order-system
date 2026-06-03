import React, { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../api/client";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      setError("Failed to load customers");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCustomer(form);
      setForm({ full_name: "", email: "", phone: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create customer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try { await deleteCustomer(id); load(); }
    catch { setError("Failed to delete customer"); }
  };

  return (
    <div className="container">
      <h1>Customers</h1>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Full Name" value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <div className="form-row">
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <button className="btn" type="submit">Add Customer</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th></th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center", color: "#a0aec0" }}>No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}