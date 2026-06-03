import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="brand">📦 Inventory System</span>
      <NavLink to="/" end>Products</NavLink>
      <NavLink to="/customers">Customers</NavLink>
      <NavLink to="/orders">Orders</NavLink>
    </nav>
  );
}