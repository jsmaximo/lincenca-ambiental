import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    include: { role: true },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(usuarios);
}

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();

  const senhaHash = await bcrypt.hash(body.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: body.nome,
      email: body.email,
      senha: senhaHash,
      roleId: body.roleId,
    },
  });

  return NextResponse.json(usuario, { status: 201 });
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.usuario.update({
    where: { id: Number(params.id) },
    data: { ativo: false },
  });

  return NextResponse.json({ success: true });
}


