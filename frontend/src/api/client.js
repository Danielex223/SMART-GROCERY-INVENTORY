// src/api/client.js
const BASE = "http://localhost:3000";

// ---------------- TOKEN HANDLING ----------------
let TOKEN = localStorage.getItem("token") || "";

// return token (needed by App.jsx)
export function getToken() {
  return TOKEN;
}

export function setToken(t) {
  TOKEN = t;
  if (t) localStorage.setItem("token", t);
}

export function clearToken() {
  TOKEN = "";
  localStorage.removeItem("token");
}

// automatically attach auth header
function authHeaders() {
  return TOKEN ? { Authorization: "Bearer " + TOKEN } : {};
}

// ---------------- FIXED + SAFE FETCH WRAPPER ----------------
async function send(path, method = "GET", body) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  };

  if (body) opts.body = JSON.stringify(body);

  let res;

  // Catch backend not reachable → prevents local-only mode bug
  try {
    res = await fetch(BASE + path, opts);
  } catch (err) {
    throw new Error("network-failed");
  }

  // Safe JSON parse (prevents local-only fallback)
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ---------------- API EXPORTS ----------------
export const api = {
  // AUTH
  login: (email, password) =>
    send("/auth/login", "POST", { email, password }),

  register: (name, email, password) =>
    send("/auth/register", "POST", { name, email, password }),

  // ITEMS
  getItems: () => send("/items"),
  getItem: (id) => send(`/items/${id}`),
  createItem: (payload) => send("/items", "POST", payload),
  updateItem: (id, payload) => send(`/items/${id}`, "PUT", payload),
  deleteItem: (id) => send(`/items/${id}`, "DELETE"),

  // SUPPLIERS
  getSuppliers: () => send("/suppliers"),
  createSupplier: (p) => send("/suppliers", "POST", p),
  updateSupplier: (id, p) => send(`/suppliers/${id}`, "PUT", p),
  deleteSupplier: (id) => send(`/suppliers/${id}`, "DELETE"),

  // SALES
  getSales: () => send("/sales"),
  createSale: (items) =>
    send("/sales", "POST", { items }),

  deleteSale: (id) => send(`/sales/${id}`, "DELETE"),
};
