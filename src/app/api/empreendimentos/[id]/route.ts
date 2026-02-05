import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ AQUI ESTÁ A CHAVE
    const body = await req.json();

    const empreendimentoId = Number(id);

    if (isNaN(empreendimentoId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    //console.log("PUT empreendimento:", empreendimentoId, body);

    const empreendimento = await prisma.empreendimento.update({
      where: { id: empreendimentoId },
      data: {
        nome: body.nome,
        endereco: body.endereco,
      },
    });

    return NextResponse.json(empreendimento);
  } catch (error) {
    console.error("ERRO PUT:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar empreendimento" },
      { status: 500 }
    );
  }  
}


export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const empreendimentoId = Number(id);

    if (isNaN(empreendimentoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.empreendimento.delete({
      where: { id: empreendimentoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir empreendimento" },
      { status: 500 }
    );
  }
}