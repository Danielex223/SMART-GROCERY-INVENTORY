// src/pages/Reports.jsx
import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const hasSalesApi = () =>
  typeof api.getSales === "function" && typeof api.createSale === "function";

const LS_SALES_KEY = "smartstock_sales";

function loadLocalSales() {
  try { return JSON.parse(localStorage.getItem(LS_SALES_KEY) || "[]"); }
  catch { return []; }
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      // items -> for total products, low stock, inventory value
      const resp = await api.getItems("");
      const list = resp?.items ?? [];
      setItems(list);

      // sales -> from API or local fallback
      if (hasSalesApi()) {
        const s = await api.getSales();           // expected: { sales: [...] }
        setSales(s?.sales ?? []);
      } else {
        setSales(loadLocalSales());
      }
    } catch (e) {
      setErr(e.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // live refresh when a new sale is created (from Sales page)
    const handler = () => loadAll();
    window.addEventListener("smartstock:saleSaved", handler);
    // also refresh if another tab changes localStorage
    const onStorage = (e) => {
      if (e.key === LS_SALES_KEY) loadAll();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("smartstock:saleSaved", handler);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // computed metrics
  const totalProducts = items.length;

  const lowStockCount = useMemo(() => {
    return items.reduce((n, it) => {
      const qty = Number(it?.quantity || 0);
      const re = Number(it?.reorder || 0);
      return n + (qty <= re ? 1 : 0);
    }, 0);
  }, [items]);

  const inventoryValue = useMemo(() => {
    return items.reduce(
      (sum, it) => sum + Number(it?.price || 0) * Number(it?.quantity || 0),
      0
    );
  }, [items]);

  const salesTotal = useMemo(() => {
    return (sales ?? []).reduce((sum, s) => sum + Number(s?.total || 0), 0);
  }, [sales]);

  return (
    <div className="card">
      <h2>Reports &amp; Analytics</h2>
      {loading && <p>Loading…</p>}
      {err && <p className="error">{err}</p>}

      {!loading && (
        <div className="kpis" style={{marginTop:12}}>
          <div className="kpi">
            <div className="label">Total Products</div>
            <div className="value">{totalProducts}</div>
          </div>

          <div className="kpi">
            <div className="label">Inventory Value</div>
            <div className="value">{money(inventoryValue)}</div>
          </div>

          <div className="kpi">
            <div className="label">Total Sales</div>
            <div className="value">{money(salesTotal)}</div>
          </div>

          <div className="kpi">
            <div className="label">Low Stock</div>
            <div className="value">{lowStockCount}</div>
          </div>
        </div>
      )}
    </div>
  );
}
