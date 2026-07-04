import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Modal from "../components/Modal.jsx";

/* ----------- helpers ----------- */
const digitsOnly = (s) => (s ?? "").replace(/[^0-9]/g, "");

export default function Suppliers() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [editId, setEditId] = useState(null);

  const blank = {
    name: "",
    email: "",
    phone: "",
  };

  const [m, setM] = useState(blank);

  async function load() {
    try {
      const d = await api.getSuppliers();
      setList(d.suppliers || []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load suppliers.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* ---------- VALIDATION ---------- */
  function validate() {
    if (!m.name.trim()) return "Name is required.";

    if (!m.email.endsWith("@gmail.com"))
      return "Email must end with @gmail.com";

    if (digitsOnly(m.phone).length !== 10)
      return "Phone number must be exactly 10 digits.";

    return "";
  }

  /* ---------- SAVE SUPPLIER ---------- */
  async function save(e) {
    e.preventDefault();
    const v = validate();
    if (v) return alert(v);

    try {
      const payload = {
        name: m.name.trim(),
        email: m.email.trim(),
        phone: digitsOnly(m.phone),
      };

      if (editId) {
        await api.updateSupplier(editId, payload);
      } else {
        await api.createSupplier(payload);
      }

      setOpen(false);
      setEditId(null);
      setM(blank);
      load();
    } catch (e) {
      alert(e.message || "Save failed.");
    }
  }

  /* ---------- DELETE ---------- */
  async function del(id) {
    if (!confirm("Delete supplier?")) return;
    try {
      await api.deleteSupplier(id);
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert("Failed to delete.");
    }
  }

  /* ---------- OPEN EDIT ---------- */
  function startEdit(s) {
    setEditId(s.id);
    setM({
      name: s.name ?? "",
      email: s.email ?? "",
      phone: s.phone ?? "",
    });
    setOpen(true);
  }

  /* ---------- OPEN CREATE ---------- */
  function startAdd() {
    setEditId(null);
    setM(blank);
    setOpen(true);
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: 20 }}>Suppliers</h2>

      <div style={{ display: "flex", marginBottom: 15 }}>
        <div className="spacer" />
        <button className="btn" onClick={startAdd}>
          + Add Supplier
        </button>
      </div>

      {err && <p className="error">{err}</p>}

      {!list.length && <p className="muted">No suppliers added yet.</p>}

      {list.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>PRODUCTS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.products || 0}</td>

                <td style={{ display: "flex", gap: 10 }}>
                  <a
                    href="#"
                    className="link"
                    onClick={(e) => {
                      e.preventDefault();
                      startEdit(s);
                    }}
                  >
                    Edit
                  </a>

                  <a
                    href="#"
                    className="link"
                    onClick={(e) => {
                      e.preventDefault();
                      del(s.id);
                    }}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ------------ MODAL ------------- */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        title={editId ? "Edit Supplier" : "Add Supplier"}
      >
        <form onSubmit={save} className="grid">
          <div>
            <label>Name</label>
            <input
              value={m.name}
              onChange={(e) => setM({ ...m, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Email (@gmail.com only)</label>
            <input
              value={m.email}
              onChange={(e) => setM({ ...m, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Phone (10 digits)</label>
            <input
              value={m.phone}
              maxLength={10}
              onChange={(e) =>
                setM({ ...m, phone: digitsOnly(e.target.value).slice(0, 10) })
              }
              required
            />
          </div>

          <div>
            <button className="btn">
              {editId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
