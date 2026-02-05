"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  vigente: "#16a34a", // verde
  atencao: "#facc15", // amarelo
  vencida: "#dc2626", // vermelho
};

interface GraficoSituacaoProps {
  data?: {
    vigente: number;
    atencao: number;
    vencida: number;
  };
}

export function GraficoSituacaoLicencas({ data }: GraficoSituacaoProps) {
  if (!data) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-500">
        Carregando gráfico...
      </div>
    );
  }

  const chartData = [
    { name: "Em dia", value: data.vigente },
    { name: "Atenção", value: data.atencao },
    { name: "Vencidas", value: data.vencida },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          label
        >
         {chartData.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={
      entry.name === "Em dia" ? COLORS.vigente :
      entry.name === "Atenção" ? COLORS.atencao :
      COLORS.vencida
    }
  />
))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
