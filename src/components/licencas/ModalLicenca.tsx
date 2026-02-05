"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

/* ======================
   TIPOS
====================== */
interface Empreendimento {
  id: number;
  nome: string;
}

interface Licenca {
  id: number;
  numero: string;
  tipo: string;
  dataEmissao: string | null;
  dataValidade: string | null;
  orgao?: string | null;
  atividade?: string | null;
  alertaDias?: number | null;
  empreendimentoId: number;
  condicionantes?: {
    descricao: string;
    prazo: string | null;
    alertaDias?: number | null;
  }[];
}

interface ModalLicencaProps {
  open: boolean;
  onClose: () => void;
  licenca: Licenca | null;
}

interface CondicionanteForm {
  id?:number;
  nome: string;
  descricao: string;
  prazo: string; // yyyy-mm-dd
  alertaValor: string;
  alertaUnidade: "dias" | "meses";
}

/* ======================
   COMPONENTE
====================== */
export function ModalLicenca({
  open,
  onClose,
  licenca,
}: ModalLicencaProps) {
  const isEdicao = Boolean(licenca);

  const [empreendimentos, setEmpreendimentos] =
    useState<Empreendimento[]>([]);

  const [condicionantes, setCondicionantes] = useState<CondicionanteForm[]>([]);

  const [empreendimentoId, setEmpreendimentoId] = useState("");
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("LO");
  const [dataEmissao, setDataEmissao] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [orgao, setOrgao] = useState("");
  const [atividade, setAtividade] = useState("");

  const [alertaDias, setAlertaDias] = useState("180"); 

  /* ======================
     UTIL
  ====================== */
  function toDateInput(value?: string | null) {
    if (!value) return "";
    return new Date(value).toISOString().split("T")[0];
  }

  /* ======================
     SINCRONIZA LICENÇA → FORM
  ====================== */
  useEffect(() => {
  if (!open) return;

  if (licenca) {
    setEmpreendimentoId(String(licenca.empreendimentoId));
    setNumero(licenca.numero);
    setTipo(licenca.tipo);
    setDataEmissao(toDateInput(licenca.dataEmissao));
    setDataValidade(toDateInput(licenca.dataValidade));
    setOrgao(licenca.orgao ?? "");
    setAtividade(licenca.atividade ?? "");
    setAlertaDias(String(licenca.alertaDias ?? 180));

 //Seta as condicionantes
 setCondicionantes(
  licenca.condicionantes?.map((c) => ({
    id:c.id,
    nome: c.nome ?? "",             
    descricao: c.descricao,
    prazo: toDateInput(c.prazo),
    alertaValor: String(c.alertaDias ?? 180),
    alertaUnidade: "dias",
  })) ?? []
);
  } else {
    // novo cadastro
    setEmpreendimentoId("");
    setNumero("");
    setTipo("LO");
    setDataEmissao("");
    setDataValidade("");
    setOrgao("");
    setAtividade("");
    setAlertaDias("180");   
    setCondicionantes([]); // importante
  }
}, [licenca, open]);


  /* ======================
     CARREGAR EMPREENDIMENTOS
  ====================== */
  useEffect(() => {
    if (!open) return;

    fetch("/api/empreendimentos")
      .then((res) => res.json())
      .then(setEmpreendimentos);
  }, [open]);

  /* ======================
     SALVAR
  ====================== */
  async function salvar() {
    if (!empreendimentoId) {
      alert("Selecione um empreendimento");
      return;
    }   

    const payload = {
      numero,
      tipo,
      dataEmissao,
      dataValidade,
      orgao,
      atividade,
      alertaDias: Number(alertaDias),
      status: "vigente",
      empreendimentoId: Number(empreendimentoId),

    condicionantes: condicionantes.map((c) => ({
      nome:c.nome,      
    descricao: c.descricao,
    prazo: c.prazo,
    alertaDias:
      c.alertaUnidade === "meses"
        ? Number(c.alertaValor) * 30
        : Number(c.alertaValor),
    status: "NAO_CUMPRIDA",
  })),
    };

    const res = await fetch(
      isEdicao
        ? `/api/licencas/${licenca!.id}`
        : "/api/licencas",
      {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      alert("Erro ao salvar licença");
      return;
    }

    onClose();
  }

  if (!open) return null;

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 space-y-6">

        <h3 className="text-xl font-bold text-gray-800">
          {isEdicao
            ? "Editar Licença Ambiental"
            : "Nova Licença Ambiental"}
        </h3>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Select
            label="Empreendimento"
            value={empreendimentoId}
            onChange={(e) => setEmpreendimentoId(e.target.value)}
            options={[
              { value: "", label: "Selecione..." },
              ...empreendimentos.map((e) => ({
                value: String(e.id),
                label: e.nome,
              })),
            ]}
          />

          <Input
            label="Número da Licença"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />

          <Select
            label="Tipo da Licença"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={[
              { value: "LP", label: "Licença Prévia (LP)" },
              { value: "LI", label: "Licença de Instalação (LI)" },
              { value: "LO", label: "Licença de Operação (LO)" },
              { value: "PPV", label: "PPV" },
              { value: "LS", label: "LS" },
            ]}
          />

          <Input
            label="Data de Emissão"
            type="date"
            value={dataEmissao}
            onChange={(e) => setDataEmissao(e.target.value)}
          />

          <Input
            label="Data de Vencimento"
            type="date"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
          />

          <Input
            label="Órgão Ambiental"
            value={orgao}
            onChange={(e) => setOrgao(e.target.value)}
          />

          <Input
            label="Atividade"
            value={atividade}
            onChange={(e) => setAtividade(e.target.value)}
          />

          <Input
            label="Alerta Dias"
            value={alertaDias}
            onChange={(e) => setAlertaDias(e.target.value)}
          />
        </div>     

   {/* ======================
    CONDICIONANTES
====================== */}
<div className="mt-6 space-y-4">

  {/* HEADER */}
  <div className="flex justify-between items-center">
    <h4 className="font-semibold text-gray-800">
      Condicionantes
    </h4>

    <button
      type="button"
      onClick={() =>
        setCondicionantes((prev) => [
          ...prev,
          {
            nome: "",
            descricao: "",
            prazo: "",
            alertaValor: "180",
            alertaUnidade: "dias",
          },
        ])
      }
      className="text-sm text-blue-600 hover:underline"
    >
      ➕ Adicionar
    </button>
  </div>

  {/* LISTA COM SCROLL */}
  <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
    {condicionantes.length === 0 && (
      <p className="text-sm text-gray-500">
        Nenhuma condicionante adicionada.
      </p>
    )}

    {condicionantes.map((c, index) => (
      <div
        key={index}
        className="border rounded-lg p-4 space-y-3 bg-gray-50 w-full"
      >
        <div className="flex justify-between items-center">
          <h5 className="font-medium">
            Condicionante {index + 1}
          </h5>

          <button
            type="button"
            onClick={() =>
              setCondicionantes((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
            className="text-xs text-red-600 hover:underline"
          >
            Remover
          </button>
        </div>

        <Input
          label="Nome"
          value={c.nome}
          onChange={(e) => {
            const copy = [...condicionantes];
            copy[index].nome = e.target.value;
            setCondicionantes(copy);
          }}
        />

        <Input
          label="Descrição"
          value={c.descricao}
          onChange={(e) => {
            const copy = [...condicionantes];
            copy[index].descricao = e.target.value;
            setCondicionantes(copy);
          }}
        />

        <Input
          label="Data de vencimento"
          type="date"
          value={c.prazo}
          onChange={(e) => {
            const copy = [...condicionantes];
            copy[index].prazo = e.target.value;
            setCondicionantes(copy);
          }}
        />

        <div className="flex gap-3">
          <Input
            label="Avisar"
            value={c.alertaValor}
            onChange={(e) => {
              const copy = [...condicionantes];
              copy[index].alertaValor = e.target.value;
              setCondicionantes(copy);
            }}
          />

          <Select
            label="Antes"
            value={c.alertaUnidade}
            onChange={(e) => {
              const copy = [...condicionantes];
              copy[index].alertaUnidade =
                e.target.value as "dias" | "meses";
              setCondicionantes(copy);
            }}
            options={[
              { value: "dias", label: "Dias" },
              { value: "meses", label: "Meses" },
            ]}
          />
        </div>
      </div>
    ))}
  </div>
</div>



        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t">
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
            {isEdicao ? "Salvar Alterações" : "Adicionar Licença"}
          </button>
        </div>

      </div>
    </div>
  );
}
