import React, { useState } from "react";

export default function IngredientCard({ ingredient, onDelete, onUpdateStock, isAdmin }) {
  // Inicializa o input com a quantidade atual do ingrediente
  const [quantity, setQuantity] = useState(ingredient.stock || 0);

  const handleUpdateStock = () => {
    if (quantity === 0) return;
    // calcula a diferença entre o valor do input e o estoque atual
    const diff = quantity - (ingredient.stock || 0);
    if (diff !== 0) {
      onUpdateStock(ingredient.id, diff); // envia a diferença para atualizar o estoque
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{ingredient.name}</h3>
      <p>
        Quantidade: <span className="font-medium">{ingredient.stock} {ingredient.unit}</span>
      </p>

      {isAdmin && (
        <div className="mt-3 flex flex-col gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-1 rounded w-20 text-center"
            placeholder="Ex: 5 ou -3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdateStock}
              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
            >
              Alterar estoque
            </button>
            <button
              onClick={() => onDelete(ingredient.id)}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Remover ingrediente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
