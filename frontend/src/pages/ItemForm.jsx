import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client.js";

/* ---------- helpers ---------- */
const filterInt = (s) => (s ?? "").toString().replace(/[^0-9]/g, "");
const filterDecimal = (s) =>
  (s ?? "")
    .toString()
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*)\./g, "$1");

const fmt2 = (v) =>
  v === "" || v == null || isNaN(v) ? "0.00" : Number(v).toFixed(2);

export default function ItemForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const blank = {
    barcode: "",
    name: "",
    price: "",
    quantity: "",
    reorder: "",
    supplier: "",
  };

  const [m, setM] = useState(blank);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Load item if editing
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setErr("");
        const d = await api.getItem(id);
        const x = d.item || d;

        setM({
          barcode: x.barcode ?? "",
          name: x.name ?? "",
          price: fmt2(x.price),
          quantity: String(x.quantity ?? ""),
          reorder: String(x.reorder ?? ""),
          supplier: x.supplier ?? "",
        });
      } catch (e) {
        setErr(e.message || "Failed to load item");
      }
    })();
  }, [id]);

  async function save(e) {
    e.preventDefault();
    try {
      setErr("");

      const payload = {
        barcode: m.barcode,
        name: m.name,
        price: Number(m.price || 0),
        quantity: Math.min(Number(m.quantity || 0), 10000),
        reorder: Number(m.reorder || 0),
        supplier: m.supplier,
        sku: "",       // removed
        category: "",  // removed
      };

      setLoading(true);

      if (id) {
        await api.updateItem(id, payload);
      } else {
        await api.createItem(payload);
      }

      nav("/items");
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: 20 }}>
        {id ? "Edit Product" : "Add New Product"}
      </h2>

      {err && <p className="error">{err}</p>}

      <form onSubmit={save} className="grid">

        {/* BARCODE */}
        <div>
          <label>Barcode (6 digits max)</label>
          <input
            value={m.barcode}
            maxLength={6}
            onChange={(e) =>
              setM({
                ...m,
                barcode: filterInt(e.target.value).slice(0, 6),
              })
            }
            required
          />
        </div>

        {/* NAME */}
        <div>
          <label>Product Name</label>
          <input
            value={m.name}
            onChange={(e) => setM({ ...m, name: e.target.value })}
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label>Price</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input
              className="has-prefix"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={m.price}
              onChange={(e) =>
                setM({ ...m, price: filterDecimal(e.target.value) })
              }
              onBlur={(e) => setM({ ...m, price: fmt2(e.target.value) })}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* QUANTITY — max 10,000 */}
        <div>
          <label>Quantity (max 10,000)</label>
          <input
            type="text"
            inputMode="numeric"
            value={m.quantity}
            onChange={(e) =>
              setM({
                ...m,
                quantity: filterInt(e.target.value).slice(0, 5), // 5 digits max
              })
            }
            onFocus={(e) => e.target.select()}
            required
          />
        </div>

        {/* REORDER */}
        <div>
          <label>Reorder Level</label>
          <input
            type="text"
            inputMode="numeric"
            value={m.reorder}
            onChange={(e) =>
              setM({ ...m, reorder: filterInt(e.target.value) })
            }
            onFocus={(e) => e.target.select()}
            required
          />
        </div>

        {/* SUPPLIER */}
        <div>
          <label>Supplier (optional)</label>
          <input
            value={m.supplier}
            onChange={(e) => setM({ ...m, supplier: e.target.value })}
          />
        </div>

        <div>
          <button className="btn" disabled={loading}>
            {loading ? "Saving…" : id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
