const express = require("express");
const router = express.Router();

const store = require("./suppliersStore");

// GET ALL SUPPLIERS
router.get("/", (req, res) => {
  res.json({ suppliers: store.list() });
});

// CREATE SUPPLIER
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;

  // ensure supplier exists
  store.addProductToSupplier(name);

  const list = store.list();
  const s = list.find((x) => x.name === name);

  if (email) s.email = email;
  if (phone) s.phone = phone;

  res.json({ ok: true, supplier: s });
});

// UPDATE SUPPLIER
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updated = store.update(id, req.body);

  if (!updated) return res.status(404).json({ error: "Supplier not found" });

  res.json({ ok: true, supplier: updated });
});

// DELETE SUPPLIER
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  store.delete(id);

  res.json({ ok: true });
});

module.exports = router;
