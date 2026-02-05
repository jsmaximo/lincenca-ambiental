interface LicencaCardProps {
  numero: string;
  tipo: string;
  empreendimento: string;
  dataValidade: string | null;
  status: string;
  condicionantes?: number;
  onClick?:()=>void;
}

function calcularDiasRestantes(data: string | null) {
  if (!data) return null;
  const hoje = new Date();
  const validade = new Date(data);
  const diff = Math.ceil(
    (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

export function LicencaCard({
  numero,
  tipo,
  empreendimento,
  dataValidade,
  status,
  condicionantes = 0,
  onClick,
}: LicencaCardProps) {
  const dias = calcularDiasRestantes(dataValidade);

  const statusStyle: Record<string, string> = {
    vigente: "bg-green-100 text-green-700",
    atencao: "bg-yellow-100 text-yellow-700",
    vencida: "bg-red-100 text-red-700",
  };

  return (
    <div 
    onClick={onClick}
    className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800">
            {tipo}
          </h3>

          <span
            className={`text-xs px-2 py-1 rounded ${
              statusStyle[status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="text-sm text-gray-500">{numero}</p>

        <p className="text-sm text-gray-700">
          {empreendimento}
        </p>

        <p className="text-sm text-gray-600">
          {dias !== null
            ? `Vence em ${dias} dias`
            : "Sem data de vencimento"}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        {condicionantes} condicionantes
      </div>
    </div>
  );
}
