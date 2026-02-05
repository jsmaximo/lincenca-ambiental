"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ModalLicenca } from "@/components/licencas/ModalLicenca";
import { LicencaCard } from "@/components/licencas/LicencaCard";

import { useRouter } from "next/navigation";


interface Licenca {
  id: number;
  numero: string;
  tipo: string;
  dataValidade: string | null;
  status: string;
}

export default function LicencasPage() {
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Licenca | null>(null);  
  const [statusFiltro, setStatusFiltro] = useState("");
  const [empreendimentoFiltro, setEmpreendimentoFiltro] = useState("");

  const searchParams = useSearchParams();
  const licencaIdParam = searchParams.get("id");
  const router = useRouter();

  async function carregarLicencas() {
    const res = await fetch("/api/licencas");
    const data = await res.json();
    setLicencas(data);
  }

  useEffect(() => {
    carregarLicencas();
  }, []);



// CONTROLE DO MODAL VIA QUERY PARAM - CORRIGIDO
  useEffect(() => {
    // Se não tem query param, não faz nada
    if (!licencaIdParam) {
      setOpen(false);
      setSelected(null);
      return;
    }

    // Se já está aberto com a mesma licença, não faz nada
    if (open && selected?.id === Number(licencaIdParam)) {
      return;
    }

    // Procura a licença
    const licenca = licencas.find((l) => l.id === Number(licencaIdParam));
    
    if (licenca) {
      setSelected(licenca);
      setOpen(true);
    }
  }, [licencaIdParam, licencas]); // Remova 'open' e 'selected' das dependências


const licencasFiltradas  = licencas.filter((l: any) => {
  const matchStatus =
     !statusFiltro || String(l.status) === statusFiltro;

  const matchEmpreendimento =
    !empreendimentoFiltro ||
    (l.empreendimento && 
    l.empreendimento.id === Number(empreendimentoFiltro));

  return matchStatus && matchEmpreendimento;
});

// FUNÇÃO PARA ABRIR MODAL (nova ou edição)
  const abrirModal = (licenca?: any) => {
    if (licenca) {
      // Para edição: atualiza URL com query param
      router.push(`/dashboard/licencas?id=${licenca.id}`);
    } else {
      // Para nova: abre sem query param
      setSelected(null);
      setOpen(true);
    }
  };

  // FUNÇÃO PARA FECHAR MODAL
  const fecharModal = () => {
    setOpen(false);
    setSelected(null);
    
    // Se tinha query param, remove
    if (licencaIdParam) {
      router.replace("/dashboard/licencas");
    }
    
    // Recarrega dados
    carregarLicencas();
  };




  return (
    <div className="space-y-6">

      <DashboardHeader
        title="Licenças Ambientais"
        subtitle="Gerencie todas as licenças ambientais"
        action={
          <button
           onClick={() =>abrirModal()}
           className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
>
  Nova Licença
</button>
        }
      />

      <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-4">

  <select
    className="border rounded px-3 py-2"
    value={statusFiltro}
    onChange={(e) => setStatusFiltro(e.target.value)}
  >
    <option value="">Todos os status</option>
    <option value="vigente">Em dia</option>
    <option value="atencao">Atenção</option>
    <option value="vencida">Vencidas</option>
  </select>

  <select
    className="border rounded px-3 py-2"
    value={empreendimentoFiltro}
    onChange={(e) => setEmpreendimentoFiltro(e.target.value)}
  >
    <option value="">Todos os empreendimentos</option>

    {Array.from(
      new Map(
        licencas.map((l: any) => [
          l.empreendimento?.id,
          l.empreendimento,
        ])
      ).values()
    ).map((emp: any) => (
      <option key={emp.id} value={emp.id}>
        {emp.nome}
      </option>
    ))}
  </select>
</div>


      {/* LISTAGEM SIMPLES (temporária) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {licencas.length === 0 && (
    <p className="text-sm text-gray-500">
      Nenhuma licença cadastrada.
    </p>
  )}

  {licencasFiltradas.map((l: any) => (
    <LicencaCard
      key={l.id}      
      numero={l.numero}
      tipo={l.tipo}
      empreendimento={l.empreendimento?.nome ?? ""}
      dataValidade={l.dataValidade}
      status={l.status}
      condicionantes={l.condicionantes?.length ?? 0}
       onClick={() => abrirModal(l)}
    />
  ))}
</div>


<ModalLicenca
  open={open}
  licenca={selected}
  onClose={fecharModal} // Usa a nova função 
/>


    </div>
  );
}
