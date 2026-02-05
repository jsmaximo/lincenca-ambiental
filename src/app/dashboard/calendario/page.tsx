"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

import { DetalheLicenca } from "@/components/licencas/DetalheLicenca";


/* =======================
   TIPOS
======================= */
interface Empreendimento {
  id: number;
  nome: string;
}

interface Condicionante {
  id: number;
  descricao: string;
  prazo: string | null;
  status: string;
}

interface Licenca {
  id: number;
  numero: string;
  tipo: string;
  dataValidade: string | null;
  status: "vigente" | "atencao" | "vencida";
  empreendimento?: Empreendimento;
  condicionantes?: Condicionante[];
}

/* =======================
   PÁGINA
======================= */
export default function CalendarioPage() {
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [licencaSelecionada, setLicencaSelecionada] =
    useState<Licenca | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const res = await fetch("/api/licencas");
    const data: Licenca[] = await res.json();

    setLicencas(data);

    const eventosFormatados = data
      .filter((l) => l.dataValidade)
      .map((l) => ({
        id: String(l.id),
        title: `${l.numero} (${l.tipo})`,
        date: l.dataValidade!,
        backgroundColor:
          l.status === "vencida"
            ? "#ef4444"
            : l.status === "atencao"
            ? "#facc15"
            : "#22c55e",
        borderColor: "transparent",
      }));

    setEventos(eventosFormatados);
  }

  return (
    <div className="space-y-6">

      <DashboardHeader
        title="Calendário"
        subtitle="Visão geral dos prazos de licenças e condicionamentos"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* =======================
            CALENDÁRIO
        ======================= */}
        <div className="lg:col-span-2 bg-white rounded shadow p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            events={eventos}
            height="auto"
            eventClick={(info) => {
              const licenca = licencas.find(
                (l) => String(l.id) === info.event.id
              );
              if (licenca) setLicencaSelecionada(licenca);
            }}
          />
        </div>

        {/* =======================
            PAINEL LATERAL
        ======================= */}
        <div className="bg-white rounded shadow p-4">
          {licencaSelecionada ? (
            <DetalheLicenca
              licenca={licencaSelecionada}
              onClose={() => setLicencaSelecionada(null)}
            />
          ) : (
            <ProximosVencimentos
              licencas={licencas}
              onSelect={(l) => setLicencaSelecionada(l)}
            />
          )}
        </div>

      </div>
    </div>
  );
}

/* =======================
   PRÓXIMOS VENCIMENTOS
======================= */
function ProximosVencimentos({
  licencas,
  onSelect,
}: {
  licencas: Licenca[];
  onSelect: (l: Licenca) => void;
}) {
  const proximos = licencas
    .filter((l) => l.dataValidade)
    .sort(
      (a, b) =>
        new Date(a.dataValidade!).getTime() -
        new Date(b.dataValidade!).getTime()
    )
    .slice(0, 6);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">
        Próximos vencimentos
      </h3>

      <div className="space-y-3">
        {proximos.map((l) => (
          <div
            key={l.id}
            onClick={() => onSelect(l)}
            className="border rounded p-3 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  {new Date(l.dataValidade!).getDate()}{" "}
                  {new Date(l.dataValidade!).toLocaleString("pt-BR", {
                    month: "short",
                  })}
                </p>

                <p className="text-sm">
                  Vencimento da licença
                </p>

                <p className="text-xs text-gray-500">
                  {l.empreendimento?.nome}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  l.status === "vencida"
                    ? "bg-red-100 text-red-700"
                    : l.status === "atencao"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {l.status}
              </span>
            </div>
          </div>
        ))}

        {proximos.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum vencimento próximo.
          </p>
        )}
      </div>
    </div>
  );
}