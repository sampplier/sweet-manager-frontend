import React, { useEffect, useState } from "react";
import ProductCard from "../components/Products/ProductCard.jsx";
import {jwtDecode} from 'jwt-decode';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "ROLE_ADMIN");
    }
    loadProducts();
  }, []);

  async function loadProducts() {
    const token = localStorage.getItem("token");
    const resp = await fetch("http://localhost:8080/api/products", {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      }
    });
    if (resp.ok) setProducts(await resp.json());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAdmin) return;

    const token = localStorage.getItem("token");
    const resp = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        available: true
      }),
    });

    if (resp.ok) {
      setForm({ name: "", price: "", stock: "" });
      setShowForm(false);
      loadProducts();
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddToCart(product, quantity) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: product.id, quantity }),
    })
      .then(r => r.json())
      .then(() => alert(`${product.name} adicionado ao carrinho!`))
      .catch(err => console.error("Erro ao adicionar ao carrinho:", err));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produtos</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {showForm ? "Cancelar" : "Novo Produto"}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow space-y-2 max-w-md"
        >
          <input
            name="name"
            placeholder="Nome do produto"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="price"
            placeholder="Preço"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            type="number"
            step="0.01"
            required
          />
          <input
            name="stock"
            placeholder="Estoque"
            value={form.stock}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            type="number"
            required
          />
          <div className="flex gap-2">
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={handleAddToCart}
            isAdmin={isAdmin}
          />

        ))}
</div>

    </div>
  );
}
