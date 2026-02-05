export interface Licenca {
  id: string;
  nome: string;
  numero: string;
  tipo: string;
  empreendimento: string;
  status: "em-dia" | "atenção" | "urgente" | "vencida";
  dataEmissao: string;
  dataVencimento: string;
  condicionantes: number;
}