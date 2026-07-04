const express = require("express");
const router = express.Router();

let sales = [];
let nextId = 1;

// GET all sales
router.get("/", (req, res) => {
  res.json({ sales });
});

// CREATE sale
router.post("/", (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  const total_amount = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  const sale = {
    id: nextId++,
    date: new Date().toISOString(),
    items,
    total: total_amount,
  };

  sales.push(sale);

  res.json(sale);
});

// DELETE sale
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  sales = sales.filter((s) => s.id !== id);
  res.json({ success: true });
});

module.exports = router;
