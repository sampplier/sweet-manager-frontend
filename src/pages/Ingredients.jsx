import React, { useEffect, useState } from "react";
import IngredientCard from "../components/Ingredients/IngredientCard.jsx";
import {jwtDecode} from 'jwt-decode';

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "" });
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const isAdmin = decoded?.role === "ROLE_ADMIN";

  // Carregar ingredientes
  async function loadIngredients() {
    try {
      const resp = await fetch("http://localhost:8080/api/ingredients", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setIngredients(data);
      } else console.error("Erro ao carregar ingredientes");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadIngredients();
  }, []);

  // Criar ingrediente
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const resp = await fetch("http://localhost:8080/api/ingredients", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          stock: parseInt(form.quantity),
          unit: form.unit,
        }),
      });
      if (resp.ok) {
        setForm({ name: "", quantity: "", unit: "" });
        setShowForm(false);
        loadIngredients();
      } else alert("Erro ao cadastrar ingrediente");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar ingrediente");
    }
  }

  // Deletar ingrediente
  async function handleDelete(id) {
    try {
      const resp = await fetch(`http://localhost:8080/api/ingredients/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      if (resp.ok) loadIngredients();
      else alert("Erro ao excluir ingrediente");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir ingrediente");
    }
  }

  // Atualizar estoque
  async function handleUpdateStock(id, quantity) {
    const endpoint =
      quantity > 0
        ? `http://localhost:8080/api/ingredients/add-stock/${id}?quantity=${quantity}`
        : `http://localhost:8080/api/ingredients/remove-stock/${id}?quantity=${Math.abs(quantity)}`;

    try {
      const resp = await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      if (resp.ok) loadIngredients();
      else {
        const text = await resp.text();
        alert(text || "Erro ao atualizar estoque");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar estoque");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ingredientes</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {showForm ? "Cancelar" : "Novo Ingrediente"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow space-y-2 max-w-md"
        >
          <input
            name="name"
            placeholder="Nome do ingrediente"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="quantity"
            placeholder="Quantidade total"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            min="1"
            step="1"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="unit"
            placeholder="Unidade (g, ml, un)"
            value={form.unit}
            onChange={handleChange}
            className="border p-2 rounded w-full"
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
        {ingredients.map((ing) => (
          <IngredientCard
            key={ing.id}
            ingredient={ing}
            onDelete={handleDelete}
            onUpdateStock={handleUpdateStock}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}
