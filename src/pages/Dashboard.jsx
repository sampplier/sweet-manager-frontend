import React, { useEffect, useState } from "react";
import DashboardChart from "../components/DashboardChart";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulação de dados — aqui chamaria sua API Express
    const data = [
      { date: "2025-11-06", sales: 10 },
      { date: "2025-11-07", sales: 15 },
      { date: "2025-11-08", sales: 9 },
      { date: "2025-11-09", sales: 18 },
      { date: "2025-11-10", sales: 21 },
    ];
    setChartData(data);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Painel Administrativo</h2>
      <DashboardChart data={chartData} />
    </div>
  );
}
