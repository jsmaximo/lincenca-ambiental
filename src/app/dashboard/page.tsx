"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GraficoSituacaoLicencas } from "@/components/dashboard/GraficoSituacaoLicencas";
import { GraficoValidadeLicencas } from "@/components/dashboard/GraficoValidadeLicencas"; // NOVA

export default function DashboardPage() {

// app/dashboard/page.tsx - ATUALIZE a interface:
interface DashboardData {
  total: number;
  emDia: number;
  atencaoOuVencidas: number;
  graficoSituacao: {
    vigente: number;
    atencao: number;
    vencida: number;
  };
  validadeMensal: Array<{
    mes: string;
    quantidade: number;
  }>;
  licencasRecentes: Array<{ // NOVO
    id: string;
    numero: string;
    orgao: string;
  }>;
  proximasRenovacoes: Array<{ // NOVO
    id: string;
    numero: string;
    dias: number;
    empreendimento: string;
    dias: number;
    dataValidade: string;
    condicionantes: Array<{
      id: number;
      nome: string;
      numero: number;
      prazo: string;
    }>;
  }>;
}

const [dashboard, setDashboard] = useState<DashboardData | null>(null);

async function carregarDashboard() {
  const res = await fetch("/api/dashboard");
  const data = await res.json();
  setDashboard(data);
}

useEffect(() => {
  carregarDashboard();
}, []);

  return (
    <div className="space-y-6">

      {/* TOPO */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h2>
        <Link href="/dashboard/calendario"
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
        >
            Ver calendário
        </Link>        
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Metric title="Total de Licenças" value={dashboard?.total ?? 0} />
        <Metric title="Em Dia" value={dashboard?.emDia ?? 0} color="green" />
        <Metric title="Atenção / Vencidas" value={dashboard?.atencaoOuVencidas ?? 0} color="red" />
      </div>

      {/* GRÁFICOS (MOCK) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card title="Situação das Licenças">
  {dashboard && (
    <GraficoSituacaoLicencas
      data={dashboard.graficoSituacao}
    />
  )}
</Card>

    <Card title="Validade das Licenças">
    {dashboard && (
      <GraficoValidadeLicencas
        data={dashboard.validadeMensal}
      />
    )}
  </Card>
      </div>

      {/* LISTAS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card title="Licenças Recentes">
    {dashboard?.licencasRecentes?.length ? (
      <ul className="space-y-3">
        {dashboard.licencasRecentes.map((licenca) => (
          <li key={licenca.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium text-gray-800">{licenca.numero}</p>
              <p className="text-sm text-gray-500">{licenca.orgao}</p>
            </div>
            <Link 
              href={`/dashboard/licencas/${licenca.id}`}
              className="text-sm text-green-700 hover:text-green-800"
            >
              Ver →
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">Nenhuma licença cadastrada</p>
    )}
  </Card>

  <Card title="Próximas Renovações">
    {dashboard?.proximasRenovacoes?.length ? (
      <ul className="space-y-3">
        {dashboard.proximasRenovacoes.map((licenca) => (
          <li key={licenca.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium text-gray-800">{licenca.numero}</p>
              <p className="text-sm text-gray-500">
                Vence em {licenca.dias} {licenca.dias === 1 ? 'dia' : 'dias'}
              </p>
            </div>
            <Link 
              href={`/dashboard/licencas/${licenca.id}`}
              className="text-sm text-green-700 hover:text-green-800"
            >
              Renovar →
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">Nenhuma renovação próxima</p>
    )}
  </Card>
</div>

    </div>
  );
}

/* COMPONENTES AUXILIARES */

function Metric({
  title,
  value,
  color = "gray",
}: {
  title: string;
  value: number;
  color?: "gray" | "green" | "red";
}) {
  const colors: any = {
    gray: "text-gray-800",
    green: "text-green-700",
    red: "text-red-700",
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      {children}
    </div>
  );
}
