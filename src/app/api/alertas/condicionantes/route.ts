// app/api/alertas/condicionantes/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const hoje = new Date();

  const condicionantes = await prisma.condicionante.findMany({
    where: {
      status: "NAO_CUMPRIDA",
      prazo: { not: null },
    },
    include: {
      licenca: {
        include: { empreendimento: true },
      },
    },
  });

  const paraAlertar = condicionantes.filter((c) => {
    const diff =
      (new Date(c.prazo!).getTime() - hoje.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff <= (c.alertaDias ?? 180);
  });

  // aqui entra envio de email (próximo passo)
  return NextResponse.json({ total: paraAlertar.length });
}
