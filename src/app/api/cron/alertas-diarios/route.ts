// app/api/cron/alertas-diarios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";

export async function GET(req: Request) {
  // 🔐 Segurança: Verificar secret key
  const authHeader = req.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET_TOKEN}`;
  
  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    console.log("🔄 Iniciando verificação diária de licenças...");
    
    // Buscar licenças próximas do vencimento
    const licencas = await prisma.licenca.findMany({
      include: {
        empreendimento: {
          include: {
            responsaveis: true, // Pessoas que receberão alertas
          },
        },
      },
    });

    const hoje = new Date();
    const emailsEnviados = [];

    for (const licenca of licencas) {
      const dataValidade = new Date(licenca.dataValidade);
      const diasRestantes = Math.ceil(
        (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Se faltar menos de X dias (ex: 30 dias ou já venceu)
      if (diasRestantes <= 30) {
        for (const responsavel of licenca.empreendimento.responsaveis) {
          try {
            await enviarEmail({
              para: responsavel.email,
              assunto: `⚠️ Alerta: Licença ${licenca.numero} vence em ${diasRestantes} dias`,
              html: `
                <h2>Alerta de Licença Ambiental</h2>
                <p><strong>Licença:</strong> ${licenca.numero}</p>
                <p><strong>Tipo:</strong> ${licenca.tipo}</p>
                <p><strong>Vencimento:</strong> ${dataValidade.toLocaleDateString('pt-BR')}</p>
                <p><strong>Dias restantes:</strong> ${diasRestantes} dias</p>
                <p><strong>Empreendimento:</strong> ${licenca.empreendimento.nome}</p>
                <br/>
                <p><a href="${process.env.NEXTAUTH_URL}/dashboard/licencas/${licenca.id}" style="background:#16a34a; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">Ver detalhes</a></p>
              `,
            });
            
            emailsEnviados.push({
              licenca: licenca.numero,
              para: responsavel.email,
              diasRestantes,
            });
            
            console.log(`📧 Email enviado para ${responsavel.email}`);
          } catch (emailError) {
            console.error(`❌ Erro ao enviar para ${responsavel.email}:`, emailError);
          }
        }
      }
    }

    console.log(`✅ Processamento concluído. ${emailsEnviados.length} emails enviados.`);
    
    return NextResponse.json({
      success: true,
      message: `Verificação concluída. ${emailsEnviados.length} alertas enviados.`,
      data: emailsEnviados,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro no cron job:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}