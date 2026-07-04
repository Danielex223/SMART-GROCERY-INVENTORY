import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function NewSaleModal({ onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(""); // must enter manually
  const [total, setTotal] = useState(0);

  // load products
  useEffect(() => {
    api.getItems().then((data) => {
      setItems(data.items || []);
    });
  }, []);

  // auto total
  useEffect(() => {
    if (!productId || !quantity) {
      setTotal(0);
      return;
    }

    const p = items.find((x) => x.id === Number(productId));
    if (p) setTotal(Number(p.price) * Number(quantity));
  }, [productId, quantity, items]);

  async function saveSale() {
    if (!productId || !quantity) return alert("Fill all fields");

    const product = items.find((x) => x.id === Number(productId));

    const saleItems = [
      {
        name: product.name,
        price: product.price,
        quantity: Number(quantity),
      },
    ];

    await api.createSale(saleItems);
    onSaved();
    onClose();
  }

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose}></div>

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-[450px] p-6 rounded-2xl shadow-2xl relative">

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 bg-gray-200 px-3 py-1 rounded-full"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6">New Sale</h2>

          {/* PRODUCT SELECT */}
          <label className="font-semibold">Product</label>
          <select
            className="w-full border p-3 rounded-lg mb-4"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select product</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} — ${i.price}
              </option>
            ))}
          </select>

          {/* QUANTITY */}
          <label className="font-semibold">Quantity</label>
          <input
            type="number"
            min="1"
            max="10000"
            placeholder="Enter quantity"
            className="w-full border p-3 rounded-lg mb-4"
            value={quantity}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || Number(v) < 1) {
                setQuantity("");
                setTotal(0);
                return;
              }
              setQuantity(Number(v));
            }}
          />

          {/* TOTAL */}
          <p className="text-xl font-semibold mb-6">
            Total: <span className="text-green-600">${total.toFixed(2)}</span>
          </p>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={saveSale}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Save Sale
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
