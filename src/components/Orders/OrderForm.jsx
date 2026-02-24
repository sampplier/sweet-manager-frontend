import React, { useState, useEffect } from "react";

export default function OrderForm({ onCreated }) {
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error("Erro carregando produtos:", err));
  }, []);

  const selectedProduct = products.find((p) => p.id === Number(productId));

  async function submit(e) {
    e.preventDefault();

    if (!customerName.trim()) return alert("Informe o nome do cliente.");
    if (!productId) return alert("Selecione um produto.");

    if (selectedProduct.stock <= 0) {
      return alert("Produto esgotado. Não é possível criar o pedido.");
    }

    if (quantity > selectedProduct.stock) {
      return alert(`Só existem ${selectedProduct.stock} unidades disponíveis.`);
    }

    const token = localStorage.getItem("token");

    const order = {
      customerName,
      productId: Number(productId),
      quantity,
    };

    const resp = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (resp.ok) {
      setCustomerName("");
      setProductId("");
      setQuantity(1);
      onCreated && onCreated();
    } else {
      const text = await resp.text();
      alert(text || "Erro ao criar pedido");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded shadow flex flex-col gap-3"
    >
      {/* NOME DO CLIENTE */}
      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Nome do cliente"
        className="border p-2 rounded"
        required
      />

      {/* PRODUTO */}
      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="input border p-2 rounded"
        required
      >
        <option value="">Selecione o produto</option>

        {products.map((p) => (
          <option
            key={p.id}
            value={p.id}
            disabled={p.stock <= 0}
          >
            {p.name} — Estoque: {p.stock}
            {p.stock <= 0 ? " (Indisponível)" : ""}
          </option>
        ))}
      </select>

      {/* QUANTIDADE */}
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="input border p-2 rounded"
        required
      />

      <button className="px-4 py-2 bg-green-600 text-white rounded">
        Registrar Pedido
      </button>
    </form>
  );
}
