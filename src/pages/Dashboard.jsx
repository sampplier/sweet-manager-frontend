import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  async function loadData() {
    try {
      const response = await fetch("http://localhost:8080/api/dashboard/daily-sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar vendas");

      const json = await response.json();

      const formatted = json.map((d) => ({
        date: d.date,
        salesCount: d.salesCount,
        totalValue: d.totalValue,
      }));

      setData(formatted);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Vendas por dia</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalValue"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5 }}
              connectNulls={true}
              name="Faturamento (R$)"
            />
            <Line
              type="monotone"
              dataKey="salesCount"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              connectNulls={true}
              name="Quantidade de vendas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
