import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const i = await api.getItems();
      const s = await api.getSales();

      setItems(i.items || []);
      setSales(s.sales || []);
    } catch (e) {
      console.error("Dashboard load error:", e.message);
    }
  }

  const totalRevenue = sales.reduce(
    (sum, s) => sum + (s.total || 0),
    0
  );

  return (
    <div className="card" style={{ padding: "40px" }}>
      {/* -------- WELCOME -------- */}
      <h1 style={{ fontSize: "34px", fontWeight: "700", marginBottom: "5px" }}>
        Welcome 👋
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Here's an overview of your store today.
      </p>

      {/* -------- CARD GRID -------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          marginTop: "20px",
        }}
      >
        {/* Total Products */}
        <div
          className="card"
          style={{
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>
            Total Products
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700" }}>
            {items.length}
          </p>
        </div>

        {/* Total Sales */}
        <div
          className="card"
          style={{
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>
            Total Sales
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700" }}>
            {sales.length}
          </p>
        </div>

        {/* Total Revenue */}
        <div
          className="card"
          style={{
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>
            Total Revenue
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "green",
            }}
          >
            ${totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
