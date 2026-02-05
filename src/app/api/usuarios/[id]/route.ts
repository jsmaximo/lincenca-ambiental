import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params como Promise
) {
  try {
    // Desempacota params com await
    const { id: idString } = await params;
    const body = await req.json();

    const id = Number(idString);

    if (!id) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const data: any = {
      nome: body.nome,
      email: body.email,
      roleId: body.roleId,
      ativo: body.ativo,
    };

    if (body.senha) {
      data.senha = await bcrypt.hash(body.senha, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
    });

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("ERRO ATUALIZAR USUÁRIO:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}