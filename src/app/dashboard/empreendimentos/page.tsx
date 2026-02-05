"use client";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useEffect, useState } from "react";
import { EmpreendimentoCard } from "@/components/empreendimentos/EmpreendimentoCard";
import { ModalEmpreendimento } from "@/components/empreendimentos/ModalEmpreendimento";
import { Empreendimento } from "@/types/empreendimento";

export default function EmpreendimentosPage() {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Empreendimento | null>(null);

  async function carregarEmpreendimentos() {
    const res = await fetch("/api/empreendimentos");
    const data = await res.json();
    setEmpreendimentos(data);
  }
  

  useEffect(() => {
    carregarEmpreendimentos();
  }, []);

  return (
    <div className="space-y-6">

      <DashboardHeader
        title="Empreendimentos"
        subtitle="Seus empreendimentos cadastrados"
        action={
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
          >
            Novo Empreendimento
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {empreendimentos.map((emp) => (
          <EmpreendimentoCard
            key={emp.id}
            nome={emp.nome}
            endereco={emp.endereco ?? ""}
            licencas={0}
            onClick={() => {
              setSelected(emp);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <ModalEmpreendimento
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
          carregarEmpreendimentos();
        }}
        empreendimento={selected}
      />

    </div>
  );
}
