// lib/email-templates.ts - VERSÃO SIMPLIFICADA
export function templateLicencaVencimento(dados: {
  numero: string;
  tipo: string;
  empreendimento: string;
  dataValidade: string;
  diasRestantes: number;
  link: string;
  responsavel?: string;
}) {
  const {
    numero,
    tipo,
    empreendimento,
    dataValidade,
    diasRestantes,
    link,
    responsavel
  } = dados;
  
  const corDestaque = diasRestantes <= 7 ? "#dc2626" : 
                     diasRestantes <= 15 ? "#f59e0b" : 
                     "#16a34a";
  
  const statusTexto = diasRestantes <= 7 ? "URGENTE" : 
                     diasRestantes <= 15 ? "ATENÇÃO" : 
                     "PRÓXIMO";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Licença Ambiental</title>
  <style>
    /* ... mesmo CSS ... */
  </style>
</head>
<body>
  <div class="header">
    <h1>⚠️ Alerta de Licença Ambiental</h1>
  </div>
  
  <div class="content">
    ${responsavel ? `<p>Olá <strong>${responsavel}</strong>,</p>` : '<p>Prezado(a),</p>'}
    
    <div class="alert-badge">${statusTexto}</div>
    
    <div class="countdown">
      ${diasRestantes} ${diasRestantes === 1 ? 'DIA' : 'DIAS'}
    </div>
    
    <p>Sua licença ambiental está próxima do vencimento. Acompanhe os detalhes abaixo:</p>
    
    <div class="card">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Licença</div>
          <div class="info-value">${numero}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Tipo</div>
          <div class="info-value">${tipo}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Empreendimento</div>
          <div class="info-value">${empreendimento}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Data de Vencimento</div>
          <div class="info-value">${dataValidade}</div>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" class="btn">🔍 Ver detalhes da licença</a>
    </div>
    
    <p style="color: #64748b; font-size: 14px; border-left: 4px solid #e5e7eb; padding-left: 12px;">
      <strong>Lembrete:</strong> É importante realizar a renovação com antecedência para evitar multas ou interrupções nas atividades.
    </p>
  </div>
  
  <div class="footer">
    <p>Este é um alerta automático do Sistema de Gestão de Licenças Ambientais VCA Construtora.</p>
    <p>📍 Av. Exemplo, 1234 - São Paulo/SP | 📞 (11) 9999-9999</p>
    <p>© ${new Date().getFullYear()} VCA Construtora. Todos os direitos reservados.</p>
  </div>
</body>
</html>
  `;
}