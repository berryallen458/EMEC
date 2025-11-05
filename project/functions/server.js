import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Consulta E-MEC - Verificação de Diplomas</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 50px 40px;
          text-align: center;
          max-width: 600px;
          width: 100%;
        }
        .logo {
          font-size: 70px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 40px;
        }
        .search-form {
          margin: 30px 0;
        }
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        label {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        input[type="text"] {
          width: 100%;
          padding: 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        input[type="text"]:focus {
          outline: none;
          border-color: #667eea;
        }
        .btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .btn:active {
          transform: translateY(0);
        }
        .info-box {
          background: #f3f4f6;
          border-radius: 12px;
          padding: 20px;
          margin-top: 30px;
          text-align: left;
        }
        .info-box h3 {
          color: #374151;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .info-box p {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }
        .code-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }
        .code-tag {
          background: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 13px;
          color: #667eea;
          font-weight: 600;
        }
        .footer {
          margin-top: 30px;
          color: #9ca3af;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🎓</div>
        <h1>Consulta E-MEC</h1>
        <p class="subtitle">Sistema de Verificação de Diplomas</p>

        <form class="search-form" onsubmit="event.preventDefault(); verificarDiploma();">
          <div class="form-group">
            <label for="busca">Código de Verificação ou CPF</label>
            <input
              type="text"
              id="busca"
              name="busca"
              placeholder="Digite o código ou CPF"
              required
              autocomplete="off"
            >
          </div>
          <button type="submit" class="btn">Verificar Diploma</button>
        </form>

        <div class="info-box">
          <h3>Como Funcionar</h3>
          <p>Digite o código de verificação ou CPF para consultar sua autenticidade e visualizar os dados registrados.</p>
          <p style="margin-top: 12px;">Exemplos para teste:</p>
          <div class="code-examples">
            <span class="code-tag">EX1</span>
            <span class="code-tag">86332254471</span>
          </div>
        </div>

        <div class="footer">
          <p>Sistema E-MEC © 2024 - Ministério da Educação</p>
        </div>
      </div>

      <script>
        function verificarDiploma() {
          const busca = document.getElementById('busca').value.trim();
          if (busca) {
            window.location.href = '/verificar/' + encodeURIComponent(busca);
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/verificar/:busca', async (req, res) => {
  try {
    const busca = req.params.busca.trim();
    const buscaUppercase = busca.toUpperCase();
    const buscaSemFormatacao = busca.replace(/[.\-]/g, '');

    console.log('Buscando:', busca);

    let query = supabase
      .from('dados_aluno')
      .select('*');

    let resultado;

    if (buscaSemFormatacao.length === 11 && /^\d+$/.test(buscaSemFormatacao)) {
      console.log('Buscando por CPF:', buscaSemFormatacao);
      const { data, error } = await query.eq('cpf', buscaSemFormatacao).maybeSingle();
      if (error) throw error;
      resultado = data;
    } else {
      console.log('Buscando por código:', buscaUppercase);
      const { data, error } = await query.eq('codigo_sequencial', buscaUppercase).maybeSingle();
      if (error) throw error;
      resultado = data;
    }

    if (!resultado) {
      console.log('Nenhum resultado encontrado');
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Diploma Não Encontrado - E-MEC</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              padding: 50px 40px;
              text-align: center;
              max-width: 500px;
              width: 100%;
            }
            .icon { font-size: 70px; margin-bottom: 20px; }
            h1 { color: #333; font-size: 28px; margin-bottom: 15px; }
            .message { color: #ef4444; font-size: 18px; margin-bottom: 20px; font-weight: 600; }
            .code-box {
              background: #f3f4f6;
              border-radius: 10px;
              padding: 15px;
              margin: 20px 0;
            }
            .code-box p { color: #6b7280; margin: 5px 0; font-size: 14px; }
            .code-box strong {
              font-family: monospace;
              color: #374151;
              font-size: 16px;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 10px;
              margin-top: 10px;
              font-weight: 600;
              transition: transform 0.2s;
            }
            .btn:hover { transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Diploma Não Encontrado</h1>
            <p class="message">O código ou CPF informado não está registrado no sistema.</p>

            <div class="code-box">
              <p>Consulta realizada:</p>
              <p><strong>${busca}</strong></p>
            </div>

            <a href="/" class="btn">Nova Consulta</a>
          </div>
        </body>
        </html>
      `);
    }

    console.log('Aluno encontrado:', resultado.nome_completo);

    const aluno = resultado;

    let instituicao = null;
    let registro = null;

    if (aluno.instituicao_id) {
      const { data: inst, error: errInst } = await supabase
        .from('dados_instituicao')
        .select('*')
        .eq('id', aluno.instituicao_id)
        .maybeSingle();
      if (!errInst && inst) instituicao = inst;
    }

    if (aluno.registro_id) {
      const { data: reg, error: errReg } = await supabase
        .from('registro_instituicao_emissora')
        .select('*')
        .eq('id', aluno.registro_id)
        .maybeSingle();
      if (!errReg && reg) registro = reg;
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diploma de ${aluno.nome_completo} - E-MEC</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header .icon { font-size: 60px; margin-bottom: 15px; }
          .header h1 { font-size: 28px; margin-bottom: 8px; }
          .header .subtitle { font-size: 16px; opacity: 0.9; }
          .verified-badge {
            background: #22c55e;
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            display: inline-block;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
          }
          .content { padding: 40px; }
          .section {
            margin-bottom: 35px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 25px;
          }
          .section:last-child { border-bottom: none; margin-bottom: 0; }
          .section-title {
            color: #667eea;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section-title::before {
            content: '';
            width: 4px;
            height: 20px;
            background: #667eea;
            border-radius: 2px;
          }
          .field {
            margin-bottom: 18px;
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 15px;
            align-items: start;
          }
          @media (max-width: 600px) {
            .field { grid-template-columns: 1fr; gap: 5px; }
            .content { padding: 20px; }
          }
          .field-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .field-value {
            color: #1f2937;
            font-size: 16px;
            font-weight: 500;
            word-break: break-word;
          }
          .code-box {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
            border: 2px solid #d1d5db;
          }
          .code-box-label {
            color: #6b7280;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          .code-box-value {
            font-family: monospace;
            font-size: 28px;
            color: #667eea;
            font-weight: bold;
            letter-spacing: 3px;
          }
          .pdf-section {
            background: #f9fafb;
            padding: 30px;
            border-radius: 12px;
            margin: 30px 0;
          }
          .pdf-viewers {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }
          @media (max-width: 768px) {
            .pdf-viewers { grid-template-columns: 1fr; }
          }
          .pdf-viewer {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            background: white;
          }
          .pdf-viewer-title {
            background: #667eea;
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
          }
          .pdf-viewer iframe {
            width: 100%;
            height: 500px;
            border: none;
            display: block;
          }
          .download-section {
            text-align: center;
            margin: 30px 0;
          }
          .btn-download {
            display: inline-block;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
            margin: 10px;
          }
          .btn-download:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
          }
          .footer {
            text-align: center;
            padding: 25px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p { margin: 5px 0; }
          .btn-container { text-align: center; margin-top: 30px; }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 14px 35px;
            border-radius: 10px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🎓</div>
            <h1>Diploma Verificado</h1>
            <p class="subtitle">Sistema E-MEC de Verificação de Diplomas</p>
            <div class="verified-badge">✓ Diploma Autêntico e Válido</div>
          </div>

          <div class="content">
            <div class="section">
              <h2 class="section-title">Dados do Aluno</h2>
              <div class="field">
                <div class="field-label">Nome Completo</div>
                <div class="field-value">${aluno.nome_completo || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">CPF</div>
                <div class="field-value">${aluno.cpf || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">RG</div>
                <div class="field-value">${aluno.rg || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Data de Nascimento</div>
                <div class="field-value">${aluno.data_nascimento || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Nome do Pai</div>
                <div class="field-value">${aluno.nome_pai || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Nome da Mãe</div>
                <div class="field-value">${aluno.nome_mae || 'N/A'}</div>
              </div>
            </div>

            ${instituicao ? `
            <div class="section">
              <h2 class="section-title">Dados da Instituição</h2>
              <div class="field">
                <div class="field-label">Nome da Instituição</div>
                <div class="field-value">${instituicao.nome_instituicao || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">CNPJ</div>
                <div class="field-value">${instituicao.cnpj || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Endereço</div>
                <div class="field-value">${instituicao.endereco || 'N/A'}</div>
              </div>
            </div>
            ` : ''}

            ${registro ? `
            <div class="section">
              <h2 class="section-title">Registro da Instituição Emissora</h2>
              <div class="field">
                <div class="field-label">Portaria</div>
                <div class="field-value">${registro.portaria || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Código MEC</div>
                <div class="field-value">${registro.codigo_mec || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Número do Certificado</div>
                <div class="field-value">${registro.numero || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Livro</div>
                <div class="field-value">${registro.livro || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Página</div>
                <div class="field-value">${registro.pagina || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Grau Conferido</div>
                <div class="field-value">${registro.grau_conferidoo || 'N/A'}</div>
              </div>
            </div>
            ` : ''}

            ${registro && (registro.certificado || registro.historico) ? `
            <div class="section">
              <h2 class="section-title">Documentos</h2>

              <div class="pdf-viewers">
                ${registro.certificado ? `
                <div class="pdf-viewer">
                  <div class="pdf-viewer-title">Certificado</div>
                  <iframe src="${registro.certificado}#toolbar=0" type="application/pdf"></iframe>
                </div>
                ` : ''}

                ${registro.historico ? `
                <div class="pdf-viewer">
                  <div class="pdf-viewer-title">Histórico</div>
                  <iframe src="${registro.historico}#toolbar=0" type="application/pdf"></iframe>
                </div>
                ` : ''}
              </div>

              <div class="download-section">
                ${registro.certificado ? `
                <a href="${registro.certificado}" download="certificado_${aluno.codigo_sequencial}.pdf" class="btn-download">
                  📥 Baixar Certificado
                </a>
                ` : ''}
                ${registro.historico ? `
                <a href="${registro.historico}" download="historico_${aluno.codigo_sequencial}.pdf" class="btn-download">
                  📥 Baixar Histórico
                </a>
                ` : ''}
              </div>
            </div>
            ` : ''}

            <div class="code-box">
              <div class="code-box-label">Código de Verificação</div>
              <div class="code-box-value">${aluno.codigo_sequencial}</div>
            </div>

            <div class="btn-container">
              <a href="/" class="btn">Verificar Outro Diploma</a>
            </div>
          </div>

          <div class="footer">
            <p><strong>Este documento é válido e está registrado no Sistema E-MEC</strong></p>
            <p>Todos os dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD)</p>
            <p style="margin-top: 10px;">© 2024 Sistema E-MEC - Ministério da Educação</p>
          </div>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erro - Sistema E-MEC</title>
      </head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>Erro no Sistema</h1>
        <p>Ocorreu um erro ao processar sua solicitação.</p>
        <a href="/" style="padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Voltar</a>
      </body>
      </html>
    `);
  }
});

export const handler = app;
