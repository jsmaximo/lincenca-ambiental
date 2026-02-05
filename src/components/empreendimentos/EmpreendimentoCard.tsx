interface EmpreendimentoCardProps {
  nome: string;
  endereco: string;
  licencas: number;
  onClick?: () => void;
}
export function EmpreendimentoCard({
  nome,
  endereco,
  licencas,
  onClick,
}: EmpreendimentoCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">🏠</span>
        <h3 className="font-semibold text-gray-800">
          {nome}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        {endereco}
      </p>

      <p className="text-sm text-gray-500">
        {licencas} licenças
      </p>
    </div>
  );
}
