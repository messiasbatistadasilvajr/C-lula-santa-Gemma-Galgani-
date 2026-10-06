/**
 * Santa Gemma Galgani - Tipos e Modelos de Domínio
 * Preparado para futura integração com Supabase PostgreSQL e Supabase Auth
 */

export type UserRole = 'admin' | 'formador' | 'membro';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  birthday: string;
  ministry: string;
  cellName: string;
  joinedDate: string;
  phone: string;
  bio?: string;
}

export type PostType = 
  | 'reflexao' 
  | 'oracao' 
  | 'testemunho' 
  | 'aviso' 
  | 'foto' 
  | 'momento';

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  type: PostType;
  title?: string;
  content: string;
  imageUrl?: string;
  tag: string;
  createdAt: string;
  likesCount: number;
  hasLiked: boolean;
  commentsCount: number;
  comments: PostComment[];
}

export type PrayerCategory = 
  | 'familia' 
  | 'saude' 
  | 'vocacional' 
  | 'espiritual' 
  | 'conversao' 
  | 'trabalho' 
  | 'outros';

export interface PrayerIntention {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  category: PrayerCategory;
  content: string;
  prayerCount: number;
  userPrayed: boolean;
  createdAt: string;
  urgent?: boolean;
  answered?: boolean;
}

export type EventType = 
  | 'encontro' 
  | 'missa' 
  | 'formacao' 
  | 'retiro' 
  | 'evento' 
  | 'escala';

export type RSVPStatus = 'attending' | 'maybe' | 'declined';

export interface ScaleRole {
  role: string; // Ex: "Liturgia", "Música / Louvor", "Acolhida", "Lanche"
  personName: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO format: YYYY-MM-DD
  time: string; // Ex: "20:00"
  location: string;
  description: string;
  leader: string;
  rsvpStatus: RSVPStatus | null;
  attendingCount: number;
  maybeCount: number;
  declinedCount: number;
  scaleRoles?: ScaleRole[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMine?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
    sender: string;
  };
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  date: string;
  author: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: 'retiro' | 'encontro' | 'lanche' | 'formacao' | 'momentos';
  coverImage: string;
  photoCount: number;
  date: string;
  photos: GalleryPhoto[];
}

export type FormationCategory = 
  | 'shalom' 
  | 'santa-gemma' 
  | 'oracoes' 
  | 'documentos' 
  | 'videos' 
  | 'links';

export interface FormationItem {
  id: string;
  category: FormationCategory;
  title: string;
  subtitle: string;
  author?: string;
  durationOrPages?: string;
  contentSnippet: string;
  fullContent?: string;
  audioVideoUrl?: string;
  externalUrl?: string;
  iconName?: string;
}

export interface CellNotice {
  id: string;
  title: string;
  content: string;
  priority: 'alta' | 'normal' | 'baixa';
  category: string;
  date: string;
  author: string;
}

/**
 * Modelo para fila de sincronização offline futura (Camada 1 -> Camada 2)
 */
export interface SyncQueueItem {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'post' | 'prayer' | 'rsvp' | 'message' | 'profile' | 'photo' | 'notice' | 'song' | 'scale' | 'event' | 'donor' | 'campaign' | 'donation';
  payload: Record<string, unknown>;
  createdAt: number;
  attempts: number;
}

// ---- ESCALAS DE SERVIÇO & ROTEIRO DO ENCONTRO ----
export interface MeetingRoteiroStep {
  id: string;
  timeEstimate: string; // Ex: "10 min"
  title: string;        // Ex: "Acolhida Fraterna"
  description: string;  // Dicas práticas do carisma shalom
  leader?: string;
}

export interface MeetingScale {
  id: string;
  meetingDate: string; // Ex: "Sábado, 28 de Setembro - 19:30"
  theme: string;       // Tema da formação
  formador: string;    // Quem dará a partilha
  animator: string;    // Oração inicial e condução
  musicLeader: string; // Cânticos e violão
  welcomeLeader: string; // Acolhimento e porta
  snackLeader: string; // Lanche / Ágape fraterno
  intercessionLeader: string; // Intercessão prévia
  notes?: string;
  roteiro: MeetingRoteiroStep[];
}

// ---- LITURGIA DIÁRIA & SANTO DO DIA ----
export interface LiturgyReading {
  title: string;      // Ex: "Primeira Leitura (Tg 2, 1-9)"
  reference: string;
  text: string;
}

export interface DailyLiturgy {
  date: string;       // Ex: "24 de Setembro de 2026"
  liturgicalColor: string; // Ex: "Verde" | "Branco" | "Vermelho" | "Roxo"
  headline: string;   // Ex: "Terça-feira da 25ª Semana do Tempo Comum"
  firstReading: LiturgyReading;
  psalm: {
    reference: string;
    chorus: string;
    verses: string[];
  };
  secondReading?: LiturgyReading;
  gospel: LiturgyReading;
  reflection: {
    author: string;
    text: string;
  };
}

export interface SaintOfDay {
  name: string;
  title: string;        // Ex: "Virgem e Mística Passionista"
  feastDate: string;    // Ex: "24 de Setembro"
  imageUrl?: string;
  summary: string;
  lifeStory: string;
  virtue: string;       // Ex: "Amor apaixonado por Jesus Crucificado"
  prayer: string;       // Oração oficial do Santo
}

// ---- CANCIONEIRO DA CÉLULA ----
export type SongCategory = 
  | 'louvor' 
  | 'adoracao' 
  | 'espirito_santo' 
  | 'mariano' 
  | 'santa_gemma' 
  | 'comunhao' 
  | 'perdao';

export interface CellSong {
  id: string;
  title: string;
  artist: string;
  category: SongCategory;
  key: string;            // Ex: "G", "D", "Am"
  lyrics: string;         // Letra completa com ou sem cifras
  suggestedMoment: string;// Ex: "Louvor inicial", "Oração de Efusão"
  hasChords?: boolean;
}

// ---- TERÇO & ROSÁRIO VIRTUAL ----
export type RosaryType = 'mariano' | 'santa_gemma' | 'misericordia';

export type RosaryMysteryGroup = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';

export interface RosaryMysteryItem {
  number: number;
  title: string;
  scripture: string;
  fruit: string;
  meditation: string;
}

// ---- NOVENA DE SANTA GEMMA & GRAÇAS ALCANÇADAS ----
export interface NovenaDayItem {
  dayNumber: number;
  title: string;
  theme: string;
  scripture: string;
  meditation?: string;
  meditacao: string;
  gemmaQuote: string;
  prayer: string;
  intentionPrompt: string;
}

export type TestimonyCategory = 
  | 'cura' 
  | 'familia' 
  | 'vocacional' 
  | 'conversao' 
  | 'trabalho' 
  | 'espiritual';

export interface GraceTestimony {
  id: string;
  authorName: string;
  authorRole?: UserRole;
  title: string;
  story: string;
  category: TestimonyCategory;
  date: string;
  praiseCount: number;
  hasPraised: boolean;
}

// ---- MODO ENCONTRO AO VIVO ----
export interface LiveMeetingStep {
  id: string;
  title: string;
  defaultMinutes: number;
  description: string;
  scriptureFocus?: string;
  tips: string;
}

// ---- MÓDULO DE ARRECADAÇÃO FINANCEIRA & BOT WHATSAPP (DIZIFY) ----
export interface DonorProfile {
  id: string;
  name: string;
  phone: string;
  birthDate: string; // Ex: "14/10/1998" ou "1998-10-14"
  maritalStatus?: string; // Ex: "Solteiro", "Casado", "Solteira"
  leadershipBadge?: string; // Ex: "Coordenador & Formador (Admin)"
  email?: string;
  totalDonated: number;
  donationsCount: number;
  lastDonationAt?: string;
  createdAt: string;
}

export type CampaignCategory =
  | 'retiro'
  | 'acao_social'
  | 'manutencao'
  | 'comunhao_bens'
  | 'missao';

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  pixKey: string;
  deadline: string;
  category: CampaignCategory;
  active: boolean;
}

export type DonationType = 'oferta' | 'comunhao_bens' | 'campanha';
export type DonationStatus = 'pending' | 'paid' | 'expired';
export type PaymentGatewayType = 'mercadopago' | 'asaas' | 'pix_direto';

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  amount: number;
  type: DonationType;
  campaignId?: string;
  campaignTitle?: string;
  status: DonationStatus;
  gateway: PaymentGatewayType;
  pixCopyPaste: string;
  externalReference?: string;
  createdAt: string;
  paidAt?: string;
  thankYouSent?: boolean;
}

export interface WhatsAppBotChatMessage {
  id: string;
  sender: 'member' | 'bot';
  text: string;
  timestamp: string;
  pixData?: {
    donationId: string;
    amount: number;
    pixCopyPaste: string;
    campaignTitle: string;
    status: DonationStatus;
  };
}


