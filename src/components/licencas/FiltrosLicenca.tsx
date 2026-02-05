export function FiltrosLicenca() {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Buscar licenças..."
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <select className="border rounded px-3 py-2">
        <option>Todos os status</option>
        <option>Em dia</option>
        <option>Atenção</option>
        <option>Urgente</option>
        <option>Vencidas</option>
      </select>

      <select className="border rounded px-3 py-2">
        <option>Todos os empreendimentos</option>
        <option>Luggi Alagoinhas</option>
        <option>Vila do Servidor</option>
        <option>DuBem</option>
        <option>Kahakai</option>
      </select>
    </div>
  );
}
