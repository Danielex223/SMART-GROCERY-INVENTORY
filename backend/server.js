const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const supplierRoutes = require("./routes/suppliers");
const salesRoutes = require("./routes/sales");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/sales", salesRoutes);

// root
app.get("/", (req, res) => {
  res.json({ status: "backend running" });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
