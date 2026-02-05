// app/dashboard/licencas/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface LicencaDetalhe {
  id: number;
  numero: string;
  tipo: string;
  ano: string;
  dataEmissao: string;
  dataValidade: string;
  orgao: string;
  atividade: string;
  etapa: string;
  status: string;
  alertaDias: number;
  empreendimento: {
    id: number;
    nome: string;
  };
  condicionantes: Array<{
    id: number;
    nome: string;
    numero: number;
    descricao: string;
    prazo: string;
    status: string;
  }>;
}

export default function DetalheLicencaPage() {
  const params = useParams();
  const router = useRouter();
  const [licenca, setLicenca] = useState<LicencaDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    async function carregarLicenca() {
      try {
        const res = await fetch(`/api/licencas/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setLicenca(data);
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarLicenca();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!licenca) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 p-4 rounded">
          <p className="text-red-700">Licença não encontrada</p>
          <Link href="/dashboard/licencas" className="text-green-700 hover:underline">
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vigente": return "bg-green-100 text-green-800";
      case "atencao": return "bg-yellow-100 text-yellow-800";
      case "vencida": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {licenca.numero} - {licenca.empreendimento.nome}
          </h2>
          <p className="text-gray-600">Detalhes da licença</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/licencas"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
          >
            Voltar
          </Link>
          <button
            onClick={() => router.push(`/dashboard/licencas?id=${licenca.id}`)}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Editar
          </button>
        </div>
      </div>

      {/* INFORMAÇÕES PRINCIPAIS */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Informações da Licença</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="Tipo" value={licenca.tipo} />
          <InfoItem label="Ano" value={licenca.ano} />
          <InfoItem label="Órgão Ambiental" value={licenca.orgao} />
          <InfoItem label="Data de Emissão" value={new Date(licenca.dataEmissao).toLocaleDateString('pt-BR')} />
          <InfoItem label="Data de Validade" value={new Date(licenca.dataValidade).toLocaleDateString('pt-BR')} />
          <InfoItem label="Status" value={
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(licenca.status)}`}>
              {licenca.status}
            </span>
          } />
          <InfoItem label="Atividade" value={licenca.atividade} />
          <InfoItem label="Etapa" value={licenca.etapa} />
          <InfoItem label="Dias para Alerta" value={licenca.alertaDias.toString()} />
        </div>
      </div>

      {/* CONDICIONANTES */}
      {licenca.condicionantes.length > 0 && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Condicionantes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Descrição</th>
                  <th className="text-left p-3">Prazo</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {licenca.condicionantes.map((cond) => (
                  <tr key={cond.id} className="border-t">
                    <td className="p-3">{cond.numero}</td>
                    <td className="p-3 font-medium">{cond.nome}</td>
                    <td className="p-3">{cond.descricao}</td>
                    <td className="p-3">
                      {cond.prazo ? new Date(cond.prazo).toLocaleDateString('pt-BR') : "-"}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded ${cond.status === "CUMPRIDA" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {cond.status === "CUMPRIDA" ? "Cumprida" : "Não Cumprida"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}