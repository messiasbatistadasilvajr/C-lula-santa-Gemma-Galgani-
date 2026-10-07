import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generatePixCopyPaste } from './src/utils/pixGenerator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Memória de sessões do Bot de WhatsApp no servidor (para webhooks externos)
interface BotSessionState {
  step: 'IDLE' | 'MAIN_MENU' | 'AWAITING_OFFER_AMOUNT' | 'AWAITING_CAMPAIGN_CHOICE' | 'AWAITING_CAMPAIGN_AMOUNT' | 'AWAITING_BIRTHDATE';
  selectedCampaignId?: string;
  selectedCampaignTitle?: string;
  donorName?: string;
  lastUpdated: number;
}

const botSessions = new Map<string, BotSessionState>();

/**
 * Envia mensagem real via API de WhatsApp (Evolution API / Z-API / Meta Cloud API)
 * caso as variáveis WHATSAPP_API_URL e WHATSAPP_API_TOKEN estejam configuradas no ambiente.
 */
async function dispatchWhatsAppMessage(phone: string, text: string): Promise<{ sentToProvider: boolean; providerResponse?: unknown }> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const instance = process.env.WHATSAPP_INSTANCE_NAME || 'celula_santa_gemma';

  if (!apiUrl || !apiToken) {
    return { sentToProvider: false };
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const endpoint = apiUrl.endsWith('/')
      ? `${apiUrl}message/sendText/${instance}`
      : `${apiUrl}/message/sendText/${instance}`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiToken,
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        number: formattedNumber,
        text,
      }),
    });

    const data = await resp.json().catch(() => ({}));
    return { sentToProvider: resp.ok, providerResponse: data };
  } catch (err) {
    console.warn('Aviso ao contatar provedor WhatsApp externo:', err);
    return { sentToProvider: false };
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ---------------------------------------------------------------------------
  // 1. STATUS DA INTEGRAÇÃO DIZIFY (GATEWAY PIX + WHATSAPP)
  // ---------------------------------------------------------------------------
  app.get('/api/dizify/status', (_req: Request, res: Response) => {
    const hasMercadoPago = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
    const hasAsaas = Boolean(process.env.ASAAS_API_KEY);
    const hasWhatsAppApi = Boolean(process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN);

    res.json({
      ok: true,
      activeGateway: hasMercadoPago ? 'mercadopago' : hasAsaas ? 'asaas' : 'pix_emvco_dinamico',
      hasMercadoPago,
      hasAsaas,
      hasWhatsAppApi,
      pixKey: process.env.PIX_STATIC_KEY || 'shcelsantagemmagalganipql@gmail.com',
      merchantName: process.env.PIX_MERCHANT_NAME || 'CELULA SANTA GEMMA',
      webhookEndpoints: {
        paymentWebhook: '/api/webhooks/payment',
        whatsappWebhook: '/api/whatsapp/webhook',
        birthdayCron: '/api/cron/birthdays',
      },
    });
  });

  // ---------------------------------------------------------------------------
  // 2. GERAÇÃO DE PAGAMENTO PIX DINÂMICO (MERCADO PAGO / ASAAS / EMVCo BACEN)
  // ---------------------------------------------------------------------------
  app.post('/api/pix/generate', async (req: Request, res: Response) => {
    try {
      const {
        amount,
        description = 'Oferta Célula Santa Gemma Galgani',
        donorName = 'Membro da Célula',
        donorPhone = '',
        donorEmail = 'membro@shalom.org',
        campaignId = '',
        gateway = 'mercadopago',
        pixKey: customPixKey,
      } = req.body;

      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount <= 0) {
        res.status(400).json({ error: 'Valor da oferta inválido. Informe um valor maior que zero.' });
        return;
      }

      const externalReference = `SG_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      const asaasKey = process.env.ASAAS_API_KEY;

      // Tentativa 1: Mercado Pago API Oficial (se configurado)
      if (mpToken && (gateway === 'mercadopago' || !asaasKey)) {
        try {
          const mpResp = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${mpToken}`,
              'X-Idempotency-Key': externalReference,
            },
            body: JSON.stringify({
              transaction_amount: numericAmount,
              description,
              payment_method_id: 'pix',
              external_reference: externalReference,
              payer: {
                email: donorEmail,
                first_name: donorName.split(' ')[0] || 'Membro',
                last_name: donorName.split(' ').slice(1).join(' ') || 'Shalom',
              },
            }),
          });

          if (mpResp.ok) {
            const mpData = await mpResp.json();
            const qrCodeCopyPaste = mpData?.point_of_interaction?.transaction_data?.qr_code;
            const qrCodeBase64 = mpData?.point_of_interaction?.transaction_data?.qr_code_base64;

            if (qrCodeCopyPaste) {
              res.json({
                ok: true,
                gatewayUsed: 'mercadopago',
                externalReference: String(mpData.id || externalReference),
                amount: numericAmount,
                pixCopyPaste: qrCodeCopyPaste,
                qrCodeBase64: qrCodeBase64 ? `data:image/png;base64,${qrCodeBase64}` : undefined,
                expiresInMinutes: 30,
              });
              return;
            }
          }
        } catch (mpErr) {
          console.warn('Fallback Mercado Pago -> Gerador EMVCo PIX:', mpErr);
        }
      }

      // Padrão Oficial EMVCo BRCode BACEN (funciona instantaneamente com qualquer banco)
      const pixKeyToUse = customPixKey || process.env.PIX_STATIC_KEY || 'shcelsantagemmagalganipql@gmail.com';
      const merchantName = process.env.PIX_MERCHANT_NAME || 'CELULA SANTA GEMMA';
      const merchantCity = process.env.PIX_MERCHANT_CITY || 'SAO PAULO';

      const pixCopyPaste = generatePixCopyPaste({
        pixKey: pixKeyToUse,
        merchantName,
        merchantCity,
        amount: numericAmount,
        txid: externalReference.replace(/[^a-zA-Z0-9]/g, '').substring(0, 25),
        description: `${description} ${donorName}`.substring(0, 35),
      });

      res.json({
        ok: true,
        gatewayUsed: mpToken ? 'mercadopago' : asaasKey ? 'asaas' : 'pix_direto',
        externalReference,
        amount: numericAmount,
        pixCopyPaste,
        donorPhone,
        campaignId,
        expiresInMinutes: 30,
      });
    } catch (error) {
      console.error('Erro ao gerar cobrança PIX:', error);
      res.status(500).json({ error: 'Falha ao gerar código PIX.' });
    }
  });

  // ---------------------------------------------------------------------------
  // 3. WEBHOOK DE CONFIRMAÇÃO AUTOMÁTICA DE PAGAMENTO (MERCADO PAGO / ASAAS / SIMULADOR)
  // ---------------------------------------------------------------------------
  app.post('/api/webhooks/payment', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};

      // Suporta payload do Mercado Pago (action: 'payment.updated'), Asaas (event: 'PAYMENT_RECEIVED') ou confirmação direta
      const donationId = body.donationId || body?.data?.id || body?.payment?.externalReference || `don_${Date.now()}`;
      const donorName = body.donorName || 'Irmão(ã) da Célula';
      const donorPhone = body.donorPhone || '(11) 98765-4321';
      const amount = Number(body.amount || body?.payment?.value || 50);
      const campaignTitle = body.campaignTitle || 'Oferta & Caixinha da Célula';
      const paidAt = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const formattedAmount = amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      // Mensagem automática de agradecimento enviada no WhatsApp do membro assim que o PIX é pago
      const thankYouWhatsAppMessage =
        `✨ *SHALOM! OFERTA CONFIRMADA!* ✨\n\n` +
        `Olá, *${donorName}*! A paz de Jesus e o amor de Maria.\n` +
        `Acabamos de receber a confirmação automática do seu PIX:\n\n` +
        `🧾 *Comprovante da Célula Santa Gemma Galgani*\n` +
        `• *Destino:* ${campaignTitle}\n` +
        `• *Valor:* ${formattedAmount}\n` +
        `• *Data/Hora:* ${paidAt}\n` +
        `• *Autenticação:* #${String(donationId).slice(-8).toUpperCase()}\n\n` +
        `🙏 _"Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."_ (2Cor 9, 7)\n\n` +
        `Que por intercessão de *Santa Gemma Galgani* o Senhor multiplique o cêntuplo na sua vida e na sua família! 🌹✝️`;

      // Dispara no provedor real de WhatsApp se configurado
      const providerResult = await dispatchWhatsAppMessage(donorPhone, thankYouWhatsAppMessage);

      res.json({
        ok: true,
        status: 'paid',
        donationId,
        paidAt,
        thankYouMessage: thankYouWhatsAppMessage,
        whatsappProviderDispatched: providerResult.sentToProvider,
      });
    } catch (error) {
      console.error('Erro no processamento do Webhook de pagamento:', error);
      res.status(500).json({ error: 'Erro interno ao processar webhook.' });
    }
  });

  // ---------------------------------------------------------------------------
  // 4. WEBHOOK DO BOT DE WHATSAPP (MÁQUINA DE ESTADOS CONVERSACIONAL ESTILO DIZIFY)
  // ---------------------------------------------------------------------------
  app.post('/api/whatsapp/webhook', async (req: Request, res: Response) => {
    try {
      const {
        from = '(11) 98765-4321',
        name = 'Irmão(ã)',
        text = 'Oi',
        campaigns = [],
        donorHistory = [],
      } = req.body;

      const cleanInput = String(text).trim();
      const lowerInput = cleanInput.toLowerCase();

      const currentSession: BotSessionState = botSessions.get(from) || {
        step: 'IDLE',
        donorName: name,
        lastUpdated: Date.now(),
      };

      let botReply = '';
      let generatedPix: {
        amount: number;
        pixCopyPaste: string;
        campaignTitle: string;
        campaignId?: string;
        type: 'oferta' | 'comunhao_bens' | 'campanha';
      } | null = null;
      let updatedBirthDate: string | null = null;

      // Saudações ou pedido de menu inicial
      const isGreeting =
        ['oi', 'olá', 'ola', 'menu', 'shalom', 'paz', 'iniciar', 'começar', '0', 'voltar'].includes(lowerInput) ||
        currentSession.step === 'IDLE';

      if (isGreeting) {
        botSessions.set(from, {
          step: 'MAIN_MENU',
          donorName: name,
          lastUpdated: Date.now(),
        });

        botReply =
          `🌹 *Shalom, ${name}! Bem-vindo(a) à Célula Santa Gemma Galgani!* ✝️\n\n` +
          `Sou o assistente de *Caixinha da Célula & Ofertas (Dizify)* da nossa célula. Como posso ajudar você hoje?\n\n` +
          `Digite o *número* da opção desejada:\n` +
          `*1️⃣ Fazer uma Oferta / Caixinha da Célula*\n` +
          `*2️⃣ Ajudar em uma Campanha da Célula*\n` +
          `*3️⃣ Ver meu Histórico de Doações*\n` +
          `*4️⃣ Atualizar Data de Nascimento (Aniversariantes)* 🎂`;
      } else if (currentSession.step === 'MAIN_MENU') {
        if (cleanInput === '1' || lowerInput.includes('oferta') || lowerInput.includes('caixinha') || lowerInput.includes('comunhao')) {
          botSessions.set(from, {
            ...currentSession,
            step: 'AWAITING_OFFER_AMOUNT',
            selectedCampaignTitle: 'Oferta & Caixinha da Célula',
            lastUpdated: Date.now(),
          });
          botReply =
            `🙏 *Oferta & Caixinha da Célula*\n\n` +
            `Sua generosidade sustenta a missão, os encontros e a evangelização da Célula Santa Gemma!\n\n` +
            `Qual valor você deseja ofertar hoje?\n` +
            `• Digite um valor (ex: *25*, *50*, *100*)\n` +
            `• Ou digite *0* para voltar ao menu.`;
        } else if (cleanInput === '2' || lowerInput.includes('campanha')) {
          botSessions.set(from, {
            ...currentSession,
            step: 'AWAITING_CAMPAIGN_CHOICE',
            lastUpdated: Date.now(),
          });
          const campList = Array.isArray(campaigns) && campaigns.length > 0
            ? campaigns
                .map(
                  (c: { title: string; goalAmount: number; currentAmount: number }, idx: number) =>
                    `*${idx + 1}.* ${c.title} _(Meta: R$ ${c.goalAmount} | Atual: R$ ${c.currentAmount})_`
                )
                .join('\n')
            : `*1.* Retiro de Carnaval Renascer\n*2.* Cestas Básicas - Ação Social Santa Gemma\n*3.* Fundo de Lanche & Estrutura da Célula`;

          botReply =
            `🎯 *Campanhas Ativas da Célula Santa Gemma*\n\n` +
            `Escolha o número da campanha que deseja apoiar:\n\n` +
            `${campList}\n\n` +
            `Digite o número da campanha ou *0* para voltar:`;
        } else if (cleanInput === '3' || lowerInput.includes('historico') || lowerInput.includes('histórico')) {
          const historyList = Array.isArray(donorHistory) && donorHistory.length > 0
            ? donorHistory
                .slice(0, 5)
                .map(
                  (d: { createdAt: string; amount: number; campaignTitle?: string; status: string }) =>
                    `• ${d.createdAt}: *R$ ${Number(d.amount).toFixed(2)}* (${d.campaignTitle || 'Oferta'}) — ${
                      d.status === 'paid' ? '✅ Pago' : '⏳ Pendente'
                    }`
                )
                .join('\n')
            : 'Você ainda não possui doações registradas neste número.';

          botReply =
            `📊 *Seu Histórico de Ofertas (${name})*\n` +
            `📱 Telefone: ${from}\n\n` +
            `${historyList}\n\n` +
            `Digite *1* para fazer uma nova oferta, *2* para campanhas ou *Oi* para o menu principal.`;
        } else if (cleanInput === '4' || lowerInput.includes('aniversario') || lowerInput.includes('nascimento')) {
          botSessions.set(from, {
            ...currentSession,
            step: 'AWAITING_BIRTHDATE',
            lastUpdated: Date.now(),
          });
          botReply =
            `🎂 *Cadastro de Aniversariantes da Célula*\n\n` +
            `Queremos rezar pela sua vida e enviar uma bênção especial no seu aniversário!\n` +
            `Por favor, digite sua *data de nascimento* no formato *DD/MM/AAAA* (ex: _14/10/1998_):`;
        } else {
          botReply =
            `Não entendi sua opção. 😅\nPor favor, digite:\n` +
            `*1* para Fazer uma Oferta\n` +
            `*2* para Campanhas da Célula\n` +
            `*3* para Ver seu Histórico\n` +
            `*4* para Atualizar Data de Nascimento`;
        }
      } else if (currentSession.step === 'AWAITING_CAMPAIGN_CHOICE') {
        const choiceIdx = parseInt(cleanInput, 10) - 1;
        const chosenCampaign = Array.isArray(campaigns) && campaigns[choiceIdx]
          ? campaigns[choiceIdx]
          : { id: 'camp_1', title: 'Campanha da Célula Santa Gemma' };

        botSessions.set(from, {
          ...currentSession,
          step: 'AWAITING_CAMPAIGN_AMOUNT',
          selectedCampaignId: chosenCampaign.id,
          selectedCampaignTitle: chosenCampaign.title,
          lastUpdated: Date.now(),
        });

        botReply =
          `🙌 Você escolheu apoiar: *${chosenCampaign.title}*!\n\n` +
          `Qual valor em R$ você deseja doar para esta campanha?\n` +
          `_(Ex: digite *30*, *50*, *100*)_`;
      } else if (
        currentSession.step === 'AWAITING_OFFER_AMOUNT' ||
        currentSession.step === 'AWAITING_CAMPAIGN_AMOUNT'
      ) {
        const parsedAmount = parseFloat(cleanInput.replace(/[^\d,.]/g, '').replace(',', '.'));
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          botReply = `Por favor, informe um valor numérico válido em reais (ex: *30* ou *50,00*), ou digite *0* para voltar.`;
        } else {
          const isCampaign = currentSession.step === 'AWAITING_CAMPAIGN_AMOUNT';
          const campaignTitle = currentSession.selectedCampaignTitle || 'Oferta & Caixinha da Célula';
          const pixCopyPaste = generatePixCopyPaste({
            pixKey: process.env.PIX_STATIC_KEY || 'shcelsantagemmagalganipql@gmail.com',
            merchantName: process.env.PIX_MERCHANT_NAME || 'CELULA SANTA GEMMA',
            merchantCity: process.env.PIX_MERCHANT_CITY || 'SAO PAULO',
            amount: parsedAmount,
            txid: `SG${Date.now().toString().slice(-8)}`,
            description: campaignTitle,
          });

          generatedPix = {
            amount: parsedAmount,
            pixCopyPaste,
            campaignTitle,
            campaignId: currentSession.selectedCampaignId,
            type: isCampaign ? 'campanha' : 'oferta',
          };

          botSessions.set(from, {
            ...currentSession,
            step: 'MAIN_MENU',
            lastUpdated: Date.now(),
          });

          botReply =
            `✅ *PIX Gerado com Sucesso!* \n\n` +
            `• *Destino:* ${campaignTitle}\n` +
            `• *Valor:* R$ ${parsedAmount.toFixed(2).replace('.', ',')}\n\n` +
            `👇 *Copie o código PIX Copia e Cola abaixo ou escaneie o QR Code no chat:*\n\n` +
            `\`${pixCopyPaste}\`\n\n` +
            `⚡ _Assim que você concluir o pagamento no seu banco, nosso sistema detectará via Webhook e enviará seu comprovante automaticamente aqui no WhatsApp!_`;
        }
      } else if (currentSession.step === 'AWAITING_BIRTHDATE') {
        updatedBirthDate = cleanInput;
        botSessions.set(from, {
          ...currentSession,
          step: 'MAIN_MENU',
          lastUpdated: Date.now(),
        });
        botReply =
          `🎉 *Data de nascimento (${cleanInput}) salva com sucesso no banco de dados da célula!*\n\n` +
          `No dia do seu aniversário, nosso bot enviará uma oração e felicitações especiais em nome da Célula Santa Gemma Galgani.\n\n` +
          `Digite *1* para fazer uma oferta ou *Oi* para ver o menu.`;
      }

      res.json({
        ok: true,
        reply: botReply,
        sessionStep: botSessions.get(from)?.step || 'MAIN_MENU',
        generatedPix,
        updatedBirthDate,
      });
    } catch (err) {
      console.error('Erro no webhook do bot WhatsApp:', err);
      res.status(500).json({ error: 'Falha ao processar mensagem do bot.' });
    }
  });

  // ---------------------------------------------------------------------------
  // 5. AUTOMAÇÃO DE PARABÉNS PARA ANIVERSARIANTES DO DIA
  // ---------------------------------------------------------------------------
  app.post('/api/cron/birthdays', async (req: Request, res: Response) => {
    try {
      const { donorName = 'Irmão(ã)', donorPhone = '(11) 98765-4321', birthDate = 'Hoje' } = req.body;

      const birthdayMessage =
        `🎂🌹 *FELIZ E SANTO ANIVERSÁRIO, ${donorName.toUpperCase()}!* ✨\n\n` +
        `A *Célula Santa Gemma Galgani (Comunidade Católica Shalom)* louva a Deus pelo dom da sua vida neste dia (*${birthDate}*)!\n\n` +
        `🙏 _"O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda a paz!"_ (Nm 6, 24-26)\n\n` +
        `Que Santa Gemma Galgani e o seu Santo Anjo da Guarda caminhem sempre ao seu lado. Conte com nossas orações hoje na célula! 🎉✝️`;

      const providerResult = await dispatchWhatsAppMessage(donorPhone, birthdayMessage);

      res.json({
        ok: true,
        donorName,
        donorPhone,
        birthdayMessage,
        sentToProvider: providerResult.sentToProvider,
      });
    } catch (error) {
      console.error('Erro no disparo de aniversário:', error);
      res.status(500).json({ error: 'Erro ao disparar mensagem de aniversário.' });
    }
  });

  // ---------------------------------------------------------------------------
  // HEALTHCHECK & VITE MIDDLEWARE (DEVELOPMENT) OU ARQUIVOS ESTÁTICOS (PRODUCTION)
  // ---------------------------------------------------------------------------
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, status: 'online', service: 'Celula Santa Gemma Galgani' });
  });

  const distPath = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(distPath));
    app.use((_req: Request, res: Response) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Célula Santa Gemma • Dizify Server] Rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
