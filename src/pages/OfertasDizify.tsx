import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  QrCode,
  Copy,
  Check,
  Sparkles,
  HeartHandshake,
  Users,
  TrendingUp,
  Send,
  Cake,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Webhook,
  ShieldCheck,
  RefreshCw,
  DollarSign,
  Target,
  Phone,
  Calendar,
  ExternalLink,
  Zap,
  Award,
  AlertCircle,
} from 'lucide-react';
import {
  DonorProfile,
  DonationCampaign,
  DonationRecord,
  WhatsAppBotChatMessage,
  UserRole,
  CampaignCategory,
  PaymentGatewayType,
} from '../types';
import { generatePixCopyPaste, generateQrMatrixFromString } from '../utils/pixGenerator';

interface OfertasDizifyProps {
  donors: DonorProfile[];
  campaigns: DonationCampaign[];
  donations: DonationRecord[];
  currentRole: UserRole;
  userName: string;
  onUpsertDonor: (donor: Omit<DonorProfile, 'id' | 'totalDonated' | 'donationsCount' | 'createdAt'> & { id?: string }) => DonorProfile;
  onDeleteDonor: (donorId: string) => void;
  onAddCampaign: (campaign: Omit<DonationCampaign, 'id' | 'currentAmount'>) => DonationCampaign;
  onDeleteCampaign: (campaignId: string) => void;
  onCreatePixDonation: (params: {
    donorName: string;
    donorPhone: string;
    donorBirthDate?: string;
    amount: number;
    type: 'oferta' | 'comunhao_bens' | 'campanha';
    campaignId?: string;
    campaignTitle?: string;
    gateway?: PaymentGatewayType;
    pixCopyPaste?: string;
    externalReference?: string;
  }) => DonationRecord;
  onConfirmWebhook: (donationId: string) => DonationRecord | null;
  onBack: () => void;
  initialTab?: ActiveSubTab;
}

type ActiveSubTab = 'whatsapp-bot' | 'pix-direto' | 'campanhas' | 'membros-db' | 'webhooks';

const BOT_STORAGE_KEY = 'csg_dizify_whatsapp_chat_v3';
const OFFICIAL_PIX_EMAIL = 'shcelsantagemmagalganipql@gmail.com';

const PixQrCodeSvg: React.FC<{ payload: string; size?: number }> = ({ payload, size = 156 }) => {
  const matrix = generateQrMatrixFromString(payload, 25);
  const gridCount = matrix.length;

  return (
    <div
      className="inline-flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border-2 border-[#7B1113]/20 shadow-sm"
      style={{ width: size + 20, height: size + 20 }}
    >
      <svg
        viewBox={`0 0 ${gridCount} ${gridCount}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        aria-label="QR Code PIX Dinâmico"
      >
        <rect width={gridCount} height={gridCount} fill="#FFFFFF" />
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            cell ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx}
                y={rIdx}
                width={1}
                height={1}
                fill="#1E1816"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};

export const OfertasDizify: React.FC<OfertasDizifyProps> = ({
  donors,
  campaigns,
  donations,
  currentRole,
  userName,
  onUpsertDonor,
  onDeleteDonor,
  onAddCampaign,
  onDeleteCampaign,
  onCreatePixDonation,
  onConfirmWebhook,
  onBack,
  initialTab = 'whatsapp-bot',
}) => {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>(initialTab);
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const [selectedDonorPhone, setSelectedDonorPhone] = useState<string>(
    donors[0]?.phone || '(85) 98225-0655'
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>('mercadopago');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [webhookToast, setWebhookToast] = useState<string | null>(null);
  const [isSendingBot, setIsSendingBot] = useState(false);

  // Estado do Chat do Bot de WhatsApp
  const activeDonor =
    donors.find(d => d.phone === selectedDonorPhone) ||
    donors[0] || {
      id: 'donor_default',
      name: userName || 'Membro da Célula',
      phone: '(11) 98765-4321',
      birthDate: '14/10/1998',
      totalDonated: 0,
      donationsCount: 0,
      createdAt: 'Hoje',
    };

  const [botMessages, setBotMessages] = useState<WhatsAppBotChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(BOT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome_bot_1',
        sender: 'bot',
        timestamp: 'Agora',
        text:
          `🌹 *Shalom! Bem-vindo(a) ao Bot de Ofertas da Célula Santa Gemma Galgani (Dizify)* ✝️\n\n` +
          `Envie um *"Oi"* ou clique em uma das opções rápidas abaixo para:\n` +
          `*1️⃣ Fazer uma Oferta / Caixinha da Célula (PIX)*\n` +
          `*2️⃣ Ajudar em uma Campanha da Célula*\n` +
          `*3️⃣ Ver seu Histórico de Doações*\n` +
          `*4️⃣ Atualizar Data de Nascimento (Parabéns Automático)* 🎂`,
      },
    ];
  });

  const [botInput, setBotInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Estado para Gerador PIX Direto
  const [directAmount, setDirectAmount] = useState<string>('50');
  const [directType, setDirectType] = useState<'oferta' | 'comunhao_bens' | 'campanha'>('oferta');
  const [directCampaignId, setDirectCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [generatedDirectDonation, setGeneratedDirectDonation] = useState<DonationRecord | null>(null);
  const [isGeneratingDirectPix, setIsGeneratingDirectPix] = useState(false);

  // Estado para Nova Campanha
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampGoal, setNewCampGoal] = useState('500');
  const [newCampDeadline, setNewCampDeadline] = useState('30/12/2026');
  const [newCampCategory, setNewCampCategory] = useState<CampaignCategory>('acao_social');

  // Estado para Novo Membro no Banco de Dados
  const [showNewDonorModal, setShowNewDonorModal] = useState(false);
  const [donorFormName, setDonorFormName] = useState('');
  const [donorFormPhone, setDonorFormPhone] = useState('');
  const [donorFormBirth, setDonorFormBirth] = useState('');
  const [donorFormEmail, setDonorFormEmail] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(BOT_STORAGE_KEY, JSON.stringify(botMessages));
    } catch {
      // ignore
    }
  }, [botMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages]);

  const showNotice = (msg: string) => {
    setWebhookToast(msg);
    setTimeout(() => {
      setWebhookToast(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Estatísticas Financeiras da Célula
  const totalArrecadadoPago = donations
    .filter(d => d.status === 'paid')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalPendente = donations
    .filter(d => d.status === 'pending')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const paidDonationsCount = donations.filter(d => d.status === 'paid').length;

  // Envia mensagem para o backend real (/api/whatsapp/webhook) com fallback local instantâneo
  const sendMessageToWhatsAppBot = async (customText?: string) => {
    const textToSend = (customText ?? botInput).trim();
    if (!textToSend || isSendingBot) return;

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: WhatsAppBotChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'member',
      text: textToSend,
      timestamp: nowTime,
    };

    setBotMessages(prev => [...prev, userMsg]);
    if (!customText) setBotInput('');
    setIsSendingBot(true);

    try {
      const donorDonations = donations.filter(
        d =>
          d.donorId === activeDonor.id ||
          d.donorPhone.replace(/\D/g, '') === activeDonor.phone.replace(/\D/g, '')
      );

      const resp = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: activeDonor.phone,
          name: activeDonor.name,
          text: textToSend,
          campaigns: campaigns.filter(c => c.active),
          donorHistory: donorDonations,
        }),
      });

      if (!resp.ok) throw new Error('Falha no endpoint do bot');

      const data = await resp.json();
      let pixDataForChat: WhatsAppBotChatMessage['pixData'] | undefined;

      // Se o bot gerou uma cobrança PIX dinâmica, registramos no banco de dados da célula
      if (data.generatedPix) {
        const createdRecord = onCreatePixDonation({
          donorName: activeDonor.name,
          donorPhone: activeDonor.phone,
          donorBirthDate: activeDonor.birthDate,
          amount: Number(data.generatedPix.amount),
          type: data.generatedPix.type || 'oferta',
          campaignId: data.generatedPix.campaignId,
          campaignTitle: data.generatedPix.campaignTitle,
          gateway: selectedGateway,
          pixCopyPaste: data.generatedPix.pixCopyPaste,
        });

        pixDataForChat = {
          donationId: createdRecord.id,
          amount: createdRecord.amount,
          pixCopyPaste: createdRecord.pixCopyPaste,
          campaignTitle: createdRecord.campaignTitle || 'Oferta Célula Santa Gemma',
          status: 'pending',
        };
      }

      // Se o membro atualizou a data de nascimento pelo WhatsApp
      if (data.updatedBirthDate) {
        onUpsertDonor({
          id: activeDonor.id,
          name: activeDonor.name,
          phone: activeDonor.phone,
          birthDate: data.updatedBirthDate,
          email: activeDonor.email,
        });
      }

      const botReplyMsg: WhatsAppBotChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        pixData: pixDataForChat,
      };

      setBotMessages(prev => [...prev, botReplyMsg]);
    } catch {
      // Fallback local caso offline
      const fallbackAmount = parseFloat(textToSend.replace(',', '.'));
      if (!isNaN(fallbackAmount) && fallbackAmount > 0 && fallbackAmount > 4) {
        const createdRecord = onCreatePixDonation({
          donorName: activeDonor.name,
          donorPhone: activeDonor.phone,
          donorBirthDate: activeDonor.birthDate,
          amount: fallbackAmount,
          type: 'oferta',
          campaignTitle: 'Oferta & Caixinha da Célula',
          gateway: selectedGateway,
        });

        setBotMessages(prev => [
          ...prev,
          {
            id: `bot_fb_${Date.now()}`,
            sender: 'bot',
            timestamp: nowTime,
            text:
              `✅ *PIX Dinâmico Gerado com Sucesso!*\n\n` +
              `• *Valor:* R$ ${fallbackAmount.toFixed(2).replace('.', ',')}\n` +
              `• *Gateway:* ${selectedGateway.toUpperCase()}\n\n` +
              `Copie o código PIX Copia e Cola abaixo ou escaneie o QR Code no chat:`,
            pixData: {
              donationId: createdRecord.id,
              amount: createdRecord.amount,
              pixCopyPaste: createdRecord.pixCopyPaste,
              campaignTitle: createdRecord.campaignTitle || 'Oferta da Célula',
              status: 'pending',
            },
          },
        ]);
      } else {
        setBotMessages(prev => [
          ...prev,
          {
            id: `bot_fb_${Date.now()}`,
            sender: 'bot',
            timestamp: nowTime,
            text:
              `🌹 *Shalom, ${activeDonor.name}!*\n\n` +
              `Escolha uma opção digitando o número:\n` +
              `*1* - Fazer uma Oferta (PIX)\n` +
              `*2* - Ajudar em uma Campanha\n` +
              `*3* - Ver meu Histórico\n` +
              `*4* - Atualizar Data de Nascimento`,
          },
        ]);
      }
    } finally {
      setIsSendingBot(false);
    }
  };

  // Aciona o Webhook de Confirmação Automática de Pagamento PIX (/api/webhooks/payment)
  const triggerPaymentWebhook = async (donationId: string) => {
    const confirmed = onConfirmWebhook(donationId);
    if (!confirmed) return;

    // Atualiza o card do PIX dentro do chat do WhatsApp para "paid"
    setBotMessages(prev =>
      prev.map(m =>
        m.pixData && m.pixData.donationId === donationId
          ? { ...m, pixData: { ...m.pixData, status: 'paid' } }
          : m
      )
    );

    if (generatedDirectDonation?.id === donationId) {
      setGeneratedDirectDonation({ ...confirmed, status: 'paid' });
    }

    try {
      const resp = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: confirmed.id,
          donorName: confirmed.donorName,
          donorPhone: confirmed.donorPhone,
          amount: confirmed.amount,
          campaignTitle: confirmed.campaignTitle,
          gateway: confirmed.gateway,
        }),
      });

      const data = await resp.json();
      const thankYouText =
        data.thankYouMessage ||
        `✨ *SHALOM! OFERTA CONFIRMADA!* ✨\n\n` +
          `Olá, *${confirmed.donorName}*! Recebemos a confirmação automática do seu PIX de *R$ ${confirmed.amount
            .toFixed(2)
            .replace('.', ',')}* para *${confirmed.campaignTitle}*.\n\n` +
          `Que por intercessão de *Santa Gemma Galgani* Deus abençoe abundantemente sua generosidade! 🌹✝️`;

      // Injeta a mensagem automática de agradecimento diretamente na conversa do WhatsApp
      setBotMessages(prev => [
        ...prev,
        {
          id: `webhook_ty_${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          text: thankYouText,
        },
      ]);

      showNotice(`Webhook recebido! PIX de R$ ${confirmed.amount.toFixed(2)} confirmado e agradecimento enviado no WhatsApp de ${confirmed.donorName}.`);
    } catch {
      setBotMessages(prev => [
        ...prev,
        {
          id: `webhook_ty_${Date.now()}`,
          sender: 'bot',
          timestamp: 'Agora',
          text:
            `✨ *SHALOM! OFERTA CONFIRMADA VIA WEBHOOK!* ✨\n\n` +
            `Muito obrigado, *${confirmed.donorName}*! Seu PIX de *R$ ${confirmed.amount
              .toFixed(2)
              .replace('.', ',')}* (${confirmed.campaignTitle}) foi compensado com sucesso. Deus lhe pague! 🌹🙏`,
        },
      ]);
      showNotice(`PIX confirmado! Mensagem de agradecimento enviada no WhatsApp.`);
    }
  };

  // Geração de PIX na aba "PIX & QR Code"
  const handleGenerateDirectPix = async () => {
    const val = parseFloat(directAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    setIsGeneratingDirectPix(true);
    try {
      const chosenCampaign =
        directType === 'campanha'
          ? campaigns.find(c => c.id === directCampaignId) || campaigns[0]
          : undefined;

      const title =
        directType === 'campanha' && chosenCampaign
          ? chosenCampaign.title
          : directType === 'comunhao_bens'
          ? 'Caixinha da Célula'
          : 'Oferta Célula Santa Gemma';

      let pixCode = '';
      let extRef = '';

      try {
        const resp = await fetch('/api/pix/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: val,
            description: title,
            donorName: activeDonor.name,
            donorPhone: activeDonor.phone,
            campaignId: chosenCampaign?.id,
            gateway: selectedGateway,
            pixKey: chosenCampaign?.pixKey || OFFICIAL_PIX_EMAIL,
          }),
        });
        if (resp.ok) {
          const apiData = await resp.json();
          pixCode = apiData.pixCopyPaste;
          extRef = apiData.externalReference;
        }
      } catch {
        // Usa o gerador EMVCo local
      }

      if (!pixCode) {
        pixCode = generatePixCopyPaste({
          pixKey: chosenCampaign?.pixKey || OFFICIAL_PIX_EMAIL,
          merchantName: 'CELULA SANTA GEMMA',
          merchantCity: 'SAO PAULO',
          amount: val,
          description: title,
        });
      }

      const record = onCreatePixDonation({
        donorName: activeDonor.name,
        donorPhone: activeDonor.phone,
        donorBirthDate: activeDonor.birthDate,
        amount: val,
        type: directType,
        campaignId: chosenCampaign?.id,
        campaignTitle: title,
        gateway: selectedGateway,
        pixCopyPaste: pixCode,
        externalReference: extRef,
      });

      setGeneratedDirectDonation(record);
      showNotice(`Cobrança PIX de R$ ${val.toFixed(2)} gerada para ${activeDonor.name}!`);
    } finally {
      setIsGeneratingDirectPix(false);
    }
  };

  // Disparo de Parabéns Automático no WhatsApp para Aniversariante
  const handleSendBirthdayAutomation = async (donor: DonorProfile) => {
    try {
      const resp = await fetch('/api/cron/birthdays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: donor.name,
          donorPhone: donor.phone,
          birthDate: donor.birthDate,
        }),
      });
      const data = await resp.json();
      if (data.birthdayMessage) {
        setSelectedDonorPhone(donor.phone);
        setBotMessages(prev => [
          ...prev,
          {
            id: `bday_${Date.now()}`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            text: data.birthdayMessage,
          },
        ]);
        setActiveTab('whatsapp-bot');
        showNotice(`Automação de aniversário enviada no WhatsApp de ${donor.name}!`);
      }
    } catch {
      showNotice(`Parabéns enviado para ${donor.name}!`);
    }
  };

  const handleSaveNewCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) return;
    onAddCampaign({
      title: newCampTitle.trim(),
      description: newCampDesc.trim() || 'Campanha oficial da Célula Santa Gemma Galgani.',
      goalAmount: Number(newCampGoal) || 500,
      pixKey: OFFICIAL_PIX_EMAIL,
      deadline: newCampDeadline || '30/12/2026',
      category: newCampCategory,
      active: true,
    });
    setNewCampTitle('');
    setNewCampDesc('');
    setShowNewCampaignModal(false);
    showNotice('Nova campanha criada e disponibilizada no menu do Bot de WhatsApp!');
  };

  const handleSaveNewDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorFormName.trim() || !donorFormPhone.trim()) return;
    const saved = onUpsertDonor({
      name: donorFormName.trim(),
      phone: donorFormPhone.trim(),
      birthDate: donorFormBirth.trim() || '14/10/1998',
      email: donorFormEmail.trim(),
    });
    setSelectedDonorPhone(saved.phone);
    setDonorFormName('');
    setDonorFormPhone('');
    setDonorFormBirth('');
    setDonorFormEmail('');
    setShowNewDonorModal(false);
    showNotice(`Membro ${saved.name} salvo no banco de dados com sucesso!`);
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Toast de Confirmação de Webhook / Ações */}
      {webhookToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <p className="text-xs font-medium leading-snug flex-1">{webhookToast}</p>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:text-[#580C14] active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span>Dizify PIX + Webhook Ativo</span>
        </div>
      </div>

      {/* Hero Header Inspirado no Dizify */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2B090C] via-[#580C14] to-[#7B1113] text-white p-4 shadow-md border border-[#E5C158]/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#E5C158] font-bold">
              <Sparkles className="w-3 h-3" /> Caixinha da Célula & Arrecadação
            </span>
            <h2 className="text-lg font-bold font-cinzel text-[#FAF8F5] mt-0.5">
              Célula Santa Gemma • Dizify
            </h2>
            <p className="text-xs text-[#F3E7C4]/90 mt-1 leading-relaxed">
              Bot de WhatsApp interativo, geração de PIX Copia e Cola + QR Code dinâmico, Webhook automático e banco de membros.
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-[#E5C158]/40 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6 text-[#E5C158]" />
          </div>
        </div>

        {/* KPIs Financeiros */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15">
          <div className="bg-black/25 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-[#F3E7C4]/75 block">Total Confirmado</span>
            <span className="text-sm font-bold text-emerald-300">
              R$ {totalArrecadadoPago.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[9px] text-white/60 block mt-0.5">
              {paidDonationsCount} ofertas pagas
            </span>
          </div>
          <div className="bg-black/25 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-[#F3E7C4]/75 block">Aguardando PIX</span>
            <span className="text-sm font-bold text-[#E5C158]">
              R$ {totalPendente.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[9px] text-white/60 block mt-0.5">
              Webhook escutando
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('membros-db')}
            className="bg-black/25 hover:bg-black/40 rounded-xl p-2.5 border border-[#E5C158]/40 text-left transition cursor-pointer"
          >
            <span className="text-[10px] text-[#E5C158] font-bold block">Membros no BD →</span>
            <span className="text-sm font-bold text-white">{donors.length} irmãos</span>
            <span className="text-[9px] text-[#FFF0BE] block mt-0.5 underline">
              Toque para ver lista
            </span>
          </button>
        </div>

        {/* Chave PIX Oficial Principal (E-mail) */}
        <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2 bg-black/25 rounded-xl px-3 py-2">
          <div className="min-w-0">
            <span className="text-[9px] uppercase tracking-wider text-[#E5C158] font-bold block">
              Chave PIX Principal (Caixinha da Célula & Doações):
            </span>
            <span className="text-xs font-mono font-bold text-white truncate block select-all">
              {OFFICIAL_PIX_EMAIL}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyText(OFFICIAL_PIX_EMAIL, 'official_pix_email')}
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#E5C158] hover:bg-[#f0cf65] text-[#2B090C] text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
          >
            {copiedId === 'official_pix_email' ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copiar Chave</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seletor de Membro Ativo e Gateway */}
      <div className="bg-white/95 rounded-2xl p-3 border border-[#ECE7DF] shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <label htmlFor="donor-select" className="text-[10px] font-bold text-[#70645E] uppercase block">
              Simulando WhatsApp do Membro:
            </label>
            <select
              id="donor-select"
              value={selectedDonorPhone}
              onChange={e => setSelectedDonorPhone(e.target.value)}
              className="w-full text-xs font-bold text-[#241E1C] bg-transparent focus:outline-none cursor-pointer"
            >
              {donors.map(d => (
                <option key={d.id} value={d.phone}>
                  {d.name} ({d.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-[#70645E]">Gateway:</span>
          <select
            aria-label="Selecionar Gateway de Pagamento"
            value={selectedGateway}
            onChange={e => setSelectedGateway(e.target.value as PaymentGatewayType)}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#F5F2EC] text-[#7B1113] border border-[#E2DCD3] cursor-pointer"
          >
            <option value="mercadopago">Mercado Pago PIX</option>
            <option value="asaas">Asaas PIX</option>
            <option value="pix_direto">BACEN EMVCo Direto</option>
          </select>
        </div>
      </div>

      {/* Sub-navegação de Módulos */}
      <div className="grid grid-cols-5 gap-1 bg-[#EFECE6] p-1 rounded-2xl border border-[#E2DCD3]">
        {[
          { id: 'whatsapp-bot', label: 'Bot Zap', icon: MessageCircle },
          { id: 'pix-direto', label: 'Gerar PIX', icon: QrCode },
          { id: 'campanhas', label: 'Campanhas', icon: Target },
          { id: 'membros-db', label: `Membros (${donors.length})`, icon: Users },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook },
        ].map(tab => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveSubTab)}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                isAct
                  ? 'bg-[#7B1113] text-white font-bold shadow-xs'
                  : 'text-[#6E625C] hover:text-[#241E1C]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] leading-none tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          ABA 1: BOT DE WHATSAPP INTERATIVO (DIZIFY FLOW)
      ===================================================================== */}
      {activeTab === 'whatsapp-bot' && (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-[#D9D2C9] shadow-md bg-[#EFEAE2]">
            {/* Cabeçalho estilo WhatsApp Oficial */}
            <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#128C7E] border border-white/30 flex items-center justify-center font-cinzel font-bold text-sm text-[#E5C158]">
                  SG
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold leading-tight">
                      Bot Célula Santa Gemma (Dizify)
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <p className="text-[10px] text-emerald-100">
                    Online • Conversando com {activeDonor.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(BOT_STORAGE_KEY);
                  setBotMessages([
                    {
                      id: `reset_${Date.now()}`,
                      sender: 'bot',
                      timestamp: 'Agora',
                      text:
                        `🌹 *Shalom, ${activeDonor.name}!*\n` +
                        `Envie *"Oi"* ou toque nos atalhos abaixo para iniciar uma oferta via PIX, apoiar uma campanha ou consultar seu histórico.`,
                    },
                  ]);
                }}
                title="Reiniciar conversa do Bot"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Área de Mensagens do WhatsApp */}
            <div className="p-3 space-y-2.5 max-h-[420px] overflow-y-auto">
              {botMessages.map(msg => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs ${
                        isBot
                          ? 'bg-white text-[#241E1C] rounded-tl-none border border-[#E5DFD6]'
                          : 'bg-[#DCF8C6] text-[#1C2716] rounded-tr-none border border-[#C5E8AC]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed break-words">
                        {msg.text}
                      </div>

                      {/* Card Interativo do PIX Gerado no Chat */}
                      {msg.pixData && (
                        <div className="mt-3 pt-3 border-t border-[#ECE7DF] flex flex-col items-center bg-[#FAF8F5] rounded-xl p-3">
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113]">
                              {msg.pixData.campaignTitle}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                msg.pixData.status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {msg.pixData.status === 'paid' ? '✅ PIX Pago' : '⏳ Aguardando'}
                            </span>
                          </div>

                          <PixQrCodeSvg payload={msg.pixData.pixCopyPaste} size={136} />

                          <p className="text-sm font-extrabold text-[#241E1C] mt-2">
                            R$ {msg.pixData.amount.toFixed(2).replace('.', ',')}
                          </p>

                          <div className="w-full mt-2 space-y-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(msg.pixData!.pixCopyPaste, msg.pixData!.donationId)
                              }
                              className="w-full py-2 px-3 rounded-xl bg-[#075E54] hover:bg-[#064E46] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              {copiedId === msg.pixData.donationId ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Código PIX Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar PIX Copia e Cola</span>
                                </>
                              )}
                            </button>

                            {msg.pixData.status !== 'paid' && (
                              <button
                                type="button"
                                onClick={() => triggerPaymentWebhook(msg.pixData!.donationId)}
                                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Simular Pagamento no Banco (Disparar Webhook)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-[9px] text-[#8A7E78] text-right mt-1">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Botões de Resposta Rápida do Menu Interativo */}
            <div className="px-3 py-2 bg-[#E6E0D6] border-t border-[#D8D0C5] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { label: '👋 Mandar "Oi"', value: 'Oi' },
                { label: '1️⃣ Ofertar', value: '1' },
                { label: '2️⃣ Campanhas', value: '2' },
                { label: '3️⃣ Histórico', value: '3' },
                { label: '4️⃣ Aniversário', value: '4' },
                { label: '💸 R$ 35,00', value: '35' },
                { label: '💸 R$ 50,00', value: '50' },
                { label: '💸 R$ 100,00', value: '100' },
              ].map(quick => (
                <button
                  key={quick.label}
                  type="button"
                  onClick={() => sendMessageToWhatsAppBot(quick.value)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF8F5] text-[#075E54] border border-[#075E54]/30 text-[11px] font-bold shadow-2xs active:scale-95 transition cursor-pointer"
                >
                  {quick.label}
                </button>
              ))}
            </div>

            {/* Input de Mensagem do WhatsApp */}
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessageToWhatsAppBot();
              }}
              className="p-2.5 bg-[#F0F0F0] flex items-center gap-2"
            >
              <input
                type="text"
                value={botInput}
                onChange={e => setBotInput(e.target.value)}
                placeholder="Digite 'Oi', uma opção (1 a 4) ou o valor em R$..."
                className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-[#241E1C] border border-[#D9D2C9] focus:outline-none focus:border-[#075E54]"
              />
              <button
                type="submit"
                disabled={isSendingBot}
                aria-label="Enviar mensagem no Bot"
                className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#064E46] text-white flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 2: GERAÇÃO DE PAGAMENTO PIX COPIA E COLA + QR CODE DINÂMICO
      ===================================================================== */}
      {activeTab === 'pix-direto' && (
        <div className="space-y-4">
          <div className="bg-white/95 rounded-2xl p-4 border border-[#ECE7DF] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#241E1C]">
                  Gerador de PIX Dinâmico (EMVCo + Gateway)
                </h3>
                <p className="text-[11px] text-[#70645E]">
                  Gera código PIX Copia e Cola oficial com CRC16 e QR Code imediato
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-[#7B1113]" />
            </div>

            {/* Modalidade da Doação */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'oferta', label: 'Oferta da Célula' },
                { id: 'comunhao_bens', label: 'Caixinha da Célula' },
                { id: 'campanha', label: 'Campanha Específica' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDirectType(t.id as 'oferta' | 'comunhao_bens' | 'campanha')}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    directType === t.id
                      ? 'bg-[#7B1113] text-white border-[#7B1113]'
                      : 'bg-[#FAF8F5] text-[#5C504A] border-[#E5DFD6]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {directType === 'campanha' && (
              <div>
                <label className="text-[11px] font-bold text-[#5C504A] block mb-1">
                  Selecione a Campanha da Célula:
                </label>
                <select
                  value={directCampaignId}
                  onChange={e => setDirectCampaignId(e.target.value)}
                  className="w-full rounded-xl border border-[#DFD8CE] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#241E1C]"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (Meta: R$ {c.goalAmount})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Valores Rápidos + Input */}
            <div>
              <label className="text-[11px] font-bold text-[#5C504A] block mb-1.5">
                Valor da Oferta / Doação (R$):
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['20', '35', '50', '100'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDirectAmount(preset)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      directAmount === preset
                        ? 'bg-amber-100 text-[#7B1113] border-[#7B1113]'
                        : 'bg-[#FAF8F5] text-[#5C504A] border-[#E5DFD6]'
                    }`}
                  >
                    R$ {preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                step="0.50"
                value={directAmount}
                onChange={e => setDirectAmount(e.target.value)}
                className="w-full rounded-xl border border-[#DFD8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold text-[#241E1C]"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateDirectPix}
              disabled={isGeneratingDirectPix}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7B1113] to-[#9B1B20] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-98 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>
                {isGeneratingDirectPix
                  ? 'Gerando Cobrança PIX...'
                  : `Gerar PIX Dinâmico para ${activeDonor.name}`}
              </span>
            </button>
          </div>

          {/* Resultado do PIX Gerado */}
          {generatedDirectDonation && (
            <div className="bg-white rounded-2xl p-4 border-2 border-[#7B1113]/30 shadow-md flex flex-col items-center text-center space-y-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113]">
                  {generatedDirectDonation.campaignTitle}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    generatedDirectDonation.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {generatedDirectDonation.status === 'paid'
                    ? '✅ Pago & Confirmado'
                    : '⏳ Aguardando Pagamento'}
                </span>
              </div>

              <PixQrCodeSvg payload={generatedDirectDonation.pixCopyPaste} size={168} />

              <div>
                <p className="text-lg font-extrabold text-[#241E1C]">
                  R$ {generatedDirectDonation.amount.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-[11px] text-[#70645E]">
                  Contribuinte: <strong>{generatedDirectDonation.donorName}</strong> ({generatedDirectDonation.donorPhone})
                </p>
              </div>

              <div className="w-full bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E5DFD6] text-left">
                <p className="text-[10px] font-bold text-[#70645E] uppercase mb-1">
                  Código PIX Copia e Cola (Padrão BACEN EMVCo):
                </p>
                <p className="text-[10px] font-mono text-[#241E1C] break-all select-all">
                  {generatedDirectDonation.pixCopyPaste}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      generatedDirectDonation.pixCopyPaste,
                      generatedDirectDonation.id
                    )
                  }
                  className="py-2.5 px-3 rounded-xl bg-[#241E1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === generatedDirectDonation.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar PIX Copia e Cola</span>
                    </>
                  )}
                </button>

                {generatedDirectDonation.status !== 'paid' && (
                  <button
                    type="button"
                    onClick={() => triggerPaymentWebhook(generatedDirectDonation.id)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Confirmar Webhook PIX</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          ABA 3: CAMPANHAS ESPECÍFICAS DA CÉLULA
      ===================================================================== */}
      {activeTab === 'campanhas' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#241E1C]">
                Campanhas da Célula Santa Gemma
              </h3>
              <p className="text-[11px] text-[#70645E]">
                 Integradas automaticamente à opção 2 do Bot de WhatsApp
              </p>
            </div>
            {(currentRole === 'admin' || currentRole === 'formador') && (
              <button
                type="button"
                onClick={() => setShowNewCampaignModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Campanha</span>
              </button>
            )}
          </div>

          {showNewCampaignModal && (
            <form
              onSubmit={handleSaveNewCampaign}
              className="bg-white rounded-2xl p-4 border-2 border-[#7B1113]/30 shadow-md space-y-3"
            >
              <h4 className="text-xs font-bold uppercase text-[#7B1113]">
                Cadastrar Campanha de Arrecadação
              </h4>
              <input
                type="text"
                required
                placeholder="Título da campanha (ex: Retiro Renascer)"
                value={newCampTitle}
                onChange={e => setNewCampTitle(e.target.value)}
                className="w-full rounded-xl border border-[#DFD8CE] px-3 py-2 text-xs"
              />
              <textarea
                placeholder="Descrição da finalidade da campanha..."
                value={newCampDesc}
                onChange={e => setNewCampDesc(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#DFD8CE] px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#70645E] block mb-1">
                    Meta Financeira (R$):
                  </label>
                  <input
                    type="number"
                    required
                    value={newCampGoal}
                    onChange={e => setNewCampGoal(e.target.value)}
                    className="w-full rounded-xl border border-[#DFD8CE] px-3 py-1.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#70645E] block mb-1">
                    Prazo Limite:
                  </label>
                  <input
                    type="text"
                    value={newCampDeadline}
                    onChange={e => setNewCampDeadline(e.target.value)}
                    className="w-full rounded-xl border border-[#DFD8CE] px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#70645E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold cursor-pointer"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {campaigns.map(camp => {
              const progress = Math.min(
                100,
                Math.round((camp.currentAmount / Math.max(1, camp.goalAmount)) * 100)
              );
              return (
                <div
                  key={camp.id}
                  className="bg-white/95 rounded-2xl p-4 border border-[#ECE7DF] shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-[#7B1113] mb-1">
                        {camp.category.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-[#241E1C]">{camp.title}</h4>
                      <p className="text-xs text-[#70645E] mt-0.5 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>
                    {(currentRole === 'admin' || currentRole === 'formador') && (
                      <button
                        type="button"
                        onClick={() => onDeleteCampaign(camp.id)}
                        aria-label="Remover campanha"
                        className="p-1.5 text-[#8A7C75] hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800">
                        R$ {camp.currentAmount.toFixed(2).replace('.', ',')} arrecadados
                      </span>
                      <span className="text-[#70645E] font-medium">
                        Meta: R$ {camp.goalAmount.toFixed(2).replace('.', ',')} ({progress}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#EFECE6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7B1113] to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9]">
                    <span className="text-[11px] text-[#70645E] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Prazo: {camp.deadline}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDirectType('campanha');
                        setDirectCampaignId(camp.id);
                        setActiveTab('pix-direto');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#7B1113]/10 hover:bg-[#7B1113] text-[#7B1113] hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      Apoiar com PIX
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 4: BANCO DE DADOS DE MEMBROS, ANIVERSÁRIOS E HISTÓRICO
      ===================================================================== */}
      {activeTab === 'membros-db' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#241E1C]">
                Banco de Dados de Membros & Aniversários ({donors.length})
              </h3>
              <p className="text-[11px] text-[#70645E]">
                Nome, Estado Civil, WhatsApp, Data de Nascimento e Histórico
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const sqlValues = donors
                    .map(d => {
                      const cleanName = d.name.replace(/'/g, "''");
                      const marital = d.maritalStatus ? `'${d.maritalStatus.replace(/'/g, "''")}'` : 'NULL';
                      const parts = d.birthDate.split('/');
                      const isoDate =
                        parts.length === 3
                          ? `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
                          : d.birthDate;
                      const cleanPhone = d.phone.replace(/\D/g, '');
                      const roleSql =
                        d.name === 'Cristiane Alves Nunes de Oliveira' ||
                        d.name === 'Francisco José de Oliveira'
                          ? 'Administrador e Formador'
                          : 'Membro';
                      return `  ('${cleanName}', ${marital}, '${isoDate}', '${cleanPhone}', '${roleSql}')`;
                    })
                    .join(',\n');
                  const fullSql = `INSERT INTO clientes (nome, estado_civil, data_nascimento, telefone, cargo) VALUES\n${sqlValues};`;
                  handleCopyText(fullSql, 'sql_insert_clientes');
                  showNotice('✅ Comando SQL INSERT INTO copiado para a área de transferência!');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                {copiedId === 'sql_insert_clientes' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>SQL Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar SQL (INSERT INTO)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowNewDonorModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Membro</span>
              </button>
            </div>
          </div>

          {showNewDonorModal && (
            <form
              onSubmit={handleSaveNewDonor}
              className="bg-white rounded-2xl p-4 border-2 border-[#7B1113]/30 shadow-md space-y-3"
            >
              <h4 className="text-xs font-bold uppercase text-[#7B1113]">
                Novo Membro no Banco de Dados (Dizify)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nome completo do membro"
                  value={donorFormName}
                  onChange={e => setDonorFormName(e.target.value)}
                  className="w-full rounded-xl border border-[#DFD8CE] px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="WhatsApp ex: (11) 98765-4321"
                  value={donorFormPhone}
                  onChange={e => setDonorFormPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#DFD8CE] px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Data de Nascimento (DD/MM/AAAA)"
                  value={donorFormBirth}
                  onChange={e => setDonorFormBirth(e.target.value)}
                  className="w-full rounded-xl border border-[#DFD8CE] px-3 py-2 text-xs"
                />
                <input
                  type="email"
                  placeholder="E-mail (opcional)"
                  value={donorFormEmail}
                  onChange={e => setDonorFormEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#DFD8CE] px-3 py-2 text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewDonorModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#70645E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold cursor-pointer"
                >
                  Salvar no Banco
                </button>
              </div>
            </form>
          )}

          {/* Barra de Busca Instantânea entre os 48 Membros */}
          <div className="bg-white rounded-2xl p-3 border border-[#DFD8CE] shadow-2xs space-y-2">
            <label htmlFor="search-member-input" className="text-[11px] font-bold text-[#7B1113] block">
              🔍 Pesquisar entre os {donors.length} nomes salvos no banco (Nome, Telefone ou Aniversário):
            </label>
            <input
              id="search-member-input"
              type="text"
              placeholder="Digite um nome (ex: Cristiane, Francisco, Messias, Maria...)"
              value={memberSearchQuery}
              onChange={e => setMemberSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#241E1C] focus:outline-[#7B1113]"
            />
          </div>

          <div className="space-y-2.5">
            {donors
              .filter(donor => {
                if (!memberSearchQuery.trim()) return true;
                const q = memberSearchQuery.toLowerCase();
                return (
                  donor.name.toLowerCase().includes(q) ||
                  donor.phone.toLowerCase().includes(q) ||
                  donor.birthDate.toLowerCase().includes(q) ||
                  (donor.leadershipBadge && donor.leadershipBadge.toLowerCase().includes(q))
                );
              })
              .map(donor => {
              const memberDonations = donations.filter(
                d =>
                  d.donorId === donor.id ||
                  d.donorPhone.replace(/\D/g, '') === donor.phone.replace(/\D/g, '')
              );

              return (
                <div
                  key={donor.id}
                  className="bg-white/95 rounded-2xl p-3.5 border border-[#ECE7DF] shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-[#241E1C]">{donor.name}</h4>
                        {donor.leadershipBadge && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              donor.leadershipBadge.includes('Coordenador')
                                ? 'bg-[#7B1113] text-[#FFF0BE] border-[#E5C158] shadow-2xs'
                                : 'bg-rose-50 text-rose-900 border-rose-200'
                            }`}
                          >
                            {donor.leadershipBadge}
                          </span>
                        )}
                        {donor.maritalStatus && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            {donor.maritalStatus}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          R$ {donor.totalDonated.toFixed(2).replace('.', ',')} doados
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#70645E] mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#7B1113]" /> {donor.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Cake className="w-3 h-3 text-amber-600" /> Nasc: <strong>{donor.birthDate}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-700" /> {donor.donationsCount} ofertas
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSendBirthdayAutomation(donor)}
                        title="Disparar automação de Parabéns no WhatsApp"
                        className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Cake className="w-3.5 h-3.5 text-amber-700" />
                        <span>Parabéns Zap</span>
                      </button>

                      {(currentRole === 'admin' || currentRole === 'formador') && donors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteDonor(donor.id)}
                          aria-label="Excluir membro"
                          className="p-1.5 text-[#8A7C75] hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Histórico de Doações deste Membro */}
                  {memberDonations.length > 0 && (
                    <div className="pt-2 border-t border-[#F2EFE9]">
                      <span className="text-[10px] font-bold uppercase text-[#70645E] block mb-1.5">
                        Histórico de Doações ({memberDonations.length}):
                      </span>
                      <div className="space-y-1 max-h-28 overflow-y-auto">
                        {memberDonations.map(don => (
                          <div
                            key={don.id}
                            className="flex items-center justify-between text-[11px] bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#ECE7DF]"
                          >
                            <div className="truncate pr-2">
                              <span className="font-bold text-[#241E1C]">
                                R$ {don.amount.toFixed(2).replace('.', ',')}
                              </span>{' '}
                              • <span className="text-[#70645E]">{don.campaignTitle}</span>
                              <span className="text-[9px] text-[#9A8E87] block">
                                {don.createdAt}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {don.status === 'paid' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                  ✅ Pago
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => triggerPaymentWebhook(don.id)}
                                  className="text-[10px] font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 px-2 py-0.5 rounded-md cursor-pointer"
                                >
                                  Confirmar PIX
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 5: MONITOR DE WEBHOOKS & CONFIRMAÇÃO AUTOMÁTICA
      ===================================================================== */}
      {activeTab === 'webhooks' && (
        <div className="space-y-3">
          <div className="bg-white/95 rounded-2xl p-4 border border-[#ECE7DF] shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#241E1C]">
                  Central de Webhooks & Confirmação Automática
                </h3>
                <p className="text-[11px] text-[#70645E] leading-relaxed">
                  Assim que o gateway (Mercado Pago / Asaas) notifica o pagamento do PIX via{' '}
                  <code className="bg-[#F2EFE9] px-1 py-0.5 rounded text-[#7B1113] font-mono">
                    POST /api/webhooks/payment
                  </code>
                  , o sistema atualiza o banco de dados e envia a mensagem de agradecimento no WhatsApp do membro.
                </p>
              </div>
              <Webhook className="w-5 h-5 text-[#7B1113] shrink-0" />
            </div>

            <div className="space-y-2">
              {donations.map(don => (
                <div
                  key={don.id}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#241E1C]">
                        R$ {don.amount.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs font-bold text-[#7B1113]">
                        {don.donorName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          don.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {don.status === 'paid' ? '✅ Webhook Confirmado' : '⏳ Aguardando Webhook'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#70645E]">
                      {don.campaignTitle} • WhatsApp: {don.donorPhone} • Gateway:{' '}
                      <strong className="uppercase">{don.gateway}</strong>
                    </p>
                    <p className="text-[10px] text-[#8A7E78]">
                      Criado em: {don.createdAt}
                      {don.paidAt ? ` • Pago em: ${don.paidAt}` : ''}
                      {don.thankYouSent ? ' • 📩 Agradecimento WhatsApp Enviado' : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {don.status !== 'paid' ? (
                      <button
                        type="button"
                        onClick={() => triggerPaymentWebhook(don.id)}
                        className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Simular Webhook Pago</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Comprovante Enviado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
