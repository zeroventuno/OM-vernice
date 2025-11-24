import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    console.log('=== EMAIL API CHAMADA ===')
    console.log('Timestamp:', new Date().toISOString())

    // Verificar se a API key está configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ ERRO: RESEND_API_KEY não está configurada no .env.local')
      return NextResponse.json({
        error: 'RESEND_API_KEY não configurada',
        message: 'A chave da API do Resend não foi encontrada nas variáveis de ambiente'
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log('✓ RESEND_API_KEY está configurada')
    console.log('API Key (primeiros 10 caracteres):', process.env.RESEND_API_KEY.substring(0, 10) + '...')

    const { orderData, userEmail, subject } = await request.json()

    console.log('📧 Preparando email...')
    console.log('Destinatário:', 'matteo@officinemattio.com')
    console.log('Remetente:', userEmail)
    const emailSubject = subject || `Novo Pedido de Pintura - ${orderData.ordem}`
    console.log('Assunto:', emailSubject)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .section h3 { margin-top: 0; color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
            .field { margin-bottom: 12px; }
            .field-label { font-weight: 600; color: #666; }
            .field-value { color: #333; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject ? 'Ordine Modificato' : 'Nuovo Ordine di Verniciatura'}</h1>
              <p>Sistema Verniciatura - Officine Mattio</p>
            </div>
            <div class="content">
              <p><strong>${subject ? 'Modificato da' : 'Creato da'}:</strong> ${userEmail}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
              
              <div class="section">
                <h3>Informazioni Generali</h3>
                <div class="field">
                  <span class="field-label">Ordine:</span>
                  <span class="field-value">${orderData.ordem}</span>
                </div>
                <div class="field">
                  <span class="field-label">Matricola Telaio:</span>
                  <span class="field-value">${orderData.matricula_quadro}</span>
                </div>
                <div class="field">
                  <span class="field-label">Modello:</span>
                  <span class="field-value">${orderData.modelo}</span>
                </div>
                <div class="field">
                  <span class="field-label">Taglia:</span>
                  <span class="field-value">${orderData.tamanho}</span>
                </div>
                <div class="field">
                  <span class="field-label">Agente Commerciale:</span>
                  <span class="field-value">${orderData.agente_comercial}</span>
                </div>
                <div class="field">
                  <span class="field-label">Catalogo 2026:</span>
                  <span class="field-value">${orderData.catalogo_2026 ? 'Sì' : 'No'}</span>
                </div>
              </div>

              <div class="section">
                <h3>Colore Base</h3>
                <div class="field">
                  <span class="field-label">Colore:</span>
                  <span class="field-value">${orderData.cor_base}</span>
                </div>
                <div class="field">
                  <span class="field-label">Finitura:</span>
                  <span class="field-value">${orderData.acabamento_base}${orderData.acabamento_base_rock ? ' + Rock' : ''}</span>
                </div>
              </div>

              <div class="section">
                <h3>Accent</h3>
                <div class="field">
                  <span class="field-label">Colore:</span>
                  <span class="field-value">${orderData.cor_detalhes}</span>
                </div>
                <div class="field">
                  <span class="field-label">Finitura:</span>
                  <span class="field-value">${orderData.acabamento_detalhes}${orderData.acabamento_detalhes_rock ? ' + Rock' : ''}</span>
                </div>
              </div>

              <div class="section">
                <h3>Logo</h3>
                <div class="field">
                  <span class="field-label">Colore:</span>
                  <span class="field-value">${orderData.cor_logo}</span>
                </div>
                <div class="field">
                  <span class="field-label">Finitura:</span>
                  <span class="field-value">${orderData.acabamento_logo}${orderData.acabamento_logo_rock ? ' + Rock' : ''}</span>
                </div>
              </div>

              <div class="section">
                <h3>Scritte</h3>
                <div class="field">
                  <span class="field-label">Colore:</span>
                  <span class="field-value">${orderData.cor_letras}</span>
                </div>
                <div class="field">
                  <span class="field-label">Finitura:</span>
                  <span class="field-value">${orderData.acabamento_letras}${orderData.acabamento_letras_rock ? ' + Rock' : ''}</span>
                </div>
              </div>

              ${orderData.pedidos_extras ? `
              <div class="section">
                <h3>Richieste Extra</h3>
                <p>${orderData.pedidos_extras}</p>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Sistema di Gestione Verniciatura - Officine Mattio</p>
            </div>
          </div>
        </body>
      </html>
    `

    console.log('🚀 Enviando email via Resend...')

    const { data, error } = await resend.emails.send({
      from: 'Verniciatura <onboarding@resend.dev>',
      // TODO: Change back to 'matteo@officinemattio.com' after verifying domain in Resend
      // Currently restricted to registered email on free tier
      to: ['zeroventuno.cc@gmail.com'],
      subject: `Novo Pedido de Pintura - ${orderData.ordem}`,
      html: emailHtml,
    })

    if (error) {
      console.error('❌ ERRO ao enviar email:', error)
      console.error('Detalhes do erro:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error }, { status: 400 })
    }

    console.log('✅ EMAIL ENVIADO COM SUCESSO!')
    console.log('ID do email:', data?.id)
    console.log('Resposta completa:', JSON.stringify(data, null, 2))
    console.log('=== FIM ===\n')

    return NextResponse.json({
      success: true,
      data,
      message: 'Email enviado com sucesso!'
    })
  } catch (error) {
    console.error('❌ ERRO CRÍTICO na API de email:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A')
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: 'Verifique os logs do servidor para mais informações'
    }, { status: 500 })
  }
}
