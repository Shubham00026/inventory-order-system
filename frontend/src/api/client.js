import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Products
export const getProducts = () => client.get("/products");
export const createProduct = (data) => client.post("/products", data);
export const updateProduct = (id, data) => client.put(`/products/${id}`, data);
export const deleteProduct = (id) => client.delete(`/products/${id}`);

// Customers
export const getCustomers = () => client.get("/customers");
export const createCustomer = (data) => client.post("/customers", data);
export const deleteCustomer = (id) => client.delete(`/customers/${id}`);

// Orders
export const getOrders = () => client.get("/orders");
export const createOrder = (data) => client.post("/orders", data);
export const deleteOrder = (id) => client.delete(`/orders/${id}`);

export default client;