export function calcularStatusLicenca(
  dataValidade: Date | null,
  alertaDias: number
): "vigente" | "atencao" | "vencida" {
  if (!dataValidade) return "vigente";

  const hoje = new Date();
  const limiteAlerta = new Date();
  limiteAlerta.setDate(hoje.getDate() + alertaDias);

  if (hoje > dataValidade) {
    return "vencida";
  }

  if (limiteAlerta >= dataValidade) {
    return "atencao";
  }

  return "vigente";
}
