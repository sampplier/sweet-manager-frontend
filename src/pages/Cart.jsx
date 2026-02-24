import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], cartId: null });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function loadCart() {
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resp.ok) throw new Error("Erro ao carregar carrinho");
      const data = await resp.json();
      setCart(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar carrinho");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId) {
    try {
      const resp = await fetch(`http://localhost:8080/api/cart/remove/${productId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Erro ao remover item do carrinho");
      const updatedCart = await resp.json();
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function checkout() {
    if (!cart.items.length) return alert("Carrinho vazio!");
    const confirmCheckout = window.confirm("Deseja finalizar a compra?");
    if (!confirmCheckout) return;

    try {
      const resp = await fetch("http://localhost:8080/api/cart/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erro ao finalizar compra");
      }

      alert("Pedido criado com sucesso!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (loading) return <p>Carregando carrinho...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Meu Carrinho</h2>

      {cart.items.length === 0 ? (
        <p className="text-gray-500">Seu carrinho está vazio</p>
      ) : (
        <>
          <table className="w-full bg-white rounded-2xl shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Preço</th>
                <th className="p-3">Quantidade</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.productId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">R$ {item.price.toFixed(2).replace(".", ",")}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end items-center gap-6 mt-4">
            <span className="text-lg font-semibold">
              Total: R$ {total.toFixed(2).replace(".", ",")}
            </span>
            <button
              onClick={checkout}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
