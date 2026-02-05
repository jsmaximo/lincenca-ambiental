import { NextResponse } from "next/server";
import { enviarEmail } from "@/lib/email";
import { templateLicencaVencimento } from "@/lib/email-templates";

export async function GET() {
  // Dados de exemplo - use os NOMES CORRETOS da função
  const dadosLicenca = {
    numeroLicenca: "001/2024-LO", // ← numeroLicenca (não numero)
    tipoLicenca: "Licença de Operação (LO)", // ← tipoLicenca (não tipo)
    empreendimento: "Condomínio Residencial Sol Nascente", // ← OK
    dataValidade: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    diasRestantes: 10,
    linkDetalhes: "http://localhost:3000/dashboard/licencas/1", // ← linkDetalhes (não link)
    responsavel: "Jorge Santos"
  };

  // Usa o template
  const htmlTemplate = templateLicencaVencimento(dadosLicenca);

  await enviarEmail({
    para: "jorge.santos@vcaconstrutora.com.br",
    assunto: `⚠️ ALERTA: Licença ${dadosLicenca.numeroLicenca} vence em ${dadosLicenca.diasRestantes} dias`,
    html: htmlTemplate,
  });

  return NextResponse.json({ 
    ok: true,
    mensagem: "Email com template enviado!",
    dados: dadosLicenca
  });
}