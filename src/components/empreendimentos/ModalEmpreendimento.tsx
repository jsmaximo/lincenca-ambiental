"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Empreendimento } from "@/types/empreendimento";
import { Metric } from "@/components/empreendimentos/Metric";


interface ModalEmpreendimentoProps {
  open: boolean;
  onClose: () => void;
  empreendimento: Empreendimento | null;
}

export function ModalEmpreendimento({
  open,
  onClose,
  empreendimento,
}: ModalEmpreendimentoProps) {

  const isNovo = empreendimento === null;

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");

  // sincroniza quando abrir modal
  useEffect(() => {
    if (empreendimento) {
      setNome(empreendimento.nome);
      setEndereco(empreendimento.endereco ?? "");
    } else {
      setNome("");
      setEndereco("");
    }
  }, [empreendimento, open]);

 async function salvar() {
  if (isNovo) {
    await fetch("/api/empreendimentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, endereco }),
    });
  } else {
    await fetch(`/api/empreendimentos/${empreendimento!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, endereco }),
    });
  }

 onClose();
}

async function excluir() {
  if (!empreendimento) return;

  const ok = confirm(
    "Tem certeza que deseja excluir este empreendimento? Essa ação não pode ser desfeita."
  );
  if (!ok) return;

  const res = await fetch(`/api/empreendimentos/${empreendimento.id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Erro ao excluir empreendimento");
    return;
  }

  onClose();
}



  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">

        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {isNovo ? "Novo Empreendimento" : "Empreendimento"}
        </h3>

        <div className="space-y-4 mb-6">
          <Input
            label="Nome do Empreendimento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            readOnly={false}
          />

          <Input
            label="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            readOnly={false}
          />
        </div>

        {!isNovo && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Metric label="Em dia" value={1} color="green" />
            <Metric label="Atenção" value={0} color="yellow" />
            <Metric label="Urgente" value={0} color="orange" />
            <Metric label="Vencidas" value={0} color="red" />
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
  {!isNovo && (
    <button
      onClick={excluir}
      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
    >
      Excluir
    </button>
  )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Fechar
          </button>

          <button
            onClick={salvar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isNovo ? "Adicionar Empreendimento" : "Salvar Alterações"}
          </button>
        </div>
      </div>

      
    </div>
    </div>
  );
}
