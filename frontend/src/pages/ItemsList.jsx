import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import Modal from "../components/Modal.jsx";

/* ---------- helpers ---------- */
const filterInt = (s) =>
  (s ?? "").toString().replace(/[^0-9]/g, ""); // digits only

const filterDecimal = (s) =>
  (s ?? "")
    .toString()
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*)\./g, "$1");

const fmt2 = (v) =>
  v === "" || v == null || isNaN(v) ? "0.00" : Number(v).toFixed(2);

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);

  // 🆕 UPDATED FIELDS
  const blank = {
    barcode: "",
    name: "",
    price: "",
    quantity: "",
    reorder: "",
    supplier: "",
  };

  const [m, setM] = useState(blank);

  async function load() {
    setErr("");
    try {
      const d = await api.getItems(q);
      setItems(d.items || []);
    } catch (e) {
      setErr(e.message || "Failed to load items");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function del(id) {
    if (!confirm("Delete this item?")) return;
    try {
      await api.deleteItem(id);
      setItems((prev) =>
        prev.filter((x) => {
          const xid = (x.id ?? x._id ?? x?._id?.$oid)?.toString();
          return xid !== id;
        })
      );
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  async function create(e) {
    e.preventDefault();
    try {
      const payload = {
        barcode: m.barcode,
        name: m.name,
        price: Number(m.price || 0),
        quantity: Math.min(parseInt(m.quantity || 0), 10000), // MAX 10,000
        reorder: parseInt(m.reorder || 0),
        supplier: m.supplier,
        sku: "",       // REMOVED FIELD
        category: "",  // REMOVED FIELD
      };

      await api.createItem(payload);
      setOpen(false);
      setM(blank);
      load();
    } catch (e) {
      alert(e.message || "Create failed");
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: 10 }}>Products</h2>

      <div className="toolbar">
        <div className="search">
          <input
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn secondary" onClick={load}>
            Search
          </button>
        </div>
        <div className="spacer" />
        <button className="btn" onClick={() => setOpen(true)}>
          + Add Product
        </button>
      </div>

      {err && <p className="error">{err}</p>}
      {!items.length && (
        <p className="muted">
          No products yet. Click <b>+ Add Product</b>.
        </p>
      )}

      {!!items.length && (
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>QTY</th>
              <th>REORDER</th>
              <th>PRICE</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((raw) => {
              const realId =
                (raw.id ?? raw._id ?? raw?._id?.$oid)?.toString();
              const qty = Number(raw.quantity || 0);
              const reo = Number(raw.reorder || 0);
              const isLow = qty <= reo;

              return (
                <tr key={realId} className={isLow ? "tr-low" : ""}>
                  <td>{raw.name}</td>
                  <td>{qty}</td>
                  <td>{reo}</td>
                  <td>${fmt2(raw.price)}</td>
                  <td>
                    <span className={`chip ${isLow ? "danger" : "ok"}`}>
                      {isLow ? "Low" : "OK"}
                    </span>
                  </td>

                  <td style={{ display: "flex", gap: 10 }}>
                    <Link to={`/items/${realId}/edit`} className="link">
                      Edit
                    </Link>
                    <a
                      href="#"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault();
                        del(realId);
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ---------------- ADD PRODUCT MODAL ---------------- */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add New Product">
        <form onSubmit={create} className="grid">
          
          {/* BARCODE – digits only + max 6 */}
          <div>
            <label>Barcode (6 digits max)</label>
            <input
              value={m.barcode}
              maxLength={6}
              onChange={(e) =>
                setM({ ...m, barcode: filterInt(e.target.value).slice(0, 6) })
              }
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

          {/* QUANTITY – MAX 10,000 */}
          <div>
            <label>Quantity (max 10,000)</label>
            <input
              type="text"
              inputMode="numeric"
              value={m.quantity}
              onChange={(e) =>
                setM({
                  ...m,
                  quantity: filterInt(e.target.value).slice(0, 5), // 10000 = 5 digits
                })
              }
              onFocus={(e) => e.target.select()}
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
            <button className="btn">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
