import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use variáveis de ambiente se estiverem configuradas no Netlify;
// caso contrário, usa as credenciais que você forneceu.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://nfubfeowlsattcxygkdj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdWJmZW93bHNhdHRjeHlna2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDUwODQsImV4cCI6MjA2NDkyMTA4NH0.UNoIUKtU6ZGs9AZIh1LE75WcfiDLtn1EIqsWtmnNzAs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const handler = async (event) => {
  try {
    // Aceita tanto /verificar/<valor> (via redirect) como query ?busca=...
    const qsBusca = event.queryStringParameters && event.queryStringParameters.busca;
    // event.path ex: "/.netlify/functions/verificar" ou "/.netlify/functions/verificar/EX1"
    const pathParts = event.path ? event.path.split('/').filter(Boolean) : [];
    // Se foi proxy via redirect, o último item pode ser o valor buscado
    const pathBusca = pathParts.length >= 3 ? pathParts[pathParts.length - 1] : null;

    const rawBusca = qsBusca || pathBusca;
    if (!rawBusca) {
      return {
        statusCode: 302,
        headers: { Location: '/' },
        body: '',
      };
    }

    const busca = decodeURIComponent(rawBusca).trim();
    const buscaUppercase = busca.toUpperCase();
    const buscaSemFormatacao = busca.replace(/[.\-]/g, '');

    let query = supabase.from('dados_aluno').select('*');
    let resultado;

    if (buscaSemFormatacao.length === 11 && /^\d+$/.test(buscaSemFormatacao)) {
      const { data, error } = await query.eq('cpf', buscaSemFormatacao).maybeSingle();
      if (error) throw error;
      resultado = data;
    } else {
      const { data, error } = await query.eq('codigo_sequencial', buscaUppercase).maybeSingle();
      if (error) throw error;
      resultado = data;
    }

    if (!resultado) {
      // HTML de "não encontrado" (mantém o layout do projeto)
      const notFoundHtml = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Diploma Não Encontrado - E-MEC</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body {\n      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      min-height: 100vh;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 20px;\n    }\n    .container {\n      background: white;\n      border-radius: 20px;\n      box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n      padding: 50px 40px;\n      text-align: center;\n      max-width: 500px;\n      width: 100%;\n    }\n    .icon { font-size: 70px; margin-bottom: 20px; }\n    h1 { color: #333; font-size: 28px; margin-bottom: 15px; }\n    .message { color: #ef4444; font-size: 18px; margin-bottom: 20px; font-weight: 600; }\n    .code-box {\n      background: #f3f4f6;\n      border-radius: 10px;\n      padding: 15px;\n      margin: 20px 0;\n    }\n    .code-box p { color: #6b7280; margin: 5px 0; font-size: 14px; }\n    .code-box strong {\n      font-family: monospace;\n      color: #374151;\n      font-size: 16px;\n    }\n    .btn {\n      display: inline-block;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      color: white;\n      text-decoration: none;\n      padding: 12px 30px;\n      border-radius: 10px;\n      margin-top: 10px;\n      font-weight: 600;\n      transition: transform 0.2s;\n    }\n    .btn:hover { transform: translateY(-2px); }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="icon">❌</div>\n    <h1>Diploma Não Encontrado</h1>\n    <p class="message">O código ou CPF informado não está registrado no sistema.</p>\n    <div class="code-box">\n      <p>Consulta realizada:</p>\n      <p><strong>${escapeHtml(busca)}</strong></p>\n    </div>\n    <a href="/" class="btn">Nova Consulta</a>\n  </div>\n</body>\n</html>`;
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: notFoundHtml,
      };
    }

    const aluno = resultado;

    let instituicao = null;
    let registro = null;

    if (aluno.instituicao_id) {
      const { data: inst } = await supabase
        .from('dados_instituicao')
        .select('*')
        .eq('id', aluno.instituicao_id)
        .maybeSingle();
      if (inst) instituicao = inst;
    }

    if (aluno.registro_id) {
      const { data: reg } = await supabase
        .from('registro_instituicao_emissora')
        .select('*')
        .eq('id', aluno.registro_id)
        .maybeSingle();
      if (reg) registro = reg;
    }

    // Gera o HTML completo como no server.js original, preenchendo com os dados do banco
    const html = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Diploma de ${escapeHtml(aluno.nome_completo || 'N/A')} - E-MEC</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body {\n      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      min-height: 100vh;\n      padding: 40px 20px;\n    }\n    .container {\n      max-width: 900px;\n      margin: 0 auto;\n      background: white;\n      border-radius: 20px;\n      box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n      overflow: hidden;\n    }\n    .header {\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      color: white;\n      padding: 40px;\n      text-align: center;\n    }\n    .header .icon { font-size: 60px; margin-bottom: 15px; }\n    .header h1 { font-size: 28px; margin-bottom: 8px; }\n    .header .subtitle { font-size: 16px; opacity: 0.9; }\n    .verified-badge {\n      background: #22c55e;\n      color: white;\n      padding: 12px 24px;\n      border-radius: 50px;\n      display: inline-block;\n      margin: 20px 0;\n      font-weight: 600;\n      font-size: 16px;\n    }\n    .content { padding: 40px; }\n    .section {\n      margin-bottom: 35px;\n      border-bottom: 1px solid #e5e7eb;\n      padding-bottom: 25px;\n    }\n    .section:last-child { border-bottom: none; margin-bottom: 0; }\n    .section-title {\n      color: #667eea;\n      font-size: 18px;\n      font-weight: 700;\n      margin-bottom: 20px;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n      display: flex;\n      align-items: center;\n      gap: 10px;\n    }\n    .field {\n      margin-bottom: 18px;\n      display: grid;\n      grid-template-columns: 200px 1fr;\n      gap: 15px;\n      align-items: start;\n    }\n    @media (max-width: 600px) {\n      .field { grid-template-columns: 1fr; gap: 5px; }\n      .content { padding: 20px; }\n    }\n    .field-label {\n      color: #6b7280;\n      font-size: 14px;\n      font-weight: 600;\n      text-transform: uppercase;\n      letter-spacing: 0.3px;\n    }\n    .field-value {\n      color: #1f2937;\n      font-size: 16px;\n      font-weight: 500;\n      word-break: break-word;\n    }\n    .code-box {\n      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);\n      padding: 25px;\n      border-radius: 12px;\n      margin: 30px 0;\n      text-align: center;\n      border: 2px solid #d1d5db;\n    }\n    .code-box-label {\n      color: #6b7280;\n      font-size: 13px;\n      font-weight: 600;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n      margin-bottom: 10px;\n    }\n    .code-box-value {\n      font-family: monospace;\n      font-size: 28px;\n      color: #667eea;\n      font-weight: bold;\n      letter-spacing: 3px;\n    }\n    .pdf-section {\n      background: #f9fafb;\n      padding: 30px;\n      border-radius: 12px;\n      margin: 30px 0;\n    }\n    .pdf-viewers {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 20px;\n      margin-top: 20px;\n    }\n    @media (max-width: 768px) {\n      .pdf-viewers { grid-template-columns: 1fr; }\n    }\n    .pdf-viewer {\n      border: 2px solid #e5e7eb;\n      border-radius: 8px;\n      overflow: hidden;\n      background: white;\n    }\n    .pdf-viewer-title {\n      background: #667eea;\n      color: white;\n      padding: 10px;\n      text-align: center;\n      font-weight: 600;\n      font-size: 14px;\n    }\n    .pdf-viewer iframe {\n      width: 100%;\n      height: 500px;\n      border: none;\n      display: block;\n    }\n    .download-section {\n      text-align: center;\n      margin: 30px 0;\n    }\n    .btn-download {\n      display: inline-block;\n      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);\n      color: white;\n      text-decoration: none;\n      padding: 16px 40px;\n      border-radius: 10px;\n      font-weight: 600;\n      font-size: 16px;\n      transition: transform 0.2s, box-shadow 0.2s;\n      margin: 10px;\n    }\n    .btn-download:hover {\n      transform: translateY(-2px);\n      box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);\n    }\n    .footer {\n      text-align: center;\n      padding: 25px;\n      background: #f9fafb;\n      color: #6b7280;\n      font-size: 14px;\n      border-top: 1px solid #e5e7eb;\n    }\n    .footer p { margin: 5px 0; }\n    .btn-container { text-align: center; margin-top: 30px; }\n    .btn {\n      display: inline-block;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      color: white;\n      text-decoration: none;\n      padding: 14px 35px;\n      border-radius: 10px;\n      font-weight: 600;\n      transition: transform 0.2s, box-shadow 0.2s;\n    }\n    .btn:hover {\n      transform: translateY(-2px);\n      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);\n    }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="header">\n      <div class="icon">🎓</div>\n      <h1>Diploma Verificado</h1>\n      <p class="subtitle">Sistema E-MEC de Verificação de Diplomas</p>\n      <div class="verified-badge">✓ Diploma Autêntico e Válido</div>\n    </div>\n    <div class="content">\n      <div class="section">\n        <h2 class="section-title">Dados do Aluno</h2>\n        <div class="field">\n          <div class="field-label">Nome Completo</div>\n          <div class="field-value">${escapeHtml(aluno.nome_completo || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">CPF</div>\n          <div class="field-value">${escapeHtml(aluno.cpf || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">RG</div>\n          <div class="field-value">${escapeHtml(aluno.rg || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Data de Nascimento</div>\n          <div class="field-value">${escapeHtml(aluno.data_nascimento || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Nome do Pai</div>\n          <div class="field-value">${escapeHtml(aluno.nome_pai || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Nome da Mãe</div>\n          <div class="field-value">${escapeHtml(aluno.nome_mae || 'N/A')}</div>\n        </div>\n      </div>\n      ${instituicao ? `\n      <div class="section">\n        <h2 class="section-title">Dados da Instituição</h2>\n        <div class="field">\n          <div class="field-label">Nome da Instituição</div>\n          <div class="field-value">${escapeHtml(instituicao.nome_instituicao || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">CNPJ</div>\n          <div class="field-value">${escapeHtml(instituicao.cnpj || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Endereço</div>\n          <div class="field-value">${escapeHtml(instituicao.endereco || 'N/A')}</div>\n        </div>\n      </div>\n      ` : ''} \n      ${registro ? `\n      <div class="section">\n        <h2 class="section-title">Registro da Instituição Emissora</h2>\n        <div class="field">\n          <div class="field-label">Portaria</div>\n          <div class="field-value">${escapeHtml(registro.portaria || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Código MEC</div>\n          <div class="field-value">${escapeHtml(registro.codigo_mec || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Número do Certificado</div>\n          <div class="field-value">${escapeHtml(registro.numero || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Livro</div>\n          <div class="field-value">${escapeHtml(registro.livro || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Página</div>\n          <div class="field-value">${escapeHtml(registro.pagina || 'N/A')}</div>\n        </div>\n        <div class="field">\n          <div class="field-label">Grau Conferido</div>\n          <div class="field-value">${escapeHtml(registro.grau_conferidoo || 'N/A')}</div>\n        </div>\n      </div>\n      ` : ''} \n      ${(registro && (registro.certificado || registro.historico)) ? `\n      <div class="section">\n        <h2 class="section-title">Documentos</h2>\n        <div class="pdf-viewers">\n          ${registro.certificado ? `\n          <div class="pdf-viewer">\n            <div class="pdf-viewer-title">Certificado</div>\n            <iframe src="${escapeHtml(registro.certificado)}#toolbar=0" type="application/pdf"></iframe>\n          </div>\n          ` : ''} \n          ${registro.historico ? `\n          <div class="pdf-viewer">\n            <div class="pdf-viewer-title">Histórico</div>\n            <iframe src="${escapeHtml(registro.historico)}#toolbar=0" type="application/pdf"></iframe>\n          </div>\n          ` : ''} \n        </div>\n        <div class="download-section">\n          ${registro.certificado ? `\n          <a href="${escapeHtml(registro.certificado)}" download="certificado_${escapeHtml(aluno.codigo_sequencial || '')}.pdf" class="btn-download">\n            📥 Baixar Certificado\n          </a>\n          ` : ''} \n          ${registro.historico ? `\n          <a href="${escapeHtml(registro.historico)}" download="historico_${escapeHtml(aluno.codigo_sequencial || '')}.pdf" class="btn-download">\n            📥 Baixar Histórico\n          </a>\n          ` : ''} \n        </div>\n      </div>\n      ` : ''} \n      <div class="code-box">\n        <div class="code-box-label">Código de Verificação</div>\n        <div class="code-box-value">${escapeHtml(aluno.codigo_sequencial || '')}</div>\n      </div>\n      <div class="btn-container">\n        <a href="/" class="btn">Verificar Outro Diploma</a>\n      </div>\n    </div>\n    <div class="footer">\n      <p><strong>Este documento é válido e está registrado no Sistema E-MEC</strong></p>\n      <p>Todos os dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD)</p>\n      <p style="margin-top: 10px;">© 2024 Sistema E-MEC - Ministério da Educação</p>\n    </div>\n  </div>\n</body>\n</html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: html,
    };
  } catch (error) {
    console.error('Erro na function verificar:', error);
    const errorHtml = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Erro - Sistema E-MEC</title>\n</head>\n<body style="font-family: Arial; text-align: center; padding: 50px;">\n  <h1>Erro no Sistema</h1>\n  <p>Ocorreu um erro ao processar sua solicitação.</p>\n  <a href="/" style="padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Voltar</a>\n</body>\n</html>`;
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: errorHtml,
    };
  }
};
