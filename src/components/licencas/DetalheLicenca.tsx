"use client";

import { useRouter } from "next/navigation";

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
  status: string;
  empreendimento?: Empreendimento;
  condicionantes?: Condicionante[];
}

interface DetalheLicencaProps {
  licenca: Licenca;
  onClose: () => void;
}

export function DetalheLicenca({
  licenca,
  onClose,
}: DetalheLicencaProps) {

  
const router = useRouter();

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          Detalhe da Licença
        </h3>

        <button
          onClick={onClose}
          className="text-sm text-blue-600 hover:underline"
        >
          Voltar
        </button>
      </div>

      {/* DADOS PRINCIPAIS */}
      <div className="space-y-2 text-sm mb-6">
        <p><strong>Número:</strong> {licenca.numero}</p>
        <p><strong>Tipo:</strong> {licenca.tipo}</p>
        <p><strong>Status:</strong> {licenca.status}</p>
        <p>
          <strong>Vencimento:</strong>{" "}
          {licenca.dataValidade
            ? new Date(licenca.dataValidade).toLocaleDateString("pt-BR")
            : "—"}
        </p>
        <p>
          <strong>Empreendimento:</strong>{" "}
          {licenca.empreendimento?.nome}
        </p>
      </div>

     {/* Abrir licença botao */}
      <div className="mt-4">
  <button
    onClick={() => router.push(`/dashboard/licencas?id=${licenca.id}`)}
    className="text-sm text-blue-600 hover:underline"
  >
    Abrir licença
  </button>
</div>


      {/* CONDICIONANTES */}
      <div>
        <h4 className="font-semibold mb-2">
          Condicionantes
        </h4>

        {(!licenca.condicionantes ||
          licenca.condicionantes.length === 0) && (
          <p className="text-sm text-gray-500">
            Nenhuma condicionante cadastrada.
          </p>
        )}

        <ul className="space-y-2">
          {licenca.condicionantes?.map((c) => (
            <li
              key={c.id}
              className="border rounded p-2 text-sm"
            >
              <p className="font-medium">
                {c.descricao}
              </p>

              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>
                  Prazo:{" "}
                  {c.prazo
                    ? new Date(c.prazo).toLocaleDateString("pt-BR")
                    : "—"}
                </span>

                <span
                  className={`px-2 py-0.5 rounded ${
                    c.status === "cumprida"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
