const express = require("express");
const router = express.Router();

const suppliers = require("./suppliersStore");

// In-memory items
let items = [];
let nextId = 1;

// GET ALL ITEMS
router.get("/", (req, res) => {
  res.json({ items });
});

// GET ONE ITEM
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((x) => x.id === id);

  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json({ item });
});

// CREATE ITEM + auto supplier sync
router.post("/", (req, res) => {
  const item = {
    id: nextId++,
    barcode: req.body.barcode,
    name: req.body.name,
    price: Number(req.body.price || 0),
    quantity: Number(req.body.quantity || 0),
    reorder: Number(req.body.reorder || 0),
    supplier: req.body.supplier || "",
    sku: "",
    category: "",
  };

  items.push(item);

  // AUTO-SUPPLIER
  if (item.supplier.trim() !== "") {
    suppliers.addProductToSupplier(item.supplier);
    suppliers.recountAll(items);
  }

  res.json({ ok: true, item });
});

// UPDATE ITEM + supplier sync
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = items.findIndex((x) => x.id === id);

  if (idx < 0) return res.status(404).json({ error: "Item not found" });

  const updated = {
    ...items[idx],
    barcode: req.body.barcode,
    name: req.body.name,
    price: Number(req.body.price || 0),
    quantity: Number(req.body.quantity || 0),
    reorder: Number(req.body.reorder || 0),
    supplier: req.body.supplier || "",
  };

  items[idx] = updated;

  suppliers.recountAll(items);
  res.json({ ok: true, item: updated });
});

// DELETE ITEM + recount suppliers
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  items = items.filter((x) => x.id !== id);

  suppliers.recountAll(items);

  res.json({ ok: true });
});

module.exports = router;
