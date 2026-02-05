import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const licencaId = Number(id);

    if (isNaN(licencaId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const licenca = await prisma.licenca.findUnique({
      where: { id: licencaId },
      include: {
        empreendimento: true,
        condicionantes: {
          orderBy: { numero: 'asc' }
        }
      }
    });

    if (!licenca) {
      return NextResponse.json(
        { error: "Licença não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(licenca);
  } catch (error) {
    console.error("ERRO BUSCAR LICENÇA:", error);
    return NextResponse.json(
      { error: "Erro ao buscar licença" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const licencaId = Number(id);

    if (isNaN(licencaId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // 1️⃣ Atualiza dados da licença
    await prisma.licenca.update({
      where: { id: licencaId },
      data: {
        numero: body.numero,
        tipo: body.tipo,
        dataEmissao: body.dataEmissao
          ? new Date(body.dataEmissao)
          : null,
        dataValidade: body.dataValidade
          ? new Date(body.dataValidade)
          : null,
        alertaDias: body.alertaDias,
        orgao: body.orgao,
        atividade: body.atividade,
      },
    });

    // 2️⃣ Remove condicionantes antigas
    await prisma.condicionante.deleteMany({
      where: { licencaId },
    });

    // 3️⃣ Cria condicionantes novas
    if (body.condicionantes?.length) {
      await prisma.condicionante.createMany({
        data: body.condicionantes.map((c: any, index: number) => ({
          licencaId,
          nome: c.nome,
          numero: index + 1, // ordem visual
          descricao: c.descricao,
          prazo: c.prazo ? new Date(c.prazo) : null,
          alertaDias: c.alertaDias ?? 180,
          status: c.status ?? "NAO_CUMPRIDA",
        })),
      });
    }

    // ✅ RESPOSTA OBRIGATÓRIA
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO EDITAR LICENÇA:", error);
    return NextResponse.json(
      { error: "Erro ao editar licença" },
      { status: 500 }
    );
  }
}
