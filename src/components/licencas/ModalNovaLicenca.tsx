"use client";

import {Input} from "@/components/ui/Input";
import {Select} from "@/components/ui/Select";

interface ModalNovaLicencaProps {
  open: boolean;
  onClose: () => void;
}

export function ModalNovaLicenca({
  open,
  onClose,
}: ModalNovaLicencaProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6">

        {/* HEADER */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Nova Licença Ambiental
        </h3>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input label="Nome da Licença" />
          <Input label="Número da Licença" />

          <Select
            label="Empreendimento"
            options={[
              "Luggi Alagoinhas",
              "Vila do Servidor",
              "DuBem",
              "Kahakai",
            ]}
          />

          <Select
            label="Tipo da Licença"
            options={[
              "Licença Prévia (LP)",
              "Licença de Instalação (LI)",
              "Licença de Operação (LO)",
            ]}
          />

          <Input label="Data de Emissão" type="date" />
          <Input label="Data de Vencimento" type="date" />

        </div>

        {/* DESTAQUE */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
          <p className="font-semibold text-blue-700">
            Lembrete de renovação
          </p>
          <p className="text-sm text-blue-600">
            Prazo máximo de renovação 120 dias antes do vencimento
          </p>
        </div>

        {/* LEMBRETE */}
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <Input label="Lembrete" placeholder="180" />
          </div>

          <div className="w-40">
            <Select
              label="Antes"
              options={["Dias", "Meses"]}
            />
          </div>
        </div>

        {/* CONDICIONANTES */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condicionantes
          </label>

          <button className="text-blue-600 text-sm mb-2">
            + Adicionar condicionante
          </button>

          <textarea
            className="w-full border rounded px-3 py-2 text-sm text-gray-600"
            rows={3}
            placeholder="Nenhuma condicionante adicionada"
            disabled
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Fechar
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Adicionar Licença
          </button>
        </div>

      </div>
    </div>
  );
}

/* COMPONENTES LOCAIS (temporários) */


