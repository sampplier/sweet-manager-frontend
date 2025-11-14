import React, { useEffect, useState } from "react";
import OrderForm from "../components/OrderForm";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function loadOrders() {
    const token = localStorage.getItem("token");
    try {
      const resp = await fetch("http://localhost:8080/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setOrders(data);
      } else {
        console.error("Erro ao carregar pedidos");
      }
    } catch (err) {
      console.error("Erro na requisição de pedidos:", err);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? "Cancelar" : "Novo Pedido"}
        </button>
      </div>

      {/* Formulário exibido apenas quando clicar em Novo Pedido */}
      {showForm && (
        <OrderForm
          onCreated={() => {
            setShowForm(false);
            loadOrders();
          }}
        />
      )}

      {/* Tabela de pedidos */}
      <table className="w-full bg-white rounded-2xl shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Cliente</th>
            <th className="p-3">Produto</th>
            <th className="p-3">Quantidade</th>
            <th className="p-3">Valor Total</th>
            <th className="p-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{o.product?.name}</td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3">R$ {o.total}</td>
                <td className="p-3">
                  {new Date(o.date).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                Nenhum pedido encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
