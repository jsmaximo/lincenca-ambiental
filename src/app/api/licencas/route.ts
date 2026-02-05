import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { calcularStatusLicenca } from "@/lib/licencaStatus";


export async function GET() {
  try {
   const licencas = await prisma.licenca.findMany({
  include: {
    empreendimento: true,
    condicionantes: true,
  },
});

const licencasComStatus = licencas.map((l) => ({
  ...l,
  status: calcularStatusLicenca(
    l.dataValidade,
    l.alertaDias
  ),
}));

return NextResponse.json(licencasComStatus);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar licenças" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const licenca = await prisma.licenca.create({
      data: {
        numero: body.numero,
        ano: body.ano,
        tipo: body.tipo,
        dataEmissao: body.dataEmissao
          ? new Date(body.dataEmissao)
          : null,
        dataValidade: body.dataValidade
          ? new Date(body.dataValidade)
          : null,
        alertaDias: body.alertaDias ?? 180,
        orgao: body.orgao,
        atividade: body.atividade,
        etapa: body.etapa,
        status: body.status ?? "VIGENTE",

        empreendimentoId: body.empreendimentoId,

        condicionantes: body.condicionantes
          ? {
              create: body.condicionantes.map((c: any) => ({
  nome: c.nome,                                // ✅ AGORA SALVA
  numero: c.numero,
  descricao: c.descricao,
  prazo: c.prazo ? new Date(c.prazo) : null,
  alertaDias: c.alertaDias ?? 180,              // ✅ AGORA SALVA
  status: c.status ?? "NAO_CUMPRIDA",
}))
            }
          : undefined,
      },
    });

    return NextResponse.json(licenca, { status: 201 });
  } catch (error) {
    console.error("ERRO CRIAR LICENÇA:", error);

     return NextResponse.json(
    { error: "Erro ao criar licença", details: String(error) },
    { status: 500 }
  );
  }
}
