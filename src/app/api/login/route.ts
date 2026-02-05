export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha obrigatórios" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!usuario || !usuario.ativo) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // ✅ CRIA A RESPOSTA
    const response = NextResponse.json({ success: true });

    // ✅ SET COOKIE DA FORMA CORRETA
    response.cookies.set(
      "session",
      JSON.stringify({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role.nome,
      }),
      {
        httpOnly: true,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("ERRO LOGIN:", error);
    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    );
  }
}
