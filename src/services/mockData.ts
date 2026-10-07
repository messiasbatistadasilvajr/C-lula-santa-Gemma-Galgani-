import { 
  UserProfile, 
  CommunityPost, 
  PrayerIntention, 
  CalendarEvent, 
  ChatMessage, 
  ChatChannel, 
  GalleryAlbum, 
  FormationItem,
  CellNotice,
  DonorProfile,
  DonationCampaign,
  DonationRecord
} from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_cristiane',
    name: 'Cristiane Alves Nunes de Oliveira',
    email: 'cristiane.oliveira@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    birthday: '26/01/1983',
    ministry: 'Coordenadora, Administradora & Formadora da Célula',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Janeiro de 2020',
    phone: '(85) 98225-0655',
    bio: 'Coordenadora, Administradora e Formadora da Célula Santa Gemma Galgani com acesso total ao sistema.',
  },
  {
    id: 'user_francisco',
    name: 'Francisco José de Oliveira',
    email: 'francisco.oliveira@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    birthday: '25/10/1976',
    ministry: 'Coordenador, Administrador & Formador da Célula',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Janeiro de 2020',
    phone: '(85) 99843-3531',
    bio: 'Coordenador, Administrador e Formador da Célula Santa Gemma Galgani com acesso total ao sistema.',
  },
  {
    id: 'user_2',
    name: 'Cristiane Alves Nunes de Oliveira',
    email: 'cristiane.oliveira@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'formador',
    birthday: '26/01/1983',
    ministry: 'Formadora & Coordenadora da Célula (Acesso Total)',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Janeiro de 2020',
    phone: '(85) 98225-0655',
    bio: 'Formadora e Coordenadora da Célula Santa Gemma Galgani.',
  },
  {
    id: 'user_messias',
    name: 'Messias Batista da Silva Júnior',
    email: 'messiasbjunior76@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'membro',
    birthday: '16/01/1976',
    ministry: 'Membro da Célula',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Janeiro de 2020',
    phone: '(85) 98174-2686',
    bio: 'Membro da Célula Santa Gemma Galgani.',
  },
  {
    id: 'user_1',
    name: 'Aliomar Gabriel Oliveira',
    email: 'aliomar.gabriel@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'membro',
    birthday: '12/03/1978',
    ministry: 'Membro da Célula & Intercessão',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Março de 2023',
    phone: '(85) 99109-7673',
    bio: 'Membro da Célula Santa Gemma Galgani na Comunidade Católica Shalom.',
  },
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorId: 'user_cristiane',
    authorName: 'Cristiane Alves Nunes de Oliveira',
    authorRole: 'formador',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    type: 'reflexao',
    title: 'A Cruz é a Cátedra do Amor de Deus',
    content: 'Hoje rezando com os escritos de Santa Gemma, ela nos recorda: "Se desejas verdadeiramente amar a Jesus, aprende primeiro a sofrer por Ele". Que na nossa caminhada de célula possamos abraçar cada pequena renúncia como uma flor oferecida ao Coração Eucarístico do Senhor.',
    tag: 'Reflexão Espiritual',
    createdAt: 'Hoje às 14:30',
    likesCount: 14,
    hasLiked: true,
    commentsCount: 2,
    comments: [
      {
        id: 'c_1',
        authorId: 'user_messias',
        authorName: 'Messias Batista da Silva Júnior',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Amém! Palavra muito oportuna para o nosso dia de hoje.',
        createdAt: 'Hoje às 15:10',
      },
      {
        id: 'c_2',
        authorId: 'user_francisco',
        authorName: 'Francisco José de Oliveira',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Shalom! Vamos aprofundar esse tema nos nossos encontros de segunda e sexta às 19h.',
        createdAt: 'Hoje às 16:05',
      },
    ],
  },
  {
    id: 'post_2',
    authorId: 'user_francisco',
    authorName: 'Francisco José de Oliveira',
    authorRole: 'admin',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'aviso',
    title: 'Dias e Horários da Célula: Segunda e Sexta (19h às 21h)',
    content: 'Paz e Bem, irmãos! Lembramos que nossos encontros oficiais da Célula Santa Gemma Galgani acontecem toda segunda-feira e sexta-feira, das 19:00 até 21:00. Esperamos todos pontualmente às 19h para o louvor, formação e partilha fraterna!',
    tag: 'Aviso da Coordenação',
    createdAt: 'Ontem às 19:15',
    likesCount: 18,
    hasLiked: false,
    commentsCount: 1,
    comments: [
      {
        id: 'c_3',
        authorId: 'user_1',
        authorName: 'Aliomar Gabriel Oliveira',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Confirmadíssimo! Segunda e sexta às 19h estaremos firmes.',
        createdAt: 'Ontem às 20:00',
      },
    ],
  },
  {
    id: 'post_3',
    authorId: 'donor_4',
    authorName: 'Ana Regina Vieira de Brito',
    authorRole: 'membro',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'testemunho',
    title: 'Testemunho de Cura Interior no Retiro',
    content: 'Quero partilhar com os irmãos a imensa gratidão ao Senhor. No retiro do último mês, durante a adoração ao Santíssimo, o Senhor renovou profundamente a paz na minha vida e família. A oração comunitária da célula foi decisiva nesse processo.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    tag: 'Testemunho',
    createdAt: 'Há 2 dias',
    likesCount: 26,
    hasLiked: true,
    commentsCount: 0,
    comments: [],
  },
  {
    id: 'post_4',
    authorId: 'user_messias',
    authorName: 'Messias Batista da Silva Júnior',
    authorRole: 'membro',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'momento',
    title: 'Noite de Louvor e Adoração da Célula',
    content: 'Registro da nossa vigília de adoração na capela Shalom. Momentos de profunda comunhão, intercessão e presença do Ressuscitado que passou pela Cruz.',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
    tag: 'Momento da Célula',
    createdAt: 'Há 3 dias',
    likesCount: 22,
    hasLiked: true,
    commentsCount: 0,
    comments: [],
  },
];

export const INITIAL_PRAYERS: PrayerIntention[] = [
  {
    id: 'prayer_1',
    authorId: 'donor_4',
    authorName: 'Ana Regina Vieira de Brito',
    authorRole: 'membro',
    category: 'familia',
    content: 'Peço oração pela minha família, para que o Senhor conceda união, paz e saúde a todos os nossos familiares.',
    prayerCount: 19,
    userPrayed: true,
    createdAt: 'Hoje às 09:12',
    urgent: true,
  },
  {
    id: 'prayer_2',
    authorId: 'user_1',
    authorName: 'Aliomar Gabriel Oliveira',
    authorRole: 'membro',
    category: 'saude',
    content: 'Intenção pela saúde dos enfermos das nossas famílias e pela restauração física e espiritual de quem passa por tratamento médico.',
    prayerCount: 27,
    userPrayed: false,
    createdAt: 'Ontem às 18:40',
    urgent: true,
  },
  {
    id: 'prayer_3',
    authorId: 'user_cristiane',
    authorName: 'Cristiane Alves Nunes de Oliveira',
    authorRole: 'formador',
    category: 'vocacional',
    content: 'Pelos membros e vocacionados da nossa Célula Santa Gemma Galgani, para que tenham coragem de dar o Sim generoso ao Carisma Shalom.',
    prayerCount: 34,
    userPrayed: true,
    createdAt: 'Há 2 dias',
    urgent: false,
  },
  {
    id: 'prayer_4',
    authorId: 'user_francisco',
    authorName: 'Francisco José de Oliveira',
    authorRole: 'admin',
    category: 'trabalho',
    content: 'Pela providência profissional e financeira de todos os irmãos da nossa célula e pelas famílias que buscam portas de trabalho.',
    prayerCount: 15,
    userPrayed: false,
    createdAt: 'Há 3 dias',
    urgent: false,
  },
  {
    id: 'prayer_5',
    authorId: 'user_messias',
    authorName: 'Messias Batista da Silva Júnior',
    authorRole: 'membro',
    category: 'espiritual',
    content: 'Em ação de graças pela fidelidade na oração pessoal diária e por perseverança no Estudo Bíblico de todos os 48 irmãos da célula.',
    prayerCount: 12,
    userPrayed: true,
    createdAt: 'Há 4 dias',
    answered: true,
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_1',
    title: 'Encontro da Célula • Segunda-feira (19h às 21h)',
    type: 'encontro',
    date: '2026-10-05', // Segunda-feira
    time: '19:00 às 21:00',
    location: 'Célula Santa Gemma Galgani • Shalom',
    description: 'Encontro de segunda-feira da Célula Santa Gemma Galgani (19:00 até 21:00). Louvor comunitário, oração de escuta, formação do Caminho da Paz e partilha fraterna.',
    leader: 'Cristiane Alves & Francisco José',
    rsvpStatus: 'attending',
    attendingCount: 24,
    maybeCount: 2,
    declinedCount: 0,
    scaleRoles: [
      { role: 'Animação e Louvor (19:00)', personName: 'Aliomar Gabriel Oliveira' },
      { role: 'Formação & Palavra (19:50)', personName: 'Cristiane Alves Nunes de Oliveira' },
      { role: 'Lanche & Fraternidade (20:40)', personName: 'Ana Regina Vieira de Brito' },
    ],
  },
  {
    id: 'evt_2',
    title: 'Encontro da Célula • Sexta-feira (19h às 21h)',
    type: 'encontro',
    date: '2026-10-09', // Sexta-feira
    time: '19:00 às 21:00',
    location: 'Célula Santa Gemma Galgani • Shalom',
    description: 'Encontro de sexta-feira da Célula Santa Gemma Galgani (19:00 até 21:00). Oração de intercessão, efusão do Espírito Santo, testemunhos e fraternidade.',
    leader: 'Francisco José & Cristiane Alves',
    rsvpStatus: 'attending',
    attendingCount: 28,
    maybeCount: 1,
    declinedCount: 0,
    scaleRoles: [
      { role: 'Acolhida & Louvor (19:00)', personName: 'Bruno Gomes Linhares' },
      { role: 'Intercessão & Cura (19:45)', personName: 'Francisco José de Oliveira' },
      { role: 'Ágape Fraterno (20:40)', personName: 'Alexandre de Oliveira da Silva' },
    ],
  },
  {
    id: 'evt_3',
    title: 'Encontro da Célula • Segunda-feira (Padroeira Santa Gemma)',
    type: 'encontro',
    date: '2026-10-12', // Segunda-feira
    time: '19:00 às 21:00',
    location: 'Célula Santa Gemma Galgani • Shalom',
    description: 'Encontro especial de segunda-feira das 19:00 às 21:00 meditando a espiritualidade da Cruz e a convivência mística com o Anjo da Guarda em Santa Gemma Galgani.',
    leader: 'Cristiane Alves Nunes de Oliveira',
    rsvpStatus: 'attending',
    attendingCount: 25,
    maybeCount: 2,
    declinedCount: 0,
  },
  {
    id: 'evt_4',
    title: 'Encontro da Célula • Sexta-feira (Noite de Louvor & Partilha)',
    type: 'encontro',
    date: '2026-10-16', // Sexta-feira
    time: '19:00 às 21:00',
    location: 'Célula Santa Gemma Galgani • Shalom',
    description: 'Encontro de sexta-feira das 19:00 até 21:00 com louvor, escuta profética, partilha de vida e encerramento fraterno.',
    leader: 'Francisco José de Oliveira & Cristiane Alves',
    rsvpStatus: 'attending',
    attendingCount: 26,
    maybeCount: 2,
    declinedCount: 0,
    scaleRoles: [
      { role: 'Equipe de Intercessão', personName: 'Messias Batista da Silva Júnior' },
      { role: 'Liturgia e Palavra', personName: 'Cristiane Alves Nunes de Oliveira' },
    ],
  },
  {
    id: 'evt_5',
    title: 'Vigília Shalom & Adoração ao Santíssimo',
    type: 'evento',
    date: '2026-10-16',
    time: '21:30',
    location: 'Capela do Santíssimo Sacramento',
    description: 'Vigília com adoração ao Santíssimo, Santo Rosário e intercessão pelas famílias da célula.',
    leader: 'Cristiane Alves & Francisco José',
    rsvpStatus: null,
    attendingCount: 18,
    maybeCount: 2,
    declinedCount: 0,
  },
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan_geral',
    name: 'Célula Santa Gemma (Geral)',
    description: 'Canal oficial de partilha fraterna e avisos da célula',
    unreadCount: 2,
    lastMessage: {
      text: 'Amém irmãos! Segunda e sexta às 19h estaremos todos reunidos.',
      timestamp: '17:42',
      sender: 'Ana Regina Vieira de Brito',
    },
  },
  {
    id: 'chan_intercessao',
    name: 'Ministério de Intercessão',
    description: 'Canal de oração contínua pelas intenções urgentes',
    unreadCount: 0,
    lastMessage: {
      text: 'Rezei o terço pelas intenções das famílias da nossa célula hoje cedo.',
      timestamp: '11:15',
      sender: 'Cristiane Alves Nunes de Oliveira',
    },
  },
  {
    id: 'chan_lideranca',
    name: 'Coordenação & Formação',
    description: 'Planejamento dos encontros e acompanhamentos',
    unreadCount: 0,
    lastMessage: {
      text: 'Roteiro de formação de segunda e sexta enviado para acompanhamento.',
      timestamp: 'Ontem',
      sender: 'Francisco José de Oliveira',
    },
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  chan_geral: [
    {
      id: 'm_1',
      channelId: 'chan_geral',
      senderId: 'user_francisco',
      senderName: 'Francisco José de Oliveira',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Paz e Bem a todos! Lembrando de confirmar presença no nosso encontro aqui no aplicativo.',
      timestamp: '16:30',
      isMine: false,
    },
    {
      id: 'm_2',
      channelId: 'chan_geral',
      senderId: 'user_cristiane',
      senderName: 'Cristiane Alves Nunes de Oliveira',
      senderRole: 'formador',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      text: 'Shalom queridos! Na formação vamos meditar um trecho lindo do diário de Santa Gemma.',
      timestamp: '16:55',
      isMine: false,
    },
    {
      id: 'm_3',
      channelId: 'chan_geral',
      senderId: 'user_messias',
      senderName: 'Messias Batista da Silva Júnior',
      senderRole: 'membro',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Louvado seja Deus! Já estamos em oração pelo nosso encontro das 19h.',
      timestamp: '17:15',
      isMine: true,
    },
    {
      id: 'm_4',
      channelId: 'chan_geral',
      senderId: 'donor_4',
      senderName: 'Ana Regina Vieira de Brito',
      senderRole: 'membro',
      authorAvatar: undefined,
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: 'Amém irmãos! Segunda e sexta às 19h estaremos todos reunidos.',
      timestamp: '17:42',
      isMine: false,
    } as ChatMessage,
  ],
  chan_intercessao: [
    {
      id: 'm_201',
      channelId: 'chan_intercessao',
      senderId: 'user_1',
      senderName: 'Aliomar Gabriel Oliveira',
      senderRole: 'membro',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Irmãos, intercedendo pela saúde das famílias da nossa célula. Deus abençoe quem puder se unir às 15h.',
      timestamp: '08:00',
      isMine: false,
    },
    {
      id: 'm_202',
      channelId: 'chan_intercessao',
      senderId: 'user_cristiane',
      senderName: 'Cristiane Alves Nunes de Oliveira',
      senderRole: 'formador',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      text: 'Rezei o terço pelas intenções das famílias da nossa célula hoje cedo.',
      timestamp: '11:15',
      isMine: false,
    },
  ],
  chan_lideranca: [
    {
      id: 'm_301',
      channelId: 'chan_lideranca',
      senderId: 'user_francisco',
      senderName: 'Francisco José de Oliveira',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Roteiro de formação de segunda e sexta enviado para acompanhamento.',
      timestamp: 'Ontem',
      isMine: false,
    },
  ],
};

export const INITIAL_ALBUMS: GalleryAlbum[] = [
  {
    id: 'alb_1',
    title: 'Retiro da Célula 2026',
    category: 'retiro',
    coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=80',
    photoCount: 16,
    date: 'Fevereiro de 2026',
    photos: [
      {
        id: 'p_1',
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
        caption: 'Adoração ao Santíssimo no Retiro da Célula',
        date: '15/02/2026',
        author: 'Cristiane Alves Nunes de Oliveira',
      },
      {
        id: 'p_2',
        url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
        caption: 'Oração comunitária ao ar livre',
        date: '15/02/2026',
        author: 'Francisco José de Oliveira',
      },
      {
        id: 'p_3',
        url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop&q=80',
        caption: 'Almoço fraterno de encerramento do retiro',
        date: '16/02/2026',
        author: 'Messias Batista da Silva Júnior',
      },
    ],
  },
  {
    id: 'alb_2',
    title: 'Encontros de Oração',
    category: 'encontro',
    coverImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80',
    photoCount: 24,
    date: 'Janeiro - Março 2026',
    photos: [
      {
        id: 'p_4',
        url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80',
        caption: 'Célula reunida com a Bíblia e a vela acesa',
        date: '05/03/2026',
        author: 'Francisco José de Oliveira',
      },
      {
        id: 'p_5',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
        caption: 'Momento de acolhimento e partilha dos irmãos',
        date: '12/03/2026',
        author: 'Cristiane Alves Nunes de Oliveira',
      },
    ],
  },
  {
    id: 'alb_3',
    title: 'Lanches Fraternos',
    category: 'lanche',
    coverImage: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80',
    photoCount: 12,
    date: '2026',
    photos: [
      {
        id: 'p_6',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
        caption: 'Comemoração dos aniversariantes da célula',
        date: '20/02/2026',
        author: 'Ana Regina Vieira de Brito',
      },
    ],
  },
  {
    id: 'alb_4',
    title: 'Formação Caminho da Paz',
    category: 'formacao',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    photoCount: 9,
    date: '2026',
    photos: [
      {
        id: 'p_7',
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
        caption: 'Estudo em grupo dos Escritos de Moysés Azevedo',
        date: '28/02/2026',
        author: 'Cristiane Alves Nunes de Oliveira',
      },
    ],
  },
];

export const INITIAL_FORMATIONS: FormationItem[] = [
  {
    id: 'form_1',
    category: 'shalom',
    title: 'O Carisma Shalom e o Caminho da Paz',
    subtitle: 'Comunidade Católica Shalom',
    author: 'Moysés Louro de Azevedo Filho',
    durationOrPages: '18 páginas',
    contentSnippet: 'O Carisma Shalom nasce aos pés de Pedro como um chamado a anunciar a Paz de Cristo aos que estão longe de Deus e da Igreja.',
    fullContent: `O Carisma Shalom é um dom do Espírito Santo concedido à Igreja para evangelizar os homens com ousadia e criatividade, especialmente os jovens, através de uma vida de oração, vida fraterna e anúncio do Evangelho.

O Caminho da Paz é o itinerário formativo espiritual dos membros da Obra Shalom, estruturado em fases graduais: Primeiros Passos, Kairós, Filoteia, Betânia e Emaús. Cada fase aprofunda a vida de oração pessoal diária (30 minutos a 1 hora diante do sacrário ou em lugar recolhido), o Estudo Bíblico formativo e a vivência dos sacramentos da Confissão e da Eucaristia.`,
  },
  {
    id: 'form_2',
    category: 'santa-gemma',
    title: 'Santa Gemma Galgani: A Flor da Paixão',
    subtitle: 'A virgem de Lucca e a mística da Cruz',
    author: 'Pe. Germano de Santo Estanislau',
    durationOrPages: 'Artigo Biográfico',
    contentSnippet: 'Nascida em Camigliano na Itália em 1878, Gemma foi marcada pelo amor apaixonado ao Crucificado e pela intimidade com seu Anjo da Guarda.',
    fullContent: `Santa Gemma Galgani (1878–1903) foi uma leiga italiana canonizada por Pio XII em 1940. Conhecida como "A Filha da Paixão", viveu no mundo com o coração inteiramente consagrado a Cristo.

Desde muito jovem manifestou um ardor extraordinário pela Eucaristia. Aos 21 anos recebeu os sagrados estigmas da Paixão do Senhor. Sua relação com o Anjo da Guarda era cotidiana, simples e cheia de reverência; ele a instruía, rezava com ela e a consolava nas horas de sofrimento. Gemma ensina à nossa célula que a santidade é possível no cotidiano mais simples através do amor humilde à Vontade de Deus.`,
  },
  {
    id: 'form_3',
    category: 'oracoes',
    title: 'Oração Diária a Santa Gemma Galgani',
    subtitle: 'Devocionário da Célula',
    durationOrPages: 'Oração Oficial',
    contentSnippet: 'Ó gloriosa Santa Gemma, que fostes na terra modelo admirável de pureza, de amor a Jesus Crucificado e de devoção à Virgem Maria...',
    fullContent: `Ó gloriosa Santa Gemma,
que fostes na terra modelo admirável de pureza,
de amor a Jesus Crucificado e de filial devoção à Virgem Santíssima,
obtende-me do Senhor a graça de amar a Deus sobre todas as coisas
e de suportar pacientemente os sofrimentos da vida presente.

Vós que tivestes a santa intimidade com o vosso Anjo da Guarda,
alcançai-me a docilidade às inspirações do Espírito Santo
e a perseverança final na fé.

Apresentai ao Coração Sagrado de Jesus
as intenções que hoje coloco em vossas mãos...
(Mencione aqui a sua intenção particular)

Santa Gemma Galgani, rogai por nós!
Amém.`,
  },
  {
    id: 'form_4',
    category: 'oracoes',
    title: 'Terço da Divina Misericórdia',
    subtitle: 'Oração das 15:00',
    durationOrPages: 'Devoção',
    contentSnippet: 'Eterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho...',
    fullContent: `Inicia-se com o Pai Nosso, Ave Maria e Creio.

Nas contas grandes do Pai Nosso:
"Eterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro."

Nas contas pequenas da Ave Maria (10 vezes):
"Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro."

Ao final (3 vezes):
"Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro."
"Jesus, eu confio em Vós!"`,
  },
  {
    id: 'form_5',
    category: 'documentos',
    title: 'Roteiro de Encontro da Célula Shalom',
    subtitle: 'Guia para Coordenadores e Membros',
    durationOrPages: 'Documento PDF / Guia',
    contentSnippet: 'Estrutura pedagógica dos 4 momentos do encontro: Acolhida, Oração Comunitária de Louvor, Formação e Partilha Fraterna.',
    fullContent: `Estrutura Oficial do Encontro de Célula:

1. Acolhida Fraterna (10 min): Saudação da Paz, ambientação fraterna, oração inicial espontânea.
2. Oração Comunitária (30 min):
   - Louvor vibrante e de ação de graças
   - Oração em línguas e cântico espiritual
   - Momento de silêncio e escuta da Palavra de Deus (Profecia/Visão/Raciocínio de fé)
3. Formação Espiritual (25 min):
   - Leitura do texto temático do itinerário espiritual
   - Partilha guiada com base na vivência prática
4. Avisos, Intercessão e Lanche Fraterno (20 min):
   - Orações pelas intenções da célula e do Santo Padre
   - Confraternização comunitária.`,
  },
  {
    id: 'form_6',
    category: 'videos',
    title: 'Santa Gemma e o Amor Eucarístico',
    subtitle: 'Homilia e Formação Comunitária',
    durationOrPages: 'Vídeo / Áudio (Link Externo)',
    contentSnippet: 'Reflexão sobre como Santa Gemma se preparava para a Comunhão e o impacto na vida dos jovens de hoje.',
    externalUrl: 'https://comshalom.org',
  },
];

export const INITIAL_NOTICES: CellNotice[] = [
  {
    id: 'not_1',
    title: 'Inscrições para o Retiro Semestral da Célula',
    content: 'As inscrições para o retiro da nossa célula já estão abertas. Por favor confirmem no aplicativo e conversem com Francisco José ou Cristiane Alves sobre a inscrição.',
    priority: 'alta',
    category: 'Eventos',
    date: '06/10/2026',
    author: 'Francisco José de Oliveira (Coordenação)',
  },
  {
    id: 'not_2',
    title: 'Arrecadação de Alimentos para a Promoção Humana',
    content: 'Neste mês nossa célula adotou a arrecadação de alimentos para as famílias assistidas. Tragam as doações nos encontros de segunda e sexta às 19h!',
    priority: 'alta',
    category: 'Solidariedade',
    date: '05/10/2026',
    author: 'Cristiane Alves Nunes de Oliveira (Coordenação & Formação)',
  },
  {
    id: 'not_3',
    title: 'Caderno de Formação do Caminho da Paz',
    content: 'Os novos cadernos de formação já estão disponíveis na livraria Shalom para os irmãos que iniciaram o novo módulo.',
    priority: 'normal',
    category: 'Formação',
    date: '04/10/2026',
    author: 'Cristiane Alves Nunes de Oliveira (Formadora)',
  },
];

// ---- ESCALAS DE SERVIÇO & ROTEIRO DO ENCONTRO ----
import { MeetingScale, DailyLiturgy, SaintOfDay, CellSong } from '../types';

export const INITIAL_SCALES: MeetingScale[] = [
  {
    id: 'scale_1',
    meetingDate: 'Segunda-feira • 19:00 às 21:00',
    theme: 'O Amor Apaixonado pelo Crucificado e a Vida de Oração',
    formador: 'Cristiane Alves Nunes de Oliveira',
    animator: 'Francisco José de Oliveira (Coordenação)',
    musicLeader: 'Aliomar Gabriel Oliveira & Bruno Gomes Linhares',
    welcomeLeader: 'Ana Regina Vieira de Brito & Clarissa Maria Rocha Freitas',
    snackLeader: 'Alexandre de Oliveira da Silva & Daniele Vieira Araújo',
    intercessionLeader: 'Messias Batista da Silva Júnior (Intercessão às 18:45)',
    notes: 'Nossa célula acontece toda Segunda-feira e Sexta-feira das 19:00 até 21:00. Favor chegar 10 minutos antes e trazer a Bíblia!',
    roteiro: [
      {
        id: 'rot_1',
        timeEstimate: '19:00 - 19:15 (15 min)',
        title: 'Acolhida Fraterna & Recepção',
        description: 'Recepção calorosa de cada irmão na porta, abraço da paz, acomodação e entrega dos folhetos de cânticos.',
        leader: 'Ana Regina Vieira de Brito',
      },
      {
        id: 'rot_2',
        timeEstimate: '19:15 - 19:40 (25 min)',
        title: 'Louvor Vibrante & Cânticos Espirituais',
        description: 'Louvor vocal entusiasmado, ação de graças pelas vitórias da semana, cântico em línguas e efusão do Espírito Santo.',
        leader: 'Aliomar Gabriel Oliveira & Bruno Gomes Linhares',
      },
      {
        id: 'rot_3',
        timeEstimate: '19:40 - 20:00 (20 min)',
        title: 'Escuta da Palavra & Oração Comunitária',
        description: 'Momento de recolhimento, silêncio sagrado, profecia, raciocínio de fé e oração fraterna uns pelos outros.',
        leader: 'Francisco José de Oliveira',
      },
      {
        id: 'rot_4',
        timeEstimate: '20:00 - 20:40 (40 min)',
        title: 'Formação do Caminho da Paz & Partilha',
        description: 'Ensino da palavra com tema do módulo e espaço para testemunhos de aplicação concreta na rotina pessoal.',
        leader: 'Cristiane Alves Nunes de Oliveira',
      },
      {
        id: 'rot_5',
        timeEstimate: '20:40 - 21:00 (20 min)',
        title: 'Avisos da Célula, Bênção & Ágape (Encerramento às 21h)',
        description: 'Avisos da coordenação, bênção final às 21:00 com partilha do lanche e fraternidade entre os irmãos.',
        leader: 'Alexandre de Oliveira da Silva & Francisco José',
      },
    ],
  },
  {
    id: 'scale_2',
    meetingDate: 'Sexta-feira • 19:00 às 21:00',
    theme: 'Santa Gemma Galgani: Amizade com o Anjo da Guarda e Intercessão',
    formador: 'Francisco José de Oliveira',
    animator: 'Cristiane Alves Nunes de Oliveira',
    musicLeader: 'Bruno Gomes Linhares & Isaac Souza Silva',
    welcomeLeader: 'Anna Karolinny de Sousa Araújo & Juliana Martins Lima',
    snackLeader: 'Edmar Ferreira de Sousa & Hozana Arruda da Costa Ferreira',
    intercessionLeader: 'Aliomar Gabriel Oliveira (Intercessão às 18:45)',
    notes: 'Encontro de Sexta-feira das 19:00 até 21:00 dedicado à oração de intercessão, cura interior e partilha da Palavra.',
    roteiro: [
      {
        id: 'rot_f1',
        timeEstimate: '19:00 - 19:15 (15 min)',
        title: 'Acolhida Fraterna & Integração',
        description: 'Acolhimento dos irmãos e visitantes para o encontro de sexta-feira.',
        leader: 'Anna Karolinny de Sousa Araújo & Juliana Martins Lima',
      },
      {
        id: 'rot_f2',
        timeEstimate: '19:15 - 19:45 (30 min)',
        title: 'Louvor & Efusão do Espírito Santo',
        description: 'Cânticos de louvor e adoração comunitária.',
        leader: 'Bruno Gomes Linhares & Isaac Souza Silva',
      },
      {
        id: 'rot_f3',
        timeEstimate: '19:45 - 20:20 (35 min)',
        title: 'Formação & Partilha da Palavra',
        description: 'Meditação da Palavra e partilha de vida dos membros da célula.',
        leader: 'Francisco José de Oliveira',
      },
      {
        id: 'rot_f4',
        timeEstimate: '20:20 - 20:45 (25 min)',
        title: 'Intercessão Pelas Famílias & Oração de Cura',
        description: 'Oração uns pelos outros e pelas intenções da Célula Santa Gemma.',
        leader: 'Cristiane Alves Nunes de Oliveira',
      },
      {
        id: 'rot_f5',
        timeEstimate: '20:45 - 21:00 (15 min)',
        title: 'Avisos & Encerramento Fraterno (21:00)',
        description: 'Comunicações do final de semana, oração final e comunhão fraterna.',
        leader: 'Edmar Ferreira de Sousa & Hozana Arruda',
      },
    ],
  },
];

// ---- LITURGIA DIÁRIA CATÓLICA ----
export const SAMPLE_LITURGY: DailyLiturgy = {
  date: '24 de Setembro de 2026',
  liturgicalColor: 'Verde (Tempo Comum)',
  headline: '25ª Semana do Tempo Comum — Fé Viva e Fraternidade Real',
  firstReading: {
    title: 'Primeira Leitura (Pr 30, 5-9)',
    reference: 'Livro dos Provérbios',
    text: `Toda a palavra de Deus é provada no fogo; ele é um escudo para quem nele confia. Não acrescentes nada às suas palavras, para que ele não te repreenda e sejas achado mentiroso.
Duas coisas te peço; não mas recuses, antes que eu morra: afasta de mim a falsidade e a mentira; não me dês nem a pobreza nem a riqueza, concede-me apenas o pão de que necessito, para não acontecer que, farto, eu te renegue e diga: "Quem é o Senhor?" Ou que, empobrecido, venha a furtar e profane o nome do meu Deus.`,
  },
  psalm: {
    reference: 'Salmo 118 (119)',
    chorus: 'Senhor, a tua palavra é lâmpada para os meus pés!',
    verses: [
      'Afasta de mim o caminho da mentira e concede-me benigno a tua lei.',
      'Mais vale para mim a lei da tua boca do que milhares de moedas de ouro e prata.',
      'Para sempre, ó Senhor, a tua palavra permanece firme nos céus.',
      'Detesto todo caminho de mentira, mas amo de todo o coração os teus preceitos.',
    ],
  },
  gospel: {
    title: 'Evangelho de Jesus Cristo segundo São Lucas (Lc 9, 1-6)',
    reference: 'Lucas 9, 1-6',
    text: `Naquele tempo, Jesus convocou os Doze e deu-lhes poder e autoridade sobre todos os demônios e para curar doenças. Depois, enviou-os a proclamar o Reino de Deus e a curar os doentes.
E disse-lhes: "Não leveis nada para o caminho: nem bordão, nem sacola, nem pão, nem dinheiro, nem duas túnicas. Em qualquer casa onde entrardes, permanecei aí até partir. E, se alguém não vos acolher, ao sairdes daquela cidade, sacudi até a poeira dos vossos pés, em testemunho contra eles".
Eles partiram e andavam pelas aldeias, anunciando a Boa-Nova e curando em todos os lugares.`,
  },
  reflection: {
    author: 'Comunidade Católica Shalom — Lectio Divina',
    text: 'A missão dos discípulos exige despojamento e total confiança na Providência divina. Em nossa célula Santa Gemma, somos convidados a não apoiar nossa segurança nas riquezas ou no controle das coisas, mas no poder e no amor de Jesus que nos envia.',
  },
};

// ---- SANTO DO DIA ----
export const SAMPLE_SAINT: SaintOfDay = {
  name: 'Santa Gemma Galgani',
  title: 'A Virgem de Lucca • Apóstola da Cruz e Amiga dos Anjos',
  feastDate: '11 de Abril (Memória Litúrgica: 16 de Maio)',
  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  summary: 'Mística passionista italiana que viveu uma amizade íntima com Jesus Crucificado e seu Anjo da Guarda, aceitando a enfermidade por amor às almas.',
  lifeStory: `Gemma nasceu perto de Lucca, na Itália, em 1878. Desde pequena sentiu atração profunda pela oração contemplativa e pelos mistérios da Paixão de Cristo. Perdeu a mãe e o pai ainda jovem, vivenciando a pobreza material com serenidade admirável.
Recebeu os estigmas da Paixão de Cristo, conversava familiarmente com seu Santo Anjo da Guarda e ofereceu todos os seus sofrimentos pela conversão dos pecadores e santificação dos sacerdotes.
Faleceu aos 25 anos em 11 de abril de 1903, Sábado Santo, e foi canonizada por Pio XII em 1940, que a chamou de "a joia do século XX".`,
  virtue: 'Pureza angelical, paciência heróica nas provações e união íntima com o Crucificado.',
  prayer: `Ó bendita Santa Gemma, que vos tornastes cópia fiel de Jesus Crucificado pela santidade e amor, volvei vosso olhar bondoso sobre a nossa célula.
Ensinai-nos a cultivar uma amizade sincera com nosso Santo Anjo da Guarda e a amar a Cruz não como fardo, mas como manancial de graça e vida eterna.
Por Jesus Cristo, nosso Senhor. Amém. Santa Gemma Galgani, rogai por nós!`,
};

// ---- CANCIONEIRO DA CÉLULA SHALOM & SANTA GEMMA ----
export const INITIAL_SONGS: CellSong[] = [
  {
    id: 'song_1',
    title: 'Belíssimo Esposo',
    artist: 'Comunidade Católica Shalom',
    category: 'adoracao',
    key: 'Em',
    hasChords: true,
    suggestedMoment: 'Adoração ao Santíssimo & Silêncio',
    lyrics: `[Intro] Em  C  G  D

Em                     C
Belíssimo esposo, o que tens que me encantas?
G                     D
O que tens que me atrai tanto assim?
Em                     C
Teu olhar me fascina, Tua voz me seduz
G                    D
Tua chaga me chama a viver Tua Cruz!

[Refrão]
Em             C
Não há amor maior que o Teu
G              D
Não há paz maior que estar aos Teus pés
Em             C
Toma minha vida, sou todo Teu
G              D
Belíssimo Esposo, meu Deus e meu Rei!`,
  },
  {
    id: 'song_2',
    title: 'Ao Teu Encontro',
    artist: 'Missionário Shalom',
    category: 'louvor',
    key: 'D',
    hasChords: true,
    suggestedMoment: 'Louvor Inicial Vibrante',
    lyrics: `[Intro] D  G  Bm  A

D
Eu quero estar diante de Ti
G
E celebrar a Tua vitória
Bm                        A
Pois tudo que sou se alegra em Tua presença!

[Refrão]
D
Vou correndo ao Teu encontro, Senhor!
G
Pois Tu és o meu abrigo de amor!
Bm                       A
Nada mais pode me separar de Ti!`,
  },
  {
    id: 'song_3',
    title: 'Rendido a Ti (Vem, Espírito Santo)',
    artist: 'Comunidade Católica Shalom',
    category: 'espirito_santo',
    key: 'G',
    hasChords: true,
    suggestedMoment: 'Efusão & Oração em Línguas',
    lyrics: `[Intro] G  D/F#  Em  C

G          D/F#          Em
Espírito Santo, sopra aqui neste lugar
           C                   G/B
Faz transbordar o Teu amor sem fim
        Am                 D
Cria em mim um coração novo!

[Refrão]
G                D/F#
Vem com Teu fogo, queima meu ser
Em               C
Rendido a Ti eu quero viver
G                D
Toma o controle, reina em mim!`,
  },
  {
    id: 'song_4',
    title: 'Consagrado por Amor',
    artist: 'Ministério de Música Shalom',
    category: 'mariano',
    key: 'A',
    hasChords: true,
    suggestedMoment: 'Oração Mariana Final',
    lyrics: `[Intro] A  E  F#m  D

A              E
Mãe da divina graça e da esperança
F#m            D
Sob o Teu manto coloco minha confiança
A               E
Consagro meus dias, minha juventude
F#m             D
Ensina-me a amar na Tua virtude!

[Refrão]
A            E
Totus Tuus, Maria!
F#m          D
Eu sou todo Teu!
A            E               D
Leva minha vida ao trono de Deus!`,
  },
  {
    id: 'song_5',
    title: 'Cântico à Santa Gemma Galgani',
    artist: 'Célula Santa Gemma',
    category: 'santa_gemma',
    key: 'C',
    hasChords: true,
    suggestedMoment: 'Padroeira da Célula & Intercessão',
    lyrics: `[Intro] C  G  Am  F

C            G
Flor de Lucca, joia da Cruz
Am           F
Com Teu anjo contemplaste a luz
C            G
Gemma tão pura, amante de Jesus
Am           F
Ensina a nossa célula a carregar a Cruz!

[Refrão]
C            G
Santa Gemma, noiva fiel
Am           F
Intercede por nós lá do Céu!
C            G
Inflama nossa alma de zelo e fervor
Am           F           C
Pra vivermos pra sempre no Teu Amor!`,
  },
  {
    id: 'song_6',
    title: 'Eis-me Aqui, Senhor',
    artist: 'Comunidade Shalom',
    category: 'louvor',
    key: 'E',
    hasChords: true,
    suggestedMoment: 'Ação de Graças & Ofertório',
    lyrics: `[Intro] E  B  C#m  A

E             B
Tudo que tenho pertence a Ti
C#m           A
Minha esperança, meu sim até o fim
E             B
Usa meu canto, usa minhas mãos
C#m           A
Para servir aos meus irmãos!

[Refrão]
E       B        C#m       A
Eis-me aqui, envia-me a mim!
E       B        A
Tua vontade é meu sim!`,
  },
  {
    id: 'song_7',
    title: 'Misericórdia Infinita (Perdão)',
    artist: 'Comunidade Católica Shalom',
    category: 'perdao',
    key: 'Dm',
    hasChords: true,
    suggestedMoment: 'Ato Penitencial & Reconciliação',
    lyrics: `[Intro] Dm  Bb  F  C

Dm             Bb
Senhor, tende piedade de nós
F              C
Cristo, tende piedade de nós
Dm             Bb
Senhor, ouve a nossa oração
F              C           Dm
Lava-nos com Teu Santo perdão!`,
  },
];

// ---- MÓDULO DIZIFY: MEMBROS CONTRIBUINTES, CAMPANHAS E DOAÇÕES ----
export const INITIAL_DONORS: DonorProfile[] = [
  { id: 'donor_47', name: 'Cristiane Alves Nunes de Oliveira', maritalStatus: 'Casada', leadershipBadge: '👑 Coordenadora, Admin & Formadora', birthDate: '26/01/1983', phone: '(85) 98225-0655', totalDonated: 300, donationsCount: 5, lastDonationAt: '05/10/2026 às 20:15', createdAt: '06/10/2026' },
  { id: 'donor_48', name: 'Francisco José de Oliveira', maritalStatus: 'Casado', leadershipBadge: '👑 Coordenador, Admin & Formador', birthDate: '25/10/1976', phone: '(85) 99843-3531', totalDonated: 300, donationsCount: 5, lastDonationAt: '05/10/2026 às 20:15', createdAt: '06/10/2026' },
  { id: 'donor_1', name: 'Messias Batista da Silva Júnior', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '16/01/1976', phone: '(85) 98174-2686', totalDonated: 240, donationsCount: 4, lastDonationAt: '01/10/2026 às 19:45', createdAt: '06/10/2026' },
  { id: 'donor_2', name: 'Aliomar Gabriel Oliveira', maritalStatus: 'Solteiro', leadershipBadge: 'Membro', birthDate: '12/03/1978', phone: '(85) 99109-7673', totalDonated: 180, donationsCount: 3, lastDonationAt: '03/10/2026 às 14:20', createdAt: '06/10/2026' },
  { id: 'donor_3', name: 'Alexandre de Oliveira da Silva', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '24/09/1971', phone: '(85) 98545-2394', totalDonated: 120, donationsCount: 2, lastDonationAt: '28/09/2026 às 21:10', createdAt: '06/10/2026' },
  { id: 'donor_4', name: 'Ana Regina Vieira de Brito', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '01/06/1989', phone: '(85) 98167-4077', totalDonated: 90, donationsCount: 2, lastDonationAt: '25/09/2026 às 18:05', createdAt: '06/10/2026' },
  { id: 'donor_5', name: 'Anna Karolinny de Sousa Araújo', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '15/12/2003', phone: '(85) 99658-2914', totalDonated: 50, donationsCount: 1, createdAt: '06/10/2026' },
  { id: 'donor_6', name: 'Bruno Gomes Linhares', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '07/05/1997', phone: '(85) 98717-2445', totalDonated: 60, donationsCount: 1, createdAt: '06/10/2026' },
  { id: 'donor_7', name: 'Clarissa Maria Rocha Freitas', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '08/08/2000', phone: '(85) 98648-6493', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_8', name: 'Daniele Vieira Araújo', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '04/05/1999', phone: '(86) 99924-7221', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_9', name: 'Edmar Ferreira de Sousa', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '19/05/1981', phone: '(85) 99152-7635', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_10', name: 'Edvandro Silveira Vasconcelos', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '30/12/1972', phone: '(85) 99731-3965', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_11', name: 'Fábio Gomes Mendes', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '27/05/1970', phone: '(85) 99111-4336', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_12', name: 'Francisca Markelly Caracas de Souza', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '27/10/1978', phone: '(85) 99921-3243', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_13', name: 'Francisco Marcelo Sales de Aquino', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '04/11/1980', phone: '(85) 99401-9746', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_14', name: 'Hozana Arruda da Costa Ferreira', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '08/02/1989', phone: '(85) 98745-0050', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_15', name: 'Iovany do Nascimento Veloso', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '30/07/1966', phone: '(85) 98581-2007', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_16', name: 'Isaac Souza Silva', maritalStatus: 'Solteiro', leadershipBadge: 'Membro', birthDate: '26/01/2001', phone: '(85) 98542-6672', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_17', name: 'Isac Silva Aguiar', maritalStatus: 'Casado', leadershipBadge: 'Membro', birthDate: '20/10/1976', phone: '(85) 99282-7219', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_18', name: 'Izabel Cristina Melo da Silva', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '21/10/1965', phone: '(85) 98867-4157', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_19', name: 'João Lucas Araújo do Nascimento', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '15/10/2002', phone: '(85) 99705-9690', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_20', name: 'Johnata Paulino de Oliveira', maritalStatus: 'Solteiro', leadershipBadge: 'Membro', birthDate: '22/04/1999', phone: '(85) 99122-9433', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_21', name: 'Juliana Martins Lima', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '05/04/1984', phone: '(85) 99223-0178', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_22', name: 'Lara Pereira Lima', maritalStatus: 'Solteira', leadershipBadge: 'Membro', birthDate: '10/03/2001', phone: '(85) 98640-9453', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_23', name: 'Larissa Rodrigues Pinheiro', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '29/06/1995', phone: '(85) 98823-5076', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_24', name: 'Lívia Maria Rodrigues Gomes', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '15/07/2002', phone: '(85) 98682-8027', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_25', name: 'Lucas de Oliveira Mesquita', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '27/08/2003', phone: '(85) 98926-3905', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_26', name: 'Lucianne Escóssio Lima', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '25/07/1989', phone: '(85) 99925-0390', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_27', name: 'Maria Auxiliadora Bezerra Barbosa', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '11/01/1964', phone: '(85) 98811-6662', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_28', name: 'Maria Cláudia Gomes Matias', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '23/04/1974', phone: '(85) 98957-8596', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_29', name: 'Maria Elizângela Macedo Lopes', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '02/04/1971', phone: '(85) 98131-3073', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_30', name: 'Maria Evelma de Freitas Silva', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '13/04/1978', phone: '(85) 99422-7152', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_31', name: 'Maria Ivonilde de Araújo Costa', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '10/03/1964', phone: '(85) 99657-6943', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_32', name: 'Maria Nivalda da Silva Mariano', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '21/11/1974', phone: '(85) 98759-4942', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_33', name: 'Maria Ramirtes Coelho Andrade', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '11/09/1966', phone: '(85) 98803-7622', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_34', name: 'Mariana Karine Mariano Rocha', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '05/01/2004', phone: '(85) 98543-3572', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_35', name: 'Nádia Karoline Tavares Bento', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '14/04/2000', phone: '(85) 98913-5307', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_36', name: 'Nara Mariana Moreno da Silva', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '15/06/1989', phone: '(85) 98405-7394', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_37', name: 'Rairon Silva dos Santos', maritalStatus: 'Solteiro', leadershipBadge: 'Membro', birthDate: '04/04/2002', phone: '(85) 98836-8907', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_38', name: 'Raquel Barbosa Gomes', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '07/02/1988', phone: '(85) 99225-4241', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_39', name: 'Renhiele Ribeiro Silva', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '21/03/1993', phone: '(85) 98639-9164', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_40', name: 'Roberta Brasil Gurgel Café', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '16/07/1965', phone: '(85) 98603-0231', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_41', name: 'Roberto Sócrates Gomes de Brito', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '16/05/2000', phone: '(85) 91942-9017', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_42', name: 'Sandra Alexandre do Nascimento Rebouças', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '16/04/1977', phone: '(85) 98409-6226', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_43', name: 'Shirlene Angelim de Albuquerque Veloso', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '01/07/1971', phone: '(85) 98758-2007', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_44', name: 'Suelane Cristina Ferreira de Oliveira', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '19/04/1983', phone: '(85) 98130-1106', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_45', name: 'Taciana Rodrigues Oliveira', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '20/02/1987', phone: '(85) 98799-3575', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
  { id: 'donor_46', name: 'Taynara Freitas de Sousa', maritalStatus: undefined, leadershipBadge: 'Membro', birthDate: '17/05/2002', phone: '(85) 98837-2574', totalDonated: 0, donationsCount: 0, createdAt: '06/10/2026' },
];

export const INITIAL_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'camp_1',
    title: 'Retiro de Semana Santa & Juventude Shalom',
    description: 'Fundo de bolsas para ajudar os jovens da célula que não têm condições de custear a inscrição e transporte do retiro.',
    goalAmount: 1500,
    currentAmount: 980,
    pixKey: 'shcelsantagemmagalganipql@gmail.com',
    deadline: '30/11/2026',
    category: 'retiro',
    active: true,
  },
  {
    id: 'camp_2',
    title: 'Ação Social Santa Gemma • Cestas Básicas',
    description: 'Arrecadação mensal para montagem de cestas básicas e kits de higiene destinados às famílias assistidas pela paróquia.',
    goalAmount: 800,
    currentAmount: 620,
    pixKey: 'shcelsantagemmagalganipql@gmail.com',
    deadline: '25/10/2026',
    category: 'acao_social',
    active: true,
  },
  {
    id: 'camp_3',
    title: 'Fundo da Célula • Ágape, Bíblias e Evangelização',
    description: 'Manutenção do material de formação, folhetos, velas para vigília e apoio ao lanche fraterno semanal.',
    goalAmount: 500,
    currentAmount: 360,
    pixKey: 'shcelsantagemmagalganipql@gmail.com',
    deadline: 'Contínuo',
    category: 'manutencao',
    active: true,
  },
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don_101',
    donorId: 'donor_47',
    donorName: 'Cristiane Alves Nunes de Oliveira',
    donorPhone: '(85) 98225-0655',
    amount: 100,
    type: 'comunhao_bens',
    campaignTitle: 'Oferta & Caixinha da Célula',
    status: 'paid',
    gateway: 'mercadopago',
    pixCopyPaste: '00020126570014br.gov.bcb.pix0135shcelsantagemmagalganipql@gmail.com5204000053039865406100.005802BR5918CELULA SANTA GEMMA6009SAO PAULO62120508SG1001016304A1B2',
    externalReference: 'MP_99481023',
    createdAt: '05/10/2026 às 20:14',
    paidAt: '05/10/2026 às 20:15',
    thankYouSent: true,
  },
  {
    id: 'don_102',
    donorId: 'donor_48',
    donorName: 'Francisco José de Oliveira',
    donorPhone: '(85) 99843-3531',
    amount: 100,
    type: 'campanha',
    campaignId: 'camp_1',
    campaignTitle: 'Retiro de Semana Santa & Juventude Shalom',
    status: 'paid',
    gateway: 'mercadopago',
    pixCopyPaste: '00020126570014br.gov.bcb.pix0135shcelsantagemmagalganipql@gmail.com520400005303986540560.005802BR5918CELULA SANTA GEMMA6009SAO PAULO62120508SG1001026304C3D4',
    externalReference: 'MP_99481024',
    createdAt: '05/10/2026 às 20:14',
    paidAt: '05/10/2026 às 20:15',
    thankYouSent: true,
  },
  {
    id: 'don_103',
    donorId: 'donor_1',
    donorName: 'Messias Batista da Silva Júnior',
    donorPhone: '(85) 98174-2686',
    amount: 80,
    type: 'campanha',
    campaignId: 'camp_2',
    campaignTitle: 'Ação Social Santa Gemma • Cestas Básicas',
    status: 'paid',
    gateway: 'asaas',
    pixCopyPaste: '00020126570014br.gov.bcb.pix0135shcelsantagemmagalganipql@gmail.com520400005303986540580.005802BR5918CELULA SANTA GEMMA6009SAO PAULO62120508SG1001036304E5F6',
    externalReference: 'ASAAS_882190',
    createdAt: '01/10/2026 às 19:44',
    paidAt: '01/10/2026 às 19:45',
    thankYouSent: true,
  },
];


