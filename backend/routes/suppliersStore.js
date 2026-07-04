let suppliers = [];
let nextSupplierId = 1;

function normalize(name) {
  return name.trim().toLowerCase();
}

module.exports = {
  list() {
    return suppliers;
  },

  addProductToSupplier(name) {
    if (!name) return;

    const key = normalize(name);
    let s = suppliers.find((x) => normalize(x.name) === key);

    // CREATE NEW SUPPLIER
    if (!s) {
      s = {
        id: nextSupplierId++,
        name: name,
        email: "",
        phone: "",
        products: 1,
      };
      suppliers.push(s);
    } else {
      s.products++;
    }
  },

  // RECALCULATE PRODUCT COUNTS BASED ON ITEMS LIST
  recountAll(items) {
    suppliers.forEach((s) => (s.products = 0));

    items.forEach((i) => {
      if (i.supplier && i.supplier.trim() !== "") {
        this.addProductToSupplier(i.supplier);
      }
    });
  },

  update(id, data) {
    const idx = suppliers.findIndex((s) => s.id === id);
    if (idx < 0) return null;

    suppliers[idx] = { ...suppliers[idx], ...data };
    return suppliers[idx];
  },

  delete(id) {
    suppliers = suppliers.filter((s) => s.id !== id);
  },
};
