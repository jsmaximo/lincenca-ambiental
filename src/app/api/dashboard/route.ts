import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularStatusLicenca } from "@/lib/licencaStatus";

import { addMonths, startOfMonth, format } from "date-fns";

export async function GET() {
  try {
    const licencas = await prisma.licenca.findMany({
      select: {
        id:true,
        numero:true,
        orgao:true,
        dataValidade: true,
        alertaDias: true,
        empreendimento:{
          select:{nome : true}
        },
         condicionantes: {
          where: {
            status: "NAO_CUMPRIDA", // Apenas não cumpridas
            prazo: { not: null }    // Com prazo definido
          },
          select: {
            id: true,
            nome: true,
            prazo: true,
            numero: true
          }
        }
      },
      orderBy:{
        createdAt:'desc',
      },
      take:5,
    });

    let total = licencas.length;
    let emDia = 0;
    let atencao = 0;
    let vencida = 0;

    licencas.forEach((l) => {
      const status = calcularStatusLicenca(
        l.dataValidade,
        l.alertaDias
      );

      if (status === "vigente") {
        emDia++;
      } else if (status === "atencao") {
        atencao++;
      } else if (status === "vencida") {
        vencida++;
      }
    });

    // DENTRO da função GET, ANTES do return:
const hoje = new Date();
const mesesValidade = [];

for (let i = 0; i < 6; i++) {
  const mes = startOfMonth(addMonths(hoje, i));
  const mesFormatado = format(mes, "MMM/yyyy");
  
  // Contar licenças que vencem neste mês
  const vencemNoMes = licencas.filter(l => {
    const dataValidade = new Date(l.dataValidade);
    return (
      dataValidade.getMonth() === mes.getMonth() &&
      dataValidade.getFullYear() === mes.getFullYear()
    );
  }).length;

  mesesValidade.push({
    mes: mesFormatado,
    quantidade: vencemNoMes,
  });
}

// NO final da função, ANTES do return, adicione:
const licencasRecentes = licencas.slice(0, 5).map(l => ({
  id: l.id,
  numero: l.numero,
  orgao: l.orgao,
}));

// Para próximas renovações, filtre as que estão próximas do vencimento
const trintaDiasFrente = new Date();
trintaDiasFrente.setDate(hoje.getDate() + 30);

const proximasRenovacoes = licencas
  .filter(l => {
    const dataValidade = new Date(l.dataValidade);
    const diasRestantes = Math.ceil(
      (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diasRestantes > 0 && diasRestantes <= 30;
  })
  .slice(0, 5)
  .map(l => {
    const dataValidade = new Date(l.dataValidade);
    const diasRestantes = Math.ceil(
      (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      id: l.id,
      numero: l.numero,
      dias: diasRestantes,
    };
  });

// ATUALIZE o return para incluir os novos campos:
return NextResponse.json({
  total,
  emDia,
  atencaoOuVencidas: atencao + vencida,
  graficoSituacao: {
    vigente: emDia,
    atencao: atencao,
    vencida: vencida,
  },
  validadeMensal: mesesValidade,
  licencasRecentes, // NOVO
  proximasRenovacoes, // NOVO
});
  } catch (error) {
    console.error("ERRO DASHBOARD:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dashboard" },
      { status: 500 }
    );
  }
}