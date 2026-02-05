import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ======================
   GET /api/condicionantes
====================== */
export async function GET() {
  try {
    const condicionantes = await prisma.condicionante.findMany({
      include: {
        licenca: {
          select: {
            id: true,
            numero: true,
            alertaDias: true,
            empreendimento: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: [
        { status: "asc" },
        { prazo: "asc" },
      ],
    });

    return NextResponse.json(condicionantes);
  } catch (error) {
    console.error("ERRO CONDICIONANTES:", error);

    return NextResponse.json(
      { error: "Erro ao buscar condicionantes" },
      { status: 500 }
    );
  }
}
