// components/dashboard/GraficoValidadeLicencas.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ValidadeMensal {
  mes: string;
  quantidade: number;
}

interface GraficoValidadeProps {
  data?: ValidadeMensal[];
}

export function GraficoValidadeLicencas({ data }: GraficoValidadeProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Bar 
          dataKey="quantidade" 
          fill="#16a34a" 
          name="Licenças" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}