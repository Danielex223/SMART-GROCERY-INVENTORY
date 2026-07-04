import { useEffect, useState } from "react";
import { api } from "../api/client";
import NewSaleModal from "../components/NewSaleModal";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  async function loadSales() {
    try {
      const data = await api.getSales();
      setSales(data.sales || []);
    } catch {
      setSales([]);
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  async function deleteSale(id) {
    if (!confirm("Delete this sale?")) return;
    await api.deleteSale(id);
    loadSales();
  }

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Sales</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          + New Sale
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        {sales.length === 0 ? (
          <div className="text-gray-500">No sales yet.</div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-600 text-sm uppercase">
                <th className="p-2">Date</th>
                <th className="p-2">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="bg-gray-100 rounded-lg">
                  <td className="p-3">
                    {new Date(s.date).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {s.items?.[0]?.name || "-"}
                  </td>

                  <td className="p-3">
                    {s.items?.[0]?.quantity || "-"}
                  </td>

                  <td className="p-3 font-semibold">
                    ${s.total?.toFixed(2) || "0.00"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteSale(s.id)}
                      className="px-3 py-1 bg-black text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <NewSaleModal
          onClose={() => setOpenModal(false)}
          onSaved={loadSales}
        />
      )}
    </div>
  );
}
