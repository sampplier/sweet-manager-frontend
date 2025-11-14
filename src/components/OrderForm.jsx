import React, { useState, useEffect } from "react";

export default function OrderForm({ onCreated }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Recupera usuário logado (salvo no localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "Usuário");
      } catch {
        setUserName("Usuário");
      }
    }

    // Carrega produtos
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then(setProducts)
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  async function submit(e) {
  e.preventDefault();

  const product = products.find(p => p.id === Number(productId));
  if (!product) return alert("Selecione um produto válido");

  const order = {
    customerName,
    productId: product.id,
    quantity,
    total: (product.price || 0) * quantity
  };

  const token = localStorage.getItem("token");

  const resp = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(order)
  });

  if (resp.ok) {
    setCustomerName("");
    setQuantity(1);
    setProductId("");
    onCreated && onCreated();
  } else {
    const text = await resp.text();
    console.error("Erro ao registrar pedido:", text);
    alert("Erro ao registrar pedido");
  }
}


  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded shadow flex flex-col gap-3 max-w-md"
    >
      <input
        value={userName}
        disabled
        className="border p-2 rounded bg-gray-100 cursor-not-allowed"
        placeholder="Nome do cliente"
      />
      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="border p-2 rounded"
        required
      >
        <option value="">Selecione o produto</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — R$ {p.price}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 rounded"
        placeholder="Quantidade"
        required
      />
      <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Registrar Pedido
      </button>
    </form>
  );
}
