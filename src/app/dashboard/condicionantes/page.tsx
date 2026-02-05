"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

/* ======================
   TIPOS
====================== */
interface Condicionante {
  id: number;
  numero: number;
  nome: string;
  descricao: string;
  prazo: string | null;
  status: string;

  licenca: {
    id: number;
    numero: string;
    alertaDias: number;
    empreendimento: {
      nome: string;
    };
  };
}

/* ======================
   STATUS (FRONT)
====================== */
function calcularStatus(
  prazo: string | null,
  alertaDias: number,
  statusBanco: string
) {
  if (statusBanco === "CUMPRIDA") return "cumprida";
  if (!prazo) return "sem_prazo";

  const hoje = new Date();
  const dataPrazo = new Date(prazo);

  const diffDias = Math.ceil(
    (dataPrazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDias < 0) return "vencida";
  if (diffDias <= alertaDias) return "atencao";
  return "vigente";
}

/* ======================
   PAGE
====================== */
export default function CondicionantesPage() {
  const [condicionantes, setCondicionantes] = useState<Condicionante[]>([]);
  const [statusFiltro, setStatusFiltro] = useState("");

  async function carregarCondicionantes() {
    const res = await fetch("/api/condicionantes");
    const data = await res.json();
    setCondicionantes(data);
  }

  useEffect(() => {
    carregarCondicionantes();
  }, []);

  const condicionantesFiltradas = condicionantes.filter((c) => {
    if (!statusFiltro) return true;

    const statusCalc = calcularStatus(
      c.prazo,
      c.licenca.alertaDias,
      c.status
    );

    return statusCalc === statusFiltro;
  });

  const statusStyle: Record<string, string> = {
    vigente: "bg-green-100 text-green-800",
    atencao: "bg-yellow-100 text-yellow-800",
    vencida: "bg-red-100 text-red-800",
    cumprida: "bg-blue-100 text-blue-800",
    sem_prazo: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">

      <DashboardHeader
        title="Condicionantes"
        subtitle="Gerencie todas as condicionantes do sistema"
      />

      {/* FILTROS */}
      <div className="bg-white p-4 rounded shadow flex gap-4">
        <select
          className="border rounded px-3 py-2"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="vigente">Em dia</option>
          <option value="atencao">Atenção</option>
          <option value="vencida">Vencida</option>
          <option value="cumprida">Cumprida</option>
        </select>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Licença</th>
              <th className="px-4 py-3">Empreendimento</th>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Prazo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {condicionantesFiltradas.map((c) => {
              const statusCalc = calcularStatus(
                c.prazo,
                c.licenca.alertaDias,
                c.status
              );

              return (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.licenca.numero}</td>
                  <td className="px-4 py-3">
                    {c.licenca.empreendimento.nome}
                  </td>
                  <td className="px-4 py-3">{c.numero}</td>
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3">
                    {c.prazo
                      ? new Date(c.prazo).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusStyle[statusCalc]}`}
                    >
                      {statusCalc}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <Link
                      href={`/dashboard/licencas/${c.licenca.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver licença
                    </Link>

{/* MOSTRAR APENAS SE NÃO ESTIVER CUMPRIDA */}
  {statusCalc !== "cumprida" && (
<button
  onClick={async () => {
    if (!confirm("Marcar condicionante como cumprida?")) return;

    await fetch(`/api/condicionantes/${c.id}/cumprir`, {
      method: "PATCH",
    });

    carregarCondicionantes();
  }}
  className="text-green-600 hover:underline"
>
  ✔ Marcar como cumprida
</button>
 )}

                  </td>
                </tr>
              );
            })}

            {condicionantesFiltradas.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Nenhuma condicionante encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
