import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart, isAdmin }) {
  const [quantity, setQuantity] = useState(1);

  async function handleUpdateStock() {
    if (quantity <= 0) return;

    const token = localStorage.getItem("token");
    try {
      const resp = await fetch(
        `http://localhost:8080/api/products/update-stock/${product.id}?quantity=${quantity}`,
        { method: "POST", headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      if (!resp.ok) throw new Error("Erro ao atualizar estoque");
      alert("Estoque atualizado com sucesso!");
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function handleAddToCart() {
    if (quantity > 0 && onAddToCart && product.available && product.stock > 0) {
      onAddToCart(product, quantity);
      setQuantity(1);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition">
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p>R$ {product.price?.toFixed(2).replace(".", ",")}</p>
      <p>
        Estoque: {product.stock}{" "}
        {!product.available && <span className="text-red-600 font-semibold">(Indisponível)</span>}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {/* Botão adicionar ao carrinho: sempre visível, mas desabilitado se indisponível */}
        <button
          onClick={handleAddToCart}
          disabled={!product.available || product.stock <= 0}
          className={`px-3 py-1 rounded text-white ${
            product.available && product.stock > 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Adicionar ao carrinho
        </button>

        {/* Botão atualizar estoque: visível apenas para admin */}
        {isAdmin && (
          <button
            onClick={handleUpdateStock}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Adicionar estoque
          </button>
        )}

        {/* Input de quantidade: aparece apenas se produto disponível ou admin */}
        {(product.available || isAdmin) && (
          <input
            type="number"
            min="1"
            max={product.stock || 9999}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(
                  Math.max(1, Number(e.target.value)),
                  product.stock || Number.MAX_SAFE_INTEGER
                )
              )
            }
            className="border p-1 rounded w-20 text-center"
          />
        )}
      </div>
    </div>
  );
}
