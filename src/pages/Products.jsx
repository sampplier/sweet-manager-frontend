import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [showForm, setShowForm] = useState(false); // 👈 controla se o form aparece

  async function loadProducts() {
    const token = localStorage.getItem("token");
    const resp = await fetch("http://localhost:8080/api/products", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (resp.ok) {
      const data = await resp.json();
      setProducts(data);
    } else {
      console.error("Erro ao carregar produtos");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
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
      }),
    });

    if (resp.ok) {
      setForm({ name: "", price: "", stock: "" });
      setShowForm(false); 
      loadProducts();
    } else {
      console.error("Erro ao cadastrar produto");
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");

    const resp = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (resp.ok) {
      loadProducts();
    } else {
      console.error("Erro ao excluir produto");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Novo Produto"}
        </button>
      </div>

      
      {showForm && (
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

      {/* Lista de produtos */}
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
