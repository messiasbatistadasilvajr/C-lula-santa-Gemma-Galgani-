import { 
  UserProfile, 
  CommunityPost, 
  PrayerIntention, 
  CalendarEvent, 
  ChatMessage, 
  ChatChannel, 
  GalleryAlbum, 
  FormationItem,
  CellNotice 
} from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Lucas Silveira',
    email: 'lucas.silveira@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'membro',
    birthday: '14 de Outubro',
    ministry: 'Ministério de Música & Intercessão',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Março de 2023',
    phone: '(11) 98765-4321',
    bio: 'Jovem em caminho vocacional na Comunidade Católica Shalom. Apaixonado pela Cruz e pela intercessão.',
  },
  {
    id: 'user_2',
    name: 'Ir. Maria Clara',
    email: 'maria.clara@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'formador',
    birthday: '03 de Maio',
    ministry: 'Formação & Acompanhamento Pessoal',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Fevereiro de 2021',
    phone: '(11) 97654-3210',
    bio: 'Consagrada da Comunidade de Aliança Shalom, servindo como formadora da célula.',
  },
  {
    id: 'user_3',
    name: 'Gabriel Santos',
    email: 'gabriel.santos@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    birthday: '22 de Agosto',
    ministry: 'Coordenação Geral da Célula',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Janeiro de 2020',
    phone: '(11) 99123-4567',
    bio: 'Coordenador da célula Santa Gemma. Discípulo da Comunidade de Aliança.',
  },
  {
    id: 'user_4',
    name: 'Sara Albuquerque',
    email: 'sara.albuquerque@shalom.org',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'membro',
    birthday: '19 de Dezembro',
    ministry: 'Ministério de Acolhida & Liturgia',
    cellName: 'Célula Santa Gemma Galgani',
    joinedDate: 'Junho de 2023',
    phone: '(11) 98111-2233',
    bio: 'Serva na liturgia e acolhimento dos novos membros.',
  },
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorId: 'user_2',
    authorName: 'Ir. Maria Clara',
    authorRole: 'formador',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    type: 'reflexao',
    title: 'A Cruz é a Cátedra do Amor de Deus',
    content: 'Hoje rezando com os escritos de Santa Gemma, ela nos recorda: "Se desejas verdadeiramente amar a Jesus, aprende primeiro a sofrer por Ele". Que na nossa caminhada de célula possamos abraçar cada pequena renúncia como uma flor oferecida ao Coração Eucarístico do Senhor.',
    tag: 'Reflexão Espiritual',
    createdAt: 'Hoje às 14:30',
    likesCount: 14,
    hasLiked: true,
    commentsCount: 3,
    comments: [
      {
        id: 'c_1',
        authorId: 'user_1',
        authorName: 'Lucas Silveira',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Amém, irmã! Palavra muito oportuna para o meu dia de hoje.',
        createdAt: 'Hoje às 15:10',
      },
      {
        id: 'c_2',
        authorId: 'user_3',
        authorName: 'Gabriel Santos',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Shalom! Vamos aprofundar esse tema no nosso encontro de quinta.',
        createdAt: 'Hoje às 16:05',
      },
    ],
  },
  {
    id: 'post_2',
    authorId: 'user_3',
    authorName: 'Gabriel Santos',
    authorRole: 'admin',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'aviso',
    title: 'Encontro da Célula nesta Quinta-feira',
    content: 'Paz e Bem, irmãos! Lembramos que nesta quinta-feira nosso encontro de célula será pontualmente às 20h na minha casa. Teremos a continuidade da formação e partilha fraterna. A escala do lanche é da Sara e do Mateus!',
    tag: 'Aviso da Coordenação',
    createdAt: 'Ontem às 19:15',
    likesCount: 18,
    hasLiked: false,
    commentsCount: 2,
    comments: [
      {
        id: 'c_3',
        authorId: 'user_4',
        authorName: 'Sara Albuquerque',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Confirmadíssimo! Já preparando o bolo com muito carinho.',
        createdAt: 'Ontem às 20:00',
      },
    ],
  },
  {
    id: 'post_3',
    authorId: 'user_4',
    authorName: 'Sara Albuquerque',
    authorRole: 'membro',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'testemunho',
    title: 'Testemunho de Cura Interior no Retiro',
    content: 'Quero partilhar com os irmãos a imensa gratidão ao Senhor. No retiro do último mês, durante a adoração ao Santíssimo, o Senhor curou uma ferida antiga de rejeição que eu carregava. A oração comunitária da célula foi decisiva nesse processo.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    tag: 'Testemunho',
    createdAt: 'Há 2 dias',
    likesCount: 26,
    hasLiked: true,
    commentsCount: 5,
    comments: [],
  },
  {
    id: 'post_4',
    authorId: 'user_1',
    authorName: 'Lucas Silveira',
    authorRole: 'membro',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    type: 'momento',
    title: 'Noite de Louvor e Adoração da Célula',
    content: 'Registro da nossa vigília de adoração na capela Shalom. Momentos de profunda comunhão, intercessão e presença do Ressuscitado que passou pela Cruz.',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
    tag: 'Momento da Célula',
    createdAt: 'Há 3 dias',
    likesCount: 22,
    hasLiked: true,
    commentsCount: 1,
    comments: [],
  },
];

export const INITIAL_PRAYERS: PrayerIntention[] = [
  {
    id: 'prayer_1',
    authorId: 'user_4',
    authorName: 'Sara Albuquerque',
    authorRole: 'membro',
    category: 'familia',
    content: 'Peço oração pela minha família, em especial pela reconciliação entre meu pai e meu irmão que estão sem se falar há meses.',
    prayerCount: 19,
    userPrayed: true,
    createdAt: 'Hoje às 09:12',
    urgent: true,
  },
  {
    id: 'prayer_2',
    authorId: 'user_1',
    authorName: 'Lucas Silveira',
    authorRole: 'membro',
    category: 'saude',
    content: 'Intenção pela saúde da minha tia Carmelita, que passará por uma cirurgia cardíaca delicada nesta sexta-feira.',
    prayerCount: 27,
    userPrayed: false,
    createdAt: 'Ontem às 18:40',
    urgent: true,
  },
  {
    id: 'prayer_3',
    authorId: 'user_2',
    authorName: 'Ir. Maria Clara',
    authorRole: 'formador',
    category: 'vocacional',
    content: 'Pelos postulantes e vocacionados da nossa missão de São Paulo, para que tenham coragem de dar o Sim generoso ao Carisma Shalom.',
    prayerCount: 34,
    userPrayed: true,
    createdAt: 'Há 2 dias',
    urgent: false,
  },
  {
    id: 'prayer_4',
    authorId: 'user_3',
    authorName: 'Gabriel Santos',
    authorRole: 'admin',
    category: 'trabalho',
    content: 'Pela providência profissional e financeira de um irmão da nossa célula que perdeu o emprego recentemente.',
    prayerCount: 15,
    userPrayed: false,
    createdAt: 'Há 3 dias',
    urgent: false,
  },
  {
    id: 'prayer_5',
    authorId: 'user_1',
    authorName: 'Lucas Silveira',
    authorRole: 'membro',
    category: 'espiritual',
    content: 'Em ação de graças pela fidelidade na oração pessoal diária e por perseverança no Estudo Bíblico.',
    prayerCount: 12,
    userPrayed: true,
    createdAt: 'Há 4 dias',
    answered: true,
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_1',
    title: 'Encontro Semanal da Célula',
    type: 'encontro',
    date: '2026-09-24', // Quinta-feira
    time: '20:00',
    location: 'Casa do Gabriel (Rua das Palmeiras, 142)',
    description: 'Encontro ordinário da Célula Santa Gemma Galgani. Louvor comunitário, oração de escuta, formação do Caminho da Paz e partilha.',
    leader: 'Gabriel Santos',
    rsvpStatus: 'attending',
    attendingCount: 9,
    maybeCount: 2,
    declinedCount: 0,
    scaleRoles: [
      { role: 'Animação e Louvor', personName: 'Lucas Silveira' },
      { role: 'Liturgia da Palavra', personName: 'Sara Albuquerque' },
      { role: 'Lanche Comunitário', personName: 'Sara e Mateus' },
    ],
  },
  {
    id: 'evt_2',
    title: 'Missa da Aliança & Envio Shalom',
    type: 'missa',
    date: '2026-09-26', // Sábado
    time: '18:00',
    location: 'Centro de Evangelização Shalom',
    description: 'Santa Missa mensal de Aliança com toda a obra e renovação do compromisso apostólico.',
    leader: 'Pe. André (Assistente Eclesiástico)',
    rsvpStatus: 'attending',
    attendingCount: 14,
    maybeCount: 1,
    declinedCount: 0,
  },
  {
    id: 'evt_3',
    title: 'Noite de Formação: Vida e Mística de Santa Gemma',
    type: 'formacao',
    date: '2026-09-29', // Terça-feira
    time: '19:30',
    location: 'Salão Paroquial São Gabriel',
    description: 'Formação especial aberta sobre a espiritualidade da Cruz e a convivência mística com o Anjo da Guarda em Santa Gemma Galgani.',
    leader: 'Ir. Maria Clara',
    rsvpStatus: null,
    attendingCount: 8,
    maybeCount: 3,
    declinedCount: 1,
  },
  {
    id: 'evt_4',
    title: 'Retiro Semestral da Célula: "Permanecei em Mim"',
    type: 'retiro',
    date: '2026-10-10',
    time: '08:00',
    location: 'Recanto São José - Mairiporã',
    description: 'Retiro fechado da nossa célula para aprofundamento da vida de oração, deserto, Sacramento da Reconciliação e fraternidade.',
    leader: 'Gabriel Santos e Formadores',
    rsvpStatus: 'maybe',
    attendingCount: 11,
    maybeCount: 4,
    declinedCount: 0,
    scaleRoles: [
      { role: 'Equipe de Intercessão', personName: 'Sara e Lucas' },
      { role: 'Liturgia e Capela', personName: 'Ir. Maria Clara' },
    ],
  },
  {
    id: 'evt_5',
    title: 'Vigília Jovem Shalom & Adoração Contínua',
    type: 'evento',
    date: '2026-10-16',
    time: '22:00',
    location: 'Capela do Santíssimo Sacramento',
    description: 'Vigília durante toda a madrugada com adoração ao Santíssimo, Santo Rosário e louvor silencioso.',
    leader: 'Ministério Jovem',
    rsvpStatus: null,
    attendingCount: 6,
    maybeCount: 2,
    declinedCount: 2,
  },
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan_geral',
    name: 'Célula Santa Gemma (Geral)',
    description: 'Canal oficial de partilha fraterna e avisos da célula',
    unreadCount: 2,
    lastMessage: {
      text: 'Amém irmãos! Quinta estaremos todos reunidos.',
      timestamp: '17:42',
      sender: 'Sara Albuquerque',
    },
  },
  {
    id: 'chan_intercessao',
    name: 'Ministério de Intercessão',
    description: 'Canal de oração contínua pelas intenções urgentes',
    unreadCount: 0,
    lastMessage: {
      text: 'Rezei o terço pela intenção da família do Lucas hoje cedo.',
      timestamp: '11:15',
      sender: 'Ir. Maria Clara',
    },
  },
  {
    id: 'chan_lideranca',
    name: 'Coordenação & Formação',
    description: 'Planejamento dos encontros e acompanhamentos',
    unreadCount: 0,
    lastMessage: {
      text: 'Roteiro de formação de quinta enviado para revisão.',
      timestamp: 'Ontem',
      sender: 'Gabriel Santos',
    },
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  chan_geral: [
    {
      id: 'm_1',
      channelId: 'chan_geral',
      senderId: 'user_3',
      senderName: 'Gabriel Santos',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Paz e Bem a todos! Lembrando de confirmar presença no evento de quinta aqui no aplicativo.',
      timestamp: '16:30',
      isMine: false,
    },
    {
      id: 'm_2',
      channelId: 'chan_geral',
      senderId: 'user_2',
      senderName: 'Ir. Maria Clara',
      senderRole: 'formador',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      text: 'Shalom queridos! Na formação vamos meditar um trecho lindo do diário de Santa Gemma.',
      timestamp: '16:55',
      isMine: false,
    },
    {
      id: 'm_3',
      channelId: 'chan_geral',
      senderId: 'user_1',
      senderName: 'Lucas Silveira',
      senderRole: 'membro',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Já preparei as canções de louvor para o início do nosso encontro! Vai ser uma graça.',
      timestamp: '17:15',
      isMine: true,
    },
    {
      id: 'm_4',
      channelId: 'chan_geral',
      senderId: 'user_4',
      senderName: 'Sara Albuquerque',
      senderRole: 'membro',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: 'Amém irmãos! Quinta estaremos todos reunidos.',
      timestamp: '17:42',
      isMine: false,
    },
  ],
  chan_intercessao: [
    {
      id: 'm_201',
      channelId: 'chan_intercessao',
      senderId: 'user_1',
      senderName: 'Lucas Silveira',
      senderRole: 'membro',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Irmãos, intercedendo pela cirurgia da minha tia na sexta-feira. Deus abençoe quem puder se unir às 15h.',
      timestamp: '08:00',
      isMine: true,
    },
    {
      id: 'm_202',
      channelId: 'chan_intercessao',
      senderId: 'user_2',
      senderName: 'Ir. Maria Clara',
      senderRole: 'formador',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      text: 'Rezei o terço pela intenção da família do Lucas hoje cedo.',
      timestamp: '11:15',
      isMine: false,
    },
  ],
  chan_lideranca: [
    {
      id: 'm_301',
      channelId: 'chan_lideranca',
      senderId: 'user_3',
      senderName: 'Gabriel Santos',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Roteiro de formação de quinta enviado para revisão.',
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
        caption: 'Adoração ao Santíssimo no Recanto São José',
        date: '15/02/2026',
        author: 'Sara Albuquerque',
      },
      {
        id: 'p_2',
        url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
        caption: 'Oração comunitária ao ar livre',
        date: '15/02/2026',
        author: 'Gabriel Santos',
      },
      {
        id: 'p_3',
        url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop&q=80',
        caption: 'Almoço fraterno de encerramento do retiro',
        date: '16/02/2026',
        author: 'Lucas Silveira',
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
        author: 'Gabriel Santos',
      },
      {
        id: 'p_5',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
        caption: 'Momento de acolhimento e partilha dos irmãos',
        date: '12/03/2026',
        author: 'Ir. Maria Clara',
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
        caption: 'Comemoração dos aniversariantes do trimestre',
        date: '20/02/2026',
        author: 'Sara Albuquerque',
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
        author: 'Ir. Maria Clara',
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
    content: 'As inscrições para o Recanto São José já estão abertas. Por favor confirmem no aplicativo e conversem com o Gabriel sobre a taxa de hospedagem e transporte solidário.',
    priority: 'alta',
    category: 'Eventos',
    date: '21/09/2026',
    author: 'Gabriel Santos (Coordenação)',
  },
  {
    id: 'not_2',
    title: 'Arrecadação de Alimentos para a Promoção Humana',
    content: 'Neste mês nossa célula adotou a arrecadação de 20kg de arroz e feijão para a Casa São Francisco de Assis. Tragam as doações no encontro de quinta!',
    priority: 'alta',
    category: 'Solidariedade',
    date: '20/09/2026',
    author: 'Sara Albuquerque (Acolhida)',
  },
  {
    id: 'not_3',
    title: 'Caderno de Formação do Caminho da Paz',
    content: 'Os novos cadernos da fase Filoteia já estão disponíveis na livraria Shalom para os irmãos que iniciaram o novo módulo.',
    priority: 'normal',
    category: 'Formação',
    date: '18/09/2026',
    author: 'Ir. Maria Clara (Formadora)',
  },
];

// ---- ESCALAS DE SERVIÇO & ROTEIRO DO ENCONTRO ----
import { MeetingScale, DailyLiturgy, SaintOfDay, CellSong } from '../types';

export const INITIAL_SCALES: MeetingScale[] = [
  {
    id: 'scale_1',
    meetingDate: 'Quinta-feira, 26 de Setembro • 19:30',
    theme: 'O Amor Apaixonado pelo Crucificado e a Vida de Oração',
    formador: 'Ir. Maria Clara',
    animator: 'Gabriel Santos (Coordenação)',
    musicLeader: 'Lucas Silveira & Matheus',
    welcomeLeader: 'Sara Albuquerque & Rafael',
    snackLeader: 'Mariana & Lucas',
    intercessionLeader: 'Beatriz Lima (Intercessão prévia às 19h)',
    notes: 'Favor chegar 15 minutos antes para a oração preparatória da equipe de serviço. Trazer a Bíblia e o caderno de formação.',
    roteiro: [
      {
        id: 'rot_1',
        timeEstimate: '19:30 (10 min)',
        title: 'Acolhida Fraterna & Recepção',
        description: 'Recepção calorosa de cada irmão na porta, abraço da paz, acomodação e entrega dos folhetos de cânticos.',
        leader: 'Sara Albuquerque',
      },
      {
        id: 'rot_2',
        timeEstimate: '19:40 (25 min)',
        title: 'Louvor Vibrante & Cânticos Espirituais',
        description: 'Louvor vocal entusiasmado, ação de graças pelas vitórias da semana, cântico em línguas e efusão do Espírito Santo.',
        leader: 'Lucas Silveira & Gabriel',
      },
      {
        id: 'rot_3',
        timeEstimate: '20:05 (15 min)',
        title: 'Escuta da Palavra & Oração Comunitária',
        description: 'Momento de recolhimento, silêncio sagrado, profecia, raciocínio de fé e oração fraterna uns pelos outros.',
        leader: 'Gabriel Santos',
      },
      {
        id: 'rot_4',
        timeEstimate: '20:20 (30 min)',
        title: 'Formação do Caminho da Paz & Partilha',
        description: 'Ensino da palavra com tema do módulo e espaço para 3 ou 4 testemunhos de aplicação concreta na rotina pessoal.',
        leader: 'Ir. Maria Clara',
      },
      {
        id: 'rot_5',
        timeEstimate: '20:50 (20 min)',
        title: 'Avisos da Célula & Ágape Fraterno',
        description: 'Avisos da coordenação, bênção da mesa com partilha do lanche e fraternidade entre os irmãos.',
        leader: 'Mariana & Gabriel',
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

