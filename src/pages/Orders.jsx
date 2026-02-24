import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const role = decoded?.role || "USER";

  async function loadOrders() {
    try {
      const resp = await fetch("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        console.error("Erro ao carregar pedidos");
        return;
      }

      const data = await resp.json();
      setOrders(data);
    } catch (err) {
      console.error("Erro na requisição de pedidos:", err);
    }
  }

  async function updateStatus() {
    if (!editingOrder || !newStatus) return;
    if (role !== "ROLE_ADMIN") return;

    const resp = await fetch(
      `http://localhost:8080/api/orders/${editingOrder.id}/status?status=${newStatus}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!resp.ok) {
      const t = await resp.text();
      alert(t || "Erro ao alterar status");
    }

    setEditingOrder(null);
    setNewStatus("");
    loadOrders();
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Pedidos</h2>

      {editingOrder && role === "ROLE_ADMIN" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4">
            <h3 className="text-lg font-bold">Alterar status</h3>
            <select
              className="w-full border p-2 rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-400 text-white rounded"
                onClick={() => setEditingOrder(null)}
              >
                Cancelar
              </button>
              <button
                onClick={updateStatus}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full bg-white rounded-2xl shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Cliente</th>
            <th className="p-3">Produto</th>
            <th className="p-3">Quantidade</th>
            <th className="p-3">Total</th>
            <th className="p-3">Data</th>
            <th className="p-3">Status</th>
            {role === "ROLE_ADMIN" && <th className="p-3">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.customerName || "—"}</td>
                <td className="p-3">{o.product?.name || "—"}</td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3">
                  R$ {Number(o.total).toFixed(2).replace(".", ",")}
                </td>
                <td className="p-3">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="p-3 font-semibold">
                  {o.status === "EM_ANDAMENTO" && (
                    <span className="text-blue-600">Em andamento</span>
                  )}
                  {o.status === "CONCLUIDO" && (
                    <span className="text-green-600">Concluído</span>
                  )}
                  {o.status === "CANCELADO" && (
                    <span className="text-red-600">Cancelado</span>
                  )}
                  {o.status === "ATRASADO" && (
                    <span className="text-yellow-600">Atrasado</span>
                  )}
                </td>
                {role === "ROLE_ADMIN" && (
                  <td className="p-3">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-gray-700"
                      onClick={() => {
                        setEditingOrder(o);
                        setNewStatus(o.status);
                      }}
                    >
                      Alterar
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={role === "ROLE_ADMIN" ? 7 : 6}
                className="p-4 text-center text-gray-500"
              >
                Nenhum pedido encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
