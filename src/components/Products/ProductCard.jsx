import React from "react";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{product.name}</h3>

      <p>R$ {product.price?.toFixed(2)}</p>

      <p>
        Estoque: {product.stock}{" "}
        {(!product.available || product.stock === 0) && (
          <span className="text-red-600 font-semibold">(Indisponível)</span>
        )}
      </p>

{/*      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onDelete(product.id)}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Remover
        </button>
      </div>*/}
    </div>
  );
}
