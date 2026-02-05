// app/api/condicionantes/[id]/cumprir/route.ts - CORRIJA
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ← params é Promise
) {
  try {
    const { id } = await context.params; // ← Aguarde a Promise
    const condicionanteId = Number(id);

    if (isNaN(condicionanteId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const condicionante = await prisma.condicionante.update({
      where: { id: condicionanteId },
      data: {
        status: "CUMPRIDA",
        dataCumprimento: new Date(),
      },
    });

    return NextResponse.json(condicionante);
  } catch (error) {
    console.error("ERRO AO MARCAR COMO CUMPRIDA:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar condicionante" },
      { status: 500 }
    );
  }
}