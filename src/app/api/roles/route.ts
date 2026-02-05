// app/api/roles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const roles = await prisma.role.findMany({
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(roles);
}
