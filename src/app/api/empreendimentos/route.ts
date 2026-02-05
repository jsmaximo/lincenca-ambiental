import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const empreendimentos = await prisma.empreendimento.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        licencas: true,
      },
    });

    return NextResponse.json(empreendimentos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar empreendimentos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const empreendimento = await prisma.empreendimento.create({
      data: {
        nome: body.nome,
        endereco: body.endereco,
        cidade: body.cidade ?? null,
        estado: body.estado ?? null,
      },
    });

    return NextResponse.json(empreendimento, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar empreendimento" },
      { status: 500 }
    );
  }
}

