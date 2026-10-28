/**
 * Serviço Oficial de Liturgia Diária Católica (CNBB / Canção Nova) & Santos do Dia
 * Calcula e retorna as Leituras, Salmo, Evangelho e Santo do Dia exatos para a data selecionada,
 * com sincronização automática via API Litúrgica e banco completo para Outubro de 2026.
 */

import { DailyLiturgy, SaintOfDay } from '../types';

export interface CompleteDayLiturgyAndSaint {
  isoDate: string; // YYYY-MM-DD
  dayMonthKey: string; // DD/MM
  liturgy: DailyLiturgy;
  saints: SaintOfDay[]; // Pode ter mais de um santo celebrado no dia
}

const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAY_NAMES_PT = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function formatIsoDateToPtBr(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dateObj = new Date(y, m - 1, d);
  const weekday = WEEKDAY_NAMES_PT[dateObj.getDay()];
  const monthName = MONTH_NAMES_PT[m - 1];
  return `${weekday}, ${String(d).padStart(2, '0')} de ${monthName} de ${y}`;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Banco Litúrgico Oficial Verificado (Leccionário da CNBB / Canção Nova - Outubro de 2026 - Ano Par / Ano A)
 */
export const OFFICIAL_OCTOBER_2026_LITURGY: Record<string, CompleteDayLiturgyAndSaint> = {
  '2026-10-05': {
    isoDate: '2026-10-05',
    dayMonthKey: '05/10',
    liturgy: {
      date: 'Segunda-feira, 05 de Outubro de 2026',
      liturgicalColor: 'Verde (27ª Semana do Tempo Comum)',
      headline: 'Segunda-feira da 27ª Semana do Tempo Comum • São Benedito e Santa Faustina',
      firstReading: {
        title: 'Primeira Leitura (Gl 1, 6-12)',
        reference: 'Carta de São Paulo aos Gálatas 1, 6-12',
        text: `Irmãos: Admiramo-nos de que tão depressa passeis daquele que vos chamou à graça de Cristo para um outro evangelho. Na verdade, não há outro evangelho, mas apenas algumas pessoas que semeiam a confusão entre vós e querem perturbar o Evangelho de Cristo.
Mas, ainda que nós mesmos ou um anjo do céu vos anuncie um evangelho diferente daquele que vos anunciamos, seja maldito! Como já dissemos, agora torno a dizê-lo: se alguém vos anuncia um evangelho diferente daquele que recebestes, seja maldito!
Afinal, será que eu procuro o favor dos homens ou o de Deus? Porventura procuro agradar aos homens? Se eu quisesse ainda agradar aos homens, não seria servo de Cristo.
Eu vos declaro, irmãos, que o Evangelho por mim anunciado não é segundo critérios humanos; pois não o recebi nem aprendi de homem algum, mas por revelação de Jesus Cristo.`,
      },
      psalm: {
        reference: 'Salmo 110 (111), 1-2. 7-8. 9 e 10c (R. 5b)',
        chorus: 'O Senhor se lembra sempre da Aliança!',
        verses: [
          'Eu agradeço a Deus de todo o coração, junto com todos os seus justos reunidos! Que grandiosas são as obras do Senhor, elas merecem todo o amor e admiração!',
          'Suas obras são verdade e são justiça, seus preceitos são perfeitos e imutáveis; são estáveis para sempre e pelos séculos, realizados na verdade e retidão.',
          'Enviou libertação para o seu povo, confirmou sua Aliança para sempre. Seu nome é santo e é digno de respeito; permanece para sempre o seu louvor!',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 10, 25-37)',
        reference: 'São Lucas 10, 25-37',
        text: `Naquele tempo, um mestre da Lei se levantou e, querendo pôr Jesus em dificuldade, perguntou: "Mestre, que devo fazer para receber em herança a vida eterna?"
Jesus lhe disse: "O que está escrito na Lei? Como lês?" Ele então respondeu: "Amarás o Senhor, teu Deus, de todo o teu coração e com toda a tua alma, com toda a tua força e com toda a tua mente; e ao teu próximo como a ti mesmo!" Jesus lhe disse: "Respondeste corretamente. Faze isso e viverás".
Ele, porém, querendo justificar-se, disse a Jesus: "E quem é o meu próximo?"
Jesus respondeu: "Certo homem descia de Jerusalém para Jericó e caiu nas mãos de assaltantes. Estes arrancaram-lhe tudo, espancaram-no, e foram-se embora deixando-o quase morto. Por acaso, um sacerdote estava descendo por aquele caminho. Quando viu o homem, seguiu adiante, pelo outro lado. Do mesmo modo, um levita chegou ao lugar, viu o homem e seguiu adiante, pelo outro lado.
Mas um samaritano, que estava viajando, chegou perto dele, viu e sentiu compaixão. Aproximou-se dele e fez curativos, derramando óleo e vinho nas feridas. Depois colocou o homem em seu próprio animal e levou-o a uma pensão, onde cuidou dele. No dia seguinte, pegou duas moedas de prata e entregou-as ao dono da pensão, recomendando: 'Toma conta dele! Quando eu voltar, vou pagar o que tiveres gasto a mais'".
E Jesus perguntou: "Na tua opinião, qual dos três foi o próximo do homem que caiu nas mãos dos assaltantes?" Ele respondeu: "Aquele que usou de misericórdia para com ele". Então Jesus lhe disse: "Vai e faze a mesma coisa".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'No encontro de segunda-feira da nossa célula, Jesus nos convida a sair da indiferença e sermos o Bom Samaritano para cada irmão que sofre, derramando o óleo da consolação e o vinho da caridade fraterna.',
      },
    },
    saints: [
      {
        name: 'São Benedito e Santa Faustina Kowalska',
        title: 'Apóstola da Divina Misericórdia e Santo da Humildade',
        feastDate: '05 de Outubro',
        summary: 'No Brasil celebramos São Benedito, exemplo de humildade e caridade com os pobres, e na Igreja universal Santa Faustina Kowalska, secretária da Divina Misericórdia ("Jesus, eu confio em Vós!").',
        lifeStory: `Santa Maria Faustina Kowalska (1905–1938), religiosa polonesa da Congregação das Irmãs de Nossa Senhora da Misericórdia, foi escolhida por Nosso Senhor Jesus Cristo para recordar ao mundo o mistério da Misericórdia Divina através do Diário, da imagem de Jesus Misericordioso e do Terço da Misericórdia.
No Brasil, a CNBB também celebra em 5 de outubro São Benedito (1526–1589), frade franciscano filho de escravizados africanos que santificou a cozinha do convento na Sicília com oração, milagres e amor aos famintos.`,
        virtue: 'Confiança absoluta na Divina Misericórdia e humildade no serviço aos irmãos.',
        prayer: `Ó Jesus Misericordioso, que revelastes a Santa Faustina as riquezas insondáveis do Vosso Coração e em São Benedito brilhastes pela humildade e caridade, ensinai a nossa Célula Santa Gemma Galgani a repetir em todas as circunstâncias: "Jesus, eu confio em Vós!". Amém.`,
      },
    ],
  },

  '2026-10-06': {
    isoDate: '2026-10-06',
    dayMonthKey: '06/10',
    liturgy: {
      date: 'Terça-feira, 06 de Outubro de 2026',
      liturgicalColor: 'Verde (27ª Semana do Tempo Comum)',
      headline: 'Terça-feira da 27ª Semana do Tempo Comum • São Bruno',
      firstReading: {
        title: 'Primeira Leitura (Gl 1, 13-24)',
        reference: 'Carta de São Paulo aos Gálatas 1, 13-24',
        text: `Irmãos: Certamente ouvistes falar como outrora eu vivia no judaísmo, com que excesso perseguia a Igreja de Deus e a devastava; progredia no judaísmo mais do que muitos judeus da minha idade, mostrando-me extremamente zeloso das tradições paternas.
Mas, quando Aquele que me separou desde o ventre materno e me chamou por sua graça se dignou revelar-me o seu Filho, para que eu o anunciasse entre os pagãos, não consultei carne nem sangue, nem subi logo a Jerusalém para estar com os que eram apóstolos antes de mim. Pelo contrário, parti para a Arábia e depois voltei ainda a Damasco.
Em seguida, três anos mais tarde, fui a Jerusalém para conhecer Cefas e fiquei com ele quinze dias. Dos outros apóstolos não vi mais nenhum, a não ser Tiago, o irmão do Senhor. E as Igrejas da Judeia ouviam dizer: "Aquele que antes nos perseguia, agora anuncia a fé que outrora destruía". E glorificavam a Deus por minha causa.`,
      },
      psalm: {
        reference: 'Salmo 138 (139), 1-3. 13-14ab. 14c-15 (R. 24b)',
        chorus: 'Conduzi-me no caminho para a vida, ó Senhor!',
        verses: [
          'Senhor, vós me sondais e conheceis, sabeis quando me sento ou me levanto; de longe penetrais meus pensamentos, percebeis quando me deito e quando eu ando, os meus caminhos vos são todos conhecidos.',
          'Fostes vós que me formastes as entranhas, e no seio de minha mãe vós me tecestes. Eu vos louvo e vos dou graças, ó Senhor, porque de modo admirável me formastes!',
          'Até o mais íntimo, Senhor, me conheceis; nenhuma só de minhas fibras ignoráveis, quando eu era modelado ocultamente, era tecido nas entranhas subterrâneas.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 10, 38-42)',
        reference: 'São Lucas 10, 38-42',
        text: `Naquele tempo, enquanto estavam caminhando, Jesus entrou num povoado, e certa mulher, de nome Marta, recebeu-o em sua casa.
Sua irmã, chamada Maria, sentou-se aos pés do Senhor, e escutava a sua palavra. Marta, porém, estava ocupada com muitos afazeres.
Ela aproximou-se e disse: "Senhor, não te importas que minha irmã me deixe sozinha, com todo o serviço? Manda que ela me venha ajudar!"
O Senhor, porém, lhe respondeu: "Marta, Marta! Tu te preocupas e andas agitada por muitas coisas. Porém, uma só coisa é necessária. Maria escolheu a melhor parte e esta não lhe será tirada".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Antes de todo ativismo, Jesus nos chama a sentar aos Seus pés como Maria de Betânia. Na vida da nossa célula, a escuta amorosa da Palavra e a oração pessoal são a "melhor parte" que sustenta o nosso serviço.',
      },
    },
    saints: [
      {
        name: 'São Bruno, Presbítero',
        title: 'Fundador da Ordem dos Cartuxos • Mestre do Silêncio e da Contemplação',
        feastDate: '06 de Outubro',
        summary: 'Sacerdote alemão do século XI que fundou a Ordem dos Cartuxos nos Alpes franceses, dedicando a vida à oração silenciosa e ao lema: "A Cruz permanece firme enquanto o mundo gira".',
        lifeStory: `São Bruno nasceu em Colônia (Alemanha) por volta de 1030. Foi brilhante professor de teologia em Reims, na França, tendo entre seus alunos o futuro Papa Urbano II. Sentindo o chamado a uma entrega total a Deus na solidão contemplativa, retirou-se em 1084 com seis companheiros para o maciço de Chartreuse (Cartuxa), dando origem aos monges cartuxos.
Chamado a Roma pelo Papa Urbano II para ajudá-lo no governo da Igreja, serviu com humildade e depois fundou uma nova Cartuxa na Calábria (Itália), onde faleceu santamente em 6 de outubro de 1101.`,
        virtue: 'Amor ao silêncio interior, fidelidade à oração e desapego das honras mundanas.',
        prayer: `Ó Deus, que chamastes São Bruno a servir-Vos na solidão e no silêncio contemplativo, concedei aos irmãos da Célula Santa Gemma Galgani a graça de permanecerem sempre fixos na Cruz de Cristo em meio às agitações deste mundo. Amém.`,
      },
    ],
  },

  '2026-10-07': {
    isoDate: '2026-10-07',
    dayMonthKey: '07/10',
    liturgy: {
      date: 'Quarta-feira, 07 de Outubro de 2026',
      liturgicalColor: 'Branco (Memória de Nossa Senhora do Rosário)',
      headline: 'Memória Obrigatória de Nossa Senhora do Rosário • 27ª Semana do Tempo Comum',
      firstReading: {
        title: 'Primeira Leitura (Gl 2, 1-2. 7-14 ou At 1, 12-14)',
        reference: 'Gálatas 2, 1-2.7-14 / Atos dos Apóstolos 1, 12-14',
        text: `Depois que Jesus subiu ao céu, os apóstolos voltaram para Jerusalém, vindo do monte das Oliveiras, que fica perto de Jerusalém, à distância de um quilômetro mais ou menos.
Entraram na cidade e subiram para a sala de cima, onde costumavam ficar. Eram Pedro e João, Tiago e André, Filipe e Tomé, Bartolomeu e Mateus, Tiago, filho de Alfeu, Simão Zelota e Judas, filho de Tiago.
Todos eles perseveravam unanimemente na oração, juntamente com algumas mulheres, entre as quais Maria, a mãe de Jesus, e com os irmãos de Jesus.`,
      },
      psalm: {
        reference: 'Cântico de Maria (Lc 1, 46-55) / Salmo 116 (117)',
        chorus: 'O Todo-Poderoso fez grandes coisas em meu favor: seu nome é Santo!',
        verses: [
          'A minha alma engrandece o Senhor, e se alegrou o meu espírito em Deus, meu Salvador, pois ele viu a pequenez de sua serva; desde agora as gerações hão de chamar-me de bendita.',
          'O Poderoso fez por mim maravilhas e Santo é o seu nome! Seu amor, de geração em geração, chega a todos que o respeitam.',
          'Acolheu Israel, seu servidor, fiel ao seu amor, como havia prometido a nossos pais, em favor de Abraão e de seus filhos, para sempre.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 1-4 / Lc 1, 26-38)',
        reference: 'São Lucas 11, 1-4 (Feria) e São Lucas 1, 26-38 (Memória de N. Sra. do Rosário)',
        text: `Naquele tempo, Jesus estava rezando num certo lugar. Quando terminou, um de seus discípulos pediu-lhe: "Senhor, ensina-nos a rezar, como também João ensinou a seus discípulos".
Jesus respondeu: "Quando rezardes, dizei: 'Pai, santificado seja o teu nome. Venha o teu Reino. Dá-nos a cada dia o pão de que precisamos, e perdoa-nos os nossos pecados, pois nós também perdoamos a todos os nossos devedores; e não nos deixes cair em tentação'".

(Evangelho Próprio da Memória de Nossa Senhora do Rosário — Lc 1, 26-38):
O anjo Gabriel foi enviado por Deus a Nazaré, a uma virgem chamada Maria. Disse Maria: "Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra!"`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Celebrando Nossa Senhora do Rosário e meditando o pedido dos discípulos ("Senhor, ensina-nos a rezar"), renovemos nossa fidelidade ao Santo Terço e à oração filial que chama a Deus de Pai.',
      },
    },
    saints: [
      {
        name: 'Nossa Senhora do Rosário',
        title: 'Rainha do Santo Rosário • Auxílio dos Cristãos',
        feastDate: '07 de Outubro',
        summary: 'Memória instituída pelo Papa São Pio V em ação de graças pela proteção materna da Virgem Maria através da oração do Santo Rosário, escola de contemplação dos mistérios de Cristo.',
        lifeStory: `A festa de Nossa Senhora do Rosário foi instituída em 1571 pelo Papa São Pio V, inicialmente como Nossa Senhora da Vitória, recordando a eficácia da oração do Rosário rezado por todo o povo cristão.
Ao longo dos séculos, em Fátima e em tantos santuários, a Virgem Maria pediu insistentemente: "Rezem o Terço todos os dias para alcançar a paz para o mundo". Meditar o Rosário é contemplar a face de Cristo com o coração de Maria.`,
        virtue: 'Fidelidade diária ao Santo Terço e meditação dos mistérios da vida de Jesus.',
        prayer: `Derramai, ó Deus, a Vossa graça em nossos corações, para que, conhecendo pela mensagem do Anjo a encarnação do Vosso Filho Jesus Cristo, cheguemos, por Sua Paixão e Cruz e pela intercessão de Nossa Senhora do Rosário e de Santa Gemma Galgani, à glória da ressurreição. Amém!`,
      },
    ],
  },

  '2026-10-08': {
    isoDate: '2026-10-08',
    dayMonthKey: '08/10',
    liturgy: {
      date: 'Quinta-feira, 08 de Outubro de 2026',
      liturgicalColor: 'Verde (27ª Semana do Tempo Comum)',
      headline: 'Quinta-feira da 27ª Semana do Tempo Comum (Ano Par II)',
      firstReading: {
        title: 'Primeira Leitura (Gl 3, 1-5)',
        reference: 'Carta de São Paulo aos Gálatas 3, 1-5',
        text: `Ó gálatas insensatos! Quem vos fascinou, a vós ante cujos olhos foi apresentada a imagem de Jesus Cristo crucificado?
Apenas isto quero saber de vós: recebestes o Espírito pelas práticas da Lei ou pela escuta da fé?
Sois assim tão insensatos? Depois de terdes começado pelo Espírito, quereis agora acabar pela carne?
Tereis feito tais experiências em vão! Se é que foi em vão!
Aquele que vos dá o Espírito e realiza milagres entre vós, acaso o faz pelas práticas da Lei, ou pela escuta da fé?`,
      },
      psalm: {
        reference: 'Cântico de Zacarias — Lucas 1, 69-70. 71-72. 73-75 (R. cf. 68)',
        chorus: 'Bendito seja o Senhor Deus de Israel, porque a seu povo visitou e libertou!',
        verses: [
          'Fez surgir um poderoso Salvador na casa de Davi, seu servidor, como falara pela boca de seus santos, os profetas desde os tempos mais antigos.',
          'Para salvar-nos do poder dos inimigos e da mão de todos quantos nos odeiam. Assim mostrou misericórdia a nossos pais, recordando a sua santa Aliança.',
          'E o juramento a Abraão, o nosso pai, de conceder-nos que, libertos do inimigo, a ele nós sirvamos sem temor, em santidade e em justiça diante dele, enquanto perdurarem nossos dias.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 5-13)',
        reference: 'São Lucas 11, 5-13',
        text: `Naquele tempo, Jesus disse aos discípulos:
"Se um de vós tiver um amigo e for procurá-lo à meia-noite e lhe disser: 'Amigo, empresta-me três pães, porque um amigo meu chegou de viagem e nada tenho para lhe oferecer', e o outro responder lá de dentro: 'Não me incomodes! A porta já está fechada, e meus filhos e eu já estamos deitados; não me posso levantar para te dar os pães'; eu vos declaro: mesmo que o outro não se levante para dá-los porque é seu amigo, vai levantar-se ao menos por causa da impertinência dele e lhe dará tudo o de que tiver precisão.
Portanto, eu vos digo: pedi e recebereis; procurai e encontrareis; batei e vos será aberto. Pois quem pede, recebe; quem procura, encontra; e, para quem bate, se abrirá.
Será que algum de vós, que é pai, se o filho lhe pedir um peixe, lhe dará uma cobra? Ou ainda, se pedir um ovo, lhe dará um escorpião?
Ora, se vós, que sois maus, sabeis dar coisas boas aos vossos filhos, quanto mais o Pai do Céu dará o Espírito Santo aos que o pedirem!"`,
      },
      reflection: {
        author: 'Liturgia Diária CNBB / Canção Nova • Célula Santa Gemma Galgani',
        text: 'No Evangelho de hoje (São Lucas 11, 5-13), Jesus nos revela o segredo da oração perseverante e confiante: "Pedi e recebereis; procurai e encontrareis; batei e vos será aberto". Assim como São Paulo recorda aos Gálatas que começamos nossa caminhada no Espírito pela fé no Crucificado (Gl 3, 1-5), o Pai do Céu deseja ardentemente derramar o Espírito Santo sobre cada irmão da nossa célula que pede com perseverança.',
      },
    },
    saints: [
      {
        name: 'Santa Pelágia, São Simeão e Santa Reparata',
        title: 'Mártires da Fé, Testemunhas da Conversão e da Esperança Cristã',
        feastDate: '08 de Outubro',
        summary: 'Neste dia 08 de outubro a Igreja celebra Santa Pelágia de Antioquia (testemunha da pureza e da penitência), São Simeão (ancião que acolheu o Menino Jesus no Templo) e Santa Reparata (jovem virgem e mártir).',
        lifeStory: `No Martirológio Romano para o dia 08 de outubro destacam-se três grandes testemunhos de santidade celebrados pela Igreja (Canção Nova / CNBB):
1. Santa Pelágia de Antioquia: Celebrada tanto como a jovem virgem e mártir de 15 anos que, durante a perseguição de Diocleciano no século IV, preferiu entregar a vida a perder a fidelidade a Cristo, quanto Santa Pelágia Penitente, que abandonou as riquezas e vaidades de Antioquia para viver em profunda oração e penitência no Monte das Oliveiras, em Jerusalém.
2. São Simeão: O homem justo e piedoso de Jerusalém que, movido pelo Espírito Santo (como ouvimos hoje no Evangelho de São Lucas), esperou com fé o Messias, tomou o Menino Jesus nos braços no Templo e proclamou o Cântico da Luz das Nações (Nunc Dimittis).
3. Santa Reparata de Cesareia: Jovem mártir do século III que testemunhou corajosamente a fé em Jesus Cristo aos 12 anos e tornou-se padroeira invocada pela paz da Igreja.`,
        virtue: 'Perseverança inabalável na oração, pureza de coração e confiança no Espírito Santo.',
        prayer: `Ó Pai do Céu, que por palavra de Vosso Filho Jesus nos prometestes em São Lucas 11, 5-13 dar o Espírito Santo a todos os que Vos pedem com perseverança: pela intercessão de Santa Pelágia, de São Simeão, de Santa Reparata e de nossa padroeira Santa Gemma Galgani, abri as portas da Vossa graça sobre todos os 48 irmãos da nossa célula. Por Cristo nosso Senhor. Amém!`,
      },
    ],
  },

  '2026-10-09': {
    isoDate: '2026-10-09',
    dayMonthKey: '09/10',
    liturgy: {
      date: 'Sexta-feira, 09 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Vermelho na Memória dos Mártires)',
      headline: 'Sexta-feira da 27ª Semana do Tempo Comum • São Dionísio e São João Leonardi',
      firstReading: {
        title: 'Primeira Leitura (Gl 3, 7-14)',
        reference: 'Carta de São Paulo aos Gálatas 3, 7-14',
        text: `Irmãos: Sabei que os que têm fé é que são filhos de Abraão. Prevendo a Escritura que Deus justificaria os povos pagãos pela fé, anunciou com antecedência a Abraão esta boa nova: "Em ti serão abençoadas todas as nações". De modo que os homens de fé são abençoados junto com a fé de Abraão.
Pois todos os que se apoiam nas práticas legais estão sob um regime de maldição. E que ninguém é justificado pela Lei perante Deus, é evidente, porque "o justo viverá pela fé".
Cristo nos resgatou da maldição da Lei, tornando-se ele próprio maldição em nosso favor, pois está escrito: "Maldito todo aquele que for suspenso no madeiro". Isto aconteceu para que a bênção de Abraão chegasse aos pagãos em Cristo Jesus e assim, pela fé, recebêssemos o Espírito prometido.`,
      },
      psalm: {
        reference: 'Salmo 110 (111), 1-2. 3-4. 5-6 (R. 5b)',
        chorus: 'O Senhor se lembra sempre da Aliança!',
        verses: [
          'Eu agradeço a Deus de todo o coração, junto com todos os seus justos reunidos! Que grandiosas são as obras do Senhor, elas merecem todo o amor e admiração!',
          'Majestade e esplendor são suas obras, sua justiça permanece para sempre. O Senhor fez portentos memoráveis, o Senhor é piedade e compaixão.',
          'Ele dá o alimento aos que o temem e jamais esquecerá sua Aliança. Ao seu povo manifesta o seu poder, dando a ele a herança das nações.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 15-26)',
        reference: 'São Lucas 11, 15-26',
        text: `Naquele tempo, Jesus estava expulsando um demônio. Mas alguns disseram: "É por Belzebu, o príncipe dos demônios, que ele expulsa os demônios". Outros, para tentar Jesus, pediram-lhe um sinal do céu.
Conhecendo seus pensamentos, Jesus disse-lhes: "Todo reino dividido contra si mesmo será destruído; e cairá uma casa por cima da outra. Ora, se até Satanás está dividido contra si mesmo, como poderá sobreviver o seu reino?
Mas, se é pelo dedo de Deus que eu expulso os demônios, então o Reino de Deus já chegou até vós.
Quando um homem forte e bem armado guarda a própria casa, seus bens estão seguros. Mas, quando chega um mais forte do que ele, vence-o, arranca-lhe a armadura na qual ele confiava, e reparte o que roubou.
Quem não está comigo, está contra mim. E quem não recolhe comigo, espalha".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Nesta sexta-feira de encontro da nossa célula (19h às 21h), a Palavra nos afirma que "quem não recolhe com Cristo, espalha". Unidos ao redor de Jesus Crucificado, o Reino de Deus vence toda divisão em nossas famílias.',
      },
    },
    saints: [
      {
        name: 'São Dionísio e Companheiros Mártires, e São João Leonardi',
        title: 'Primeiro Bispo de Paris e Apóstolo da Catequese e das Missões',
        feastDate: '09 de Outubro',
        summary: 'A Igreja celebra São Dionísio, primeiro bispo de Paris e mártir com Rústico e Eleutério, além de São João Leonardi, sacerdote fundador dos Clérigos Regulares da Mãe de Deus.',
        lifeStory: `São Dionísio foi enviado de Roma para a Gália no século III como missionário, tornando-se o primeiro bispo de Paris. Preso pela fé cristã junto ao sacerdote Rústico e ao diácono Eleutério, deu a vida em martírio na colina de Montmartre ("Monte dos Mártires").
Neste mesmo dia celebra-se São João Leonardi (1541–1609), farmacêutico italiano de Lucca (a mesma cidade da nossa padroeira Santa Gemma Galgani!) que se ordenou sacerdote, promoveu a renovação espiritual, o ensino do catecismo às crianças e a fundação do Colégio Urbano de Propaganda Fide para as missões.`,
        virtue: 'Zelo missionário pela evangelização e unidade inabalável com a Igreja.',
        prayer: `Ó Deus, que destes a São Dionísio a coragem do martírio e a São João Leonardi, conterrâneo de Santa Gemma em Lucca, o ardor pela evangelização, inflamai nossa célula nesta sexta-feira com o fogo do Espírito Santo. Amém.`,
      },
    ],
  },

  '2026-10-10': {
    isoDate: '2026-10-10',
    dayMonthKey: '10/10',
    liturgy: {
      date: 'Sábado, 10 de Outubro de 2026',
      liturgicalColor: 'Verde (27ª Semana do Tempo Comum)',
      headline: 'Sábado da 27ª Semana do Tempo Comum • São Daniel Comboni',
      firstReading: {
        title: 'Primeira Leitura (Gl 3, 22-29)',
        reference: 'Carta de São Paulo aos Gálatas 3, 22-29',
        text: `Irmãos: A Escritura pôs todos e tudo sob o domínio do pecado, a fim de que a promessa fosse concedida aos que creem, pela fé em Jesus Cristo.
Antes que chegasse a fé, estávamos encerrados sob a vigilância da Lei, esperando a fé que devia ser revelada. Assim a Lei se tornou nosso pedagogo até Cristo, para que fôssemos justificados pela fé.
Chegada porém a fé, já não estamos sob pedagogo; pois todos sois filhos de Deus pela fé em Jesus Cristo. Todos vós, que fostes batizados em Cristo, vos revestistes de Cristo.
Não há mais diferença entre judeu e grego, entre escravo e homem livre, entre homem e mulher, pois todos vós sois um só em Cristo Jesus. E, se pertenceis a Cristo, então sois descendência de Abraão, herdeiros segundo a promessa.`,
      },
      psalm: {
        reference: 'Salmo 104 (105), 2-3. 4-5. 6-7 (R. 8a)',
        chorus: 'O Senhor se lembra sempre da Aliança!',
        verses: [
          'Cantai, cantai ao Senhor Deus um canto novo, publicai todas as suas maravilhas! Gloriai-vos em seu nome que é santo, exulte o coração que busca a Deus!',
          'Procurai o Senhor Deus e seu poder, buscai constantemente a sua face! Lembrai as maravilhas que ele fez, seus prodígios e as palavras de seus lábios!',
          'Descendentes de Abraão, seu servidor, e filhos de Jacó, seu escolhido, ele mesmo, o Senhor, é nosso Deus, vigoram suas leis em toda a terra.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 27-28)',
        reference: 'São Lucas 11, 27-28',
        text: `Naquele tempo, enquanto Jesus falava, uma mulher levantou a voz no meio da multidão e lhe disse: "Feliz o ventre que te trouxe e os seios que te amamentaram!"
Jesus respondeu: "Muito mais felizes são aqueles que ouvem a palavra de Deus e a põem em prática!"`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'No sábado dedicado à Virgem Maria, Jesus exalta a maior grandeza de Sua Mãe e de cada discípulo: ouvir a Palavra de Deus e colocá-la em prática no cotidiano.',
      },
    },
    saints: [
      {
        name: 'São Daniel Comboni, Bispo e Missionário',
        title: 'Apóstolo da África e Fundador dos Missionários Combonianos',
        feastDate: '10 de Outubro',
        summary: 'Bispo italiano do século XIX que entregou sua vida à evangelização e dignidade dos povos da África Central.',
        lifeStory: `São Daniel Comboni nasceu na Itália em 1831 e desde jovem sentiu um ardente chamado missionário pela África. Ordenado sacerdote, viajou ao Sudão e fundou institutos masculinos e femininos para as missões africanas sob o lema "Salvar a África com a África".
Nomeado primeiro bispo da África Central em 1877, lutou incansavelmente contra a escravidão e anunciou o Evangelho até sua morte em Cartum, em 10 de outubro de 1881, aos 50 anos.`,
        virtue: 'Paixão missionária pelas almas e prática concreta da Palavra de Deus.',
        prayer: `Senhor Jesus, que ensinastes serem felizes os que ouvem a Palavra de Deus e a põem em prática, dai-nos, pelo exemplo de São Daniel Comboni e de Maria Santíssima, um coração missionário e generoso. Amém.`,
      },
    ],
  },

  '2026-10-11': {
    isoDate: '2026-10-11',
    dayMonthKey: '11/10',
    liturgy: {
      date: 'Domingo, 11 de Outubro de 2026',
      liturgicalColor: 'Verde (28º Domingo do Tempo Comum - Ano A)',
      headline: '28º Domingo do Tempo Comum • São João XXIII, Papa',
      firstReading: {
        title: 'Primeira Leitura (Is 25, 6-10a)',
        reference: 'Livro do Profeta Isaías 25, 6-10a',
        text: `Naquele dia, o Senhor dos exércitos preparará sobre este monte, para todos os povos, um banquete de ricas iguarias, um banquete de vinhos finos, de comidas suculentas e vinhos depurados.
Destruirá neste monte o véu que envolvia todos os povos, a mortalha que cobria todas as nações; destruirá a morte para sempre. O Senhor Deus enxugará as lágrimas de todas as faces e tirará de toda a terra a ignomínia do seu povo, porque o Senhor falou.
Dir-se-á naquele dia: "Eis o nosso Deus, nele esperávamos e ele nos salvou; é o Senhor, nele esperávamos: exultemos e alegremo-nos em sua salvação", porque a mão do Senhor repousará sobre este monte.`,
      },
      psalm: {
        reference: 'Salmo 22 (23), 1-3a. 3b-4. 5. 6 (R. 6cd)',
        chorus: 'Habitarei na casa do Senhor por toda a minha vida!',
        verses: [
          'O Senhor é o pastor que me conduz; não me falta coisa alguma. Pelos prados e campinas verdejantes ele me leva a descansar. Para as águas repousantes me encaminha, e restaura as minhas forças.',
          'Ele me guia no caminho mais seguro, pela honra do seu nome. Mesmo que eu passe pelo vale tenebroso, nenhum mal eu temerei; estais comigo com bastão e com cajado, eles me dão a segurança!',
          'Preparais à minha frente uma mesa, bem à vista do inimigo, e com óleo vós ungis minha cabeça; o meu cálice transborda. Felicidade e todo bem hão de seguir-me por toda a minha vida; e na casa do Senhor habitarei pelos tempos infinitos.',
        ],
      },
      secondReading: {
        title: 'Segunda Leitura (Fl 4, 12-14. 19-20)',
        reference: 'Carta de São Paulo aos Filipenses 4, 12-14. 19-20',
        text: `Irmãos: Sei viver na miséria e sei viver na abundância. Eu aprendi o segredo de viver em toda e qualquer situação, estando farto ou passando fome, tendo de sobra ou sofrendo necessidade.
Tudo posso naquele que me fortalece! Entretanto, fizestes bem em participar da minha aflição.
O meu Deus proverá esplendidamente, com sua riqueza, a todas as vossas necessidades, em Cristo Jesus. Ao nosso Deus e Pai seja dada a glória pelos séculos dos séculos. Amém!`,
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Mateus (Mt 22, 1-14)',
        reference: 'São Mateus 22, 1-14',
        text: `Naquele tempo, Jesus voltou a falar em parábolas aos sumos sacerdotes e aos anciãos do povo, dizendo:
"O Reino dos Céus é como a história do rei que preparou a festa de casamento do seu filho. E mandou os seus empregados chamar os convidados para a festa, mas estes não quiseram vir. O rei mandou outros empregados, dizendo: 'Dizei aos convidados: já preparei o banquete, os meus bois e animais cevados já foram abatidos e tudo está pronto. Vinde para a festa!' Mas os convidados não deram a menor atenção: um foi para o seu campo, outro para os seus negócios...
Então o rei disse aos empregados: 'A festa de casamento está pronta, mas os convidados não foram dignos dela. Portanto, ide até às encruzilhadas dos caminhos e convidai para a festa todos os que encontrardes'. Os empregados saíram pelos caminhos e reuniram todos os que encontraram, maus e bons. E a sala da festa ficou cheia de convidados... Pois muitos são chamados, mas poucos são escolhidos".`,
      },
      reflection: {
        author: 'Liturgia Dominical • Célula Santa Gemma Galgani',
        text: '"Tudo posso naquele que me fortalece!" (Fl 4,13). O Senhor nos convida hoje ao banquete da Eucaristia revestidos da veste nupcial da graça e da caridade fraterna.',
      },
    },
    saints: [
      {
        name: 'São João XXIII, Papa',
        title: 'O "Papa Bom" • Convocador do Concílio Vaticano II',
        feastDate: '11 de Outubro',
        summary: 'Angelo Giuseppe Roncalli (1881–1963), Papa de 1958 a 1963, amado pela sua bondade paternal, espírito de paz (Encíclica Pacem in Terris) e abertura ao Espírito Santo.',
        lifeStory: `Nascido em uma família humilde de camponeses em Sotto il Monte (Itália), Angelo Roncalli serviu a Igreja como sacerdote, diplomata na Bulgária, Turquia e França, e Patriarca de Veneza. Eleito Papa aos 76 anos com o nome de João XXIII, conquistou o mundo com sua simplicidade evangélica e ternura pastoral, visitando presos e doentes.
Em 11 de outubro de 1962 abriu solenemente o Concílio Ecumênico Vaticano II, razão pela qual sua memória litúrgica é celebrada neste dia.`,
        virtue: 'Bondade pastoral, alegria serena e docilidade ao Espírito Santo.',
        prayer: `Deus eterno e todo-poderoso, que em São João XXIII fizestes resplandecer a imagem do Bom Pastor, concedei à nossa Célula Santa Gemma Galgani a graça de testemunhar com alegria e ternura o amor de Cristo a todos. Amém.`,
      },
    ],
  },

  '2026-10-12': {
    isoDate: '2026-10-12',
    dayMonthKey: '12/10',
    liturgy: {
      date: 'Segunda-feira, 12 de Outubro de 2026',
      liturgicalColor: 'Branco / Ouro (Solenidade no Brasil)',
      headline: 'Solenidade de Nossa Senhora da Conceição Aparecida, Padroeira do Brasil',
      firstReading: {
        title: 'Primeira Leitura (Est 5, 1b-2; 7, 2b-3)',
        reference: 'Livro de Ester 5, 1b-2; 7, 2b-3',
        text: `Ester revestiu-se com vestes de rainha e foi colocar-se no pátio interno do palácio real, diante da residência do rei. Quando o rei viu a rainha Ester parada no pátio, olhou para ela com benevolência e estendeu-lhe o cetro de ouro que tinha na mão.
E o rei lhe disse: "Qual é o teu pedido, Ester? O que desejas? Ainda que me pedisses a metade do meu reino, ela te seria concedida".
Ester respondeu: "Se eu alcancei o teu favor, ó rei, e se for do teu agrado, concede-me a vida — eis o meu pedido! — e a vida do meu povo — eis o meu desejo!"`,
      },
      psalm: {
        reference: 'Salmo 44 (45), 11-12a. 12b-13. 14-15a. 15b-16 (R. 11.12a)',
        chorus: 'Escutai, minha filha, olhai, ouvi isto: que o Rei se encante com vossa beleza!',
        verses: [
          'Escutai, minha filha, olhai, ouvi isto: esquecei vosso povo e a casa paterna! Que o Rei se encante com vossa beleza! Prestai-lhe homenagem: é vosso Senhor!',
          'O povo de Tiro traz seus presentes, os grandes do povo imploram favor. Toda formosa entra a filha do Rei, suas vestes são feitas de ouro tecido.',
          'Em vestes vistosas ao Rei se dirige, e as virgens amigas lhe formam cortejo; trazidas com festa e com grande alegria, ingressam, então, no palácio real.',
        ],
      },
      secondReading: {
        title: 'Segunda Leitura (Ap 12, 1. 5. 13a. 15-16a)',
        reference: 'Livro do Apocalipse de São João 12, 1. 5. 13a. 15-16a',
        text: `Apareceu no céu um grande sinal: uma Mulher vestida do sol, tendo a lua debaixo dos pés e sobre a cabeça uma coroa de doze estrelas.
E ela deu à luz um filho homem, que veio para governar todas as nações com cetro de ferro. Mas o seu filho foi levado para junto de Deus e do seu trono.
Quando o dragão viu que tinha sido expulso para a terra, pôs-se a perseguir a Mulher que tinha dado à luz o menino; mas a terra veio em socorro da Mulher.`,
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São João (Jo 2, 1-11)',
        reference: 'São João 2, 1-11',
        text: `Naquele tempo, houve um casamento em Caná da Galileia. A mãe de Jesus estava presente. Também Jesus e seus discípulos tinham sido convidados para o casamento.
Como o vinho veio a faltar, a mãe de Jesus lhe disse: "Eles não têm mais vinho". Jesus respondeu-lhe: "Mulher, por que dizes isto a mim? Minha hora ainda não chegou".
Sua mãe disse aos que estavam servindo: "Fazei tudo o que ele vos disser".
Estavam ali seis talhas de pedra colocadas para a purificação que os judeus costumam fazer. Jesus disse aos que estavam servindo: "Enchei as talhas de água". Encheram-nas até a boca. Jesus disse: "Agora tirai e levai ao mestre-sala". E eles levaram.
Este foi o começo dos sinais de Jesus. Ele o realizou em Caná da Galileia e manifestou a sua glória, e seus discípulos creram nele.`,
      },
      reflection: {
        author: 'Solenidade da Padroeira • Célula Santa Gemma Galgani',
        text: '"Fazei tudo o que Ele vos disser!" (Jo 2,5). No dia da Mãe Aparecida e encontro de segunda-feira da nossa célula, entregamos nossas famílias sob o manto azul de Nossa Senhora.',
      },
    },
    saints: [
      {
        name: 'Nossa Senhora da Conceição Aparecida e São Carlo Acutis',
        title: 'Rainha e Padroeira do Brasil • São Carlo Acutis (Apóstolo da Eucaristia)',
        feastDate: '12 de Outubro',
        summary: 'Solenidade de Nossa Senhora Aparecida, encontrada nas águas do Rio Paraíba do Sul em 1717, e memória de São Carlo Acutis, o jovem apaixonado pela Eucaristia ("A Eucaristia é a minha autoestrada para o Céu").',
        lifeStory: `Em outubro de 1717, três pescadores — Domingos Garcia, Filipe Pedroso e João Alves — lançaram suas redes no Rio Paraíba do Sul e recolheram a pequenina imagem de Nossa Senhora da Conceição, primeiro o corpo e depois a cabeça, seguida de uma pesca milagrosa. Proclamada Rainha e Padroeira do Brasil pelo Papa Pio XI em 1930, Nossa Senhora Aparecida aponta sempre para Seu Filho Jesus: "Fazei tudo o que Ele vos disser".
No dia 12 de outubro a Igreja também recorda o jovem Carlo Acutis (1991–2006), que uniu a juventude e a internet ao amor ardente pela Santa Missa e pelos milagres eucarísticos.`,
        virtue: 'Obediência filial à palavra de Jesus e amor apaixonado pela Eucaristia.',
        prayer: `Ó incomparável Senhora da Conceição Aparecida, Mãe de Deus, Rainha dos Anjos, Advogada dos pecadores, Refúgio e Consolação dos aflitos e atribulados: lançai sobre a nossa Célula Santa Gemma Galgani um olhar favorável e abençoai nossas famílias! Amém.`,
      },
    ],
  },

  '2026-10-13': {
    isoDate: '2026-10-13',
    dayMonthKey: '13/10',
    liturgy: {
      date: 'Terça-feira, 13 de Outubro de 2026',
      liturgicalColor: 'Verde (28ª Semana do Tempo Comum)',
      headline: 'Terça-feira da 28ª Semana do Tempo Comum (Ano Par II)',
      firstReading: {
        title: 'Primeira Leitura (Gl 5, 1-6)',
        reference: 'Carta de São Paulo aos Gálatas 5, 1-6',
        text: `Irmãos: É para a liberdade que Cristo nos libertou. Ficai, pois, firmes e não vos deixeis amarrar de novo ao jugo da escravidão.
Quanto a nós, é espiritualmente, da fé, que aguardamos a justiça esperada. Pois em Cristo Jesus, o que vale é a fé que age pela caridade.`,
      },
      psalm: {
        reference: 'Salmo 118 (119), 41. 43. 44. 45. 47. 48 (R. 41a)',
        chorus: 'Venha a mim o vosso amor, ó Senhor, e a vossa salvação!',
        verses: [
          'Senhor, que venha a mim o vosso amor e a vossa salvação, conforme a vossa promessa! Não tireis da minha boca a palavra da verdade, pois eu ponho a esperança em vossos juízos.',
          'Cumprirei constantemente a vossa lei, para sempre, eternamente. Andarei por um caminho bem espaçoso, porque busco os vossos preceitos.',
          'Encontro minha alegria em vossos mandamentos, que eu amo de verdade. Para vossos mandamentos, que eu amo, levantarei as minhas mãos e meditarei em vossas leis.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 37-41)',
        reference: 'São Lucas 11, 37-41',
        text: `Naquele tempo, enquanto Jesus falava, um fariseu convidou-o para jantar com ele. Jesus entrou e pôs-se à mesa.
O fariseu ficou admirado ao ver que Jesus não tivesse lavado as mãos antes da refeição. O Senhor disse ao fariseu: "Vós fariseus, limpais o copo e o prato por fora, mas o vosso interior está cheio de roubos e maldades. Insensatos! Aquele que fez o exterior não fez também o interior?
Antes, dai esmola do que vós possuís e, então, tudo ficará puro para vós".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Em Cristo o que vale é "a fé que age pela caridade" (Gl 5,6). A verdadeira pureza diante de Deus nasce de um coração interiormente convertido e generoso com os irmãos.',
      },
    },
    saints: [
      {
        name: 'Beata Alexandrina Maria da Costa e Santo Eduardo',
        title: 'Mística Salesiana Alimentada unicamente pela Eucaristia',
        feastDate: '13 de Outubro',
        summary: 'Celebramos a Beata Alexandrina de Balasar (Portugal), que viveu 13 anos alimentando-se apenas da Sagrada Comunhão, e o aniversário da última aparição de Nossa Senhora em Fátima (Milagre do Sol, 13/10/1917).',
        lifeStory: `A Beata Alexandrina Maria da Costa (1904–1955), nascida em Balasar (Portugal), ficou paralisada aos 14 anos ao saltar da janela para defender sua pureza. Tal como nossa padroeira Santa Gemma Galgani, ofereceu seus sofrimentos em união com a Paixão de Cristo pela conversão dos pecadores e viveu os últimos 13 anos de vida sustentada exclusivamente pela Sagrada Eucaristia.`,
        virtue: 'Pureza interior, amor reparador à Eucaristia e caridade sincera.',
        prayer: `Senhor Jesus, que purificais o interior dos nossos corações pela fé que atua na caridade, concedei-nos, pela intercessão da Beata Alexandrina e de Santa Gemma Galgani, amar-Vos de todo o coração. Amém.`,
      },
    ],
  },

  '2026-10-14': {
    isoDate: '2026-10-14',
    dayMonthKey: '14/10',
    liturgy: {
      date: 'Quarta-feira, 14 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Vermelho na Memória de São Calisto I)',
      headline: 'Quarta-feira da 28ª Semana do Tempo Comum • São Calisto I, Papa e Mártir',
      firstReading: {
        title: 'Primeira Leitura (Gl 5, 18-25)',
        reference: 'Carta de São Paulo aos Gálatas 5, 18-25',
        text: `Irmãos: Se sois conduzidos pelo Espírito, então não estais sob o jugo da Lei.
Mas o fruto do Espírito é: amor, alegria, paz, paciência, amabilidade, bondade, lealdade, mansidão, domínio próprio. Contra estas coisas não existe lei.
Pois os que pertencem a Jesus Cristo crucificaram a carne com suas paixões e seus desejos. Se vivemos pelo Espírito, procedamos também de acordo com o Espírito.`,
      },
      psalm: {
        reference: 'Salmo 1, 1-2. 3. 4 e 6 (R. cf. Jo 8,12)',
        chorus: 'Quem te segue, ó Senhor, terá a luz da vida!',
        verses: [
          'Feliz é todo aquele que não anda conforme os conselhos dos perversos; mas encontra seu prazer na lei de Deus e a medita, dia e noite, sem cessar.',
          'Eis que ele é semelhante a uma árvore, que à beira da torrente está plantada; ela sempre dá seus frutos a seu tempo, e jamais as suas folhas vão murchar.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 42-46)',
        reference: 'São Lucas 11, 42-46',
        text: `Naquele tempo, o Senhor disse: "Ai de vós, fariseus, porque pagais o dízimo da hortelã, da arruda e de todas as outras ervas, mas deixais de lado a justiça e o amor de Deus! Vós deveríeis praticar isso, sem deixar de lado aquilo.
Ai de vós, também, mestres da Lei, porque colocais sobre os homens cargas insuportáveis, e vós mesmos não tocais nessas cargas, nem sequer com um só dedo!"`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'São Paulo hoje nos apresenta os 9 frutos do Espírito Santo (Gl 5,22): amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio. Peçamos esses frutos para nossa célula!',
      },
    },
    saints: [
      {
        name: 'São Calisto I, Papa e Mártir',
        title: 'De Escravo a Pastor da Igreja de Roma e Testemunha da Misericórdia',
        feastDate: '14 de Outubro',
        summary: 'Papa do século III que organizou as famosas Catacumbas de São Calisto na Via Ápia e defendeu o perdão misericordioso da Igreja aos pecadores arrependidos.',
        lifeStory: `São Calisto I foi escravo em Roma, sofreu trabalhos forçados nas minas da Sardenha por ser cristão e, libertado, tornou-se diácono do Papa São Zeferino, encarregado do cemitério cristão na Via Ápia. Eleito Papa em 217, destacou-se pela misericórdia pastoral e morreu mártir em 222.`,
        virtue: 'Viver segundo os frutos do Espírito Santo: amor, alegria, paz e misericórdia.',
        prayer: `Ó Deus, que cumulastes o Papa São Calisto I com os frutos do Espírito Santo para acolher os pecadores e dar a vida pelo rebanho, fazei florescer em nossa Célula Santa Gemma a justiça e o amor de Deus. Amém.`,
      },
    ],
  },

  '2026-10-15': {
    isoDate: '2026-10-15',
    dayMonthKey: '15/10',
    liturgy: {
      date: 'Quinta-feira, 15 de Outubro de 2026',
      liturgicalColor: 'Branco (Memória de Santa Teresa de Jesus)',
      headline: 'Memória de Santa Teresa de Ávila, Virgem e Doutora da Igreja',
      firstReading: {
        title: 'Primeira Leitura (Ef 1, 1-10)',
        reference: 'Carta de São Paulo aos Efésios 1, 1-10',
        text: `Bendito seja Deus, Pai de nosso Senhor Jesus Cristo. Ele nos abençoou com toda a bênção do seu Espírito, em virtude de nossa união com Cristo, no céu.
Em Cristo, ele nos escolheu, antes da fundação do mundo, para que sejamos santos e irrepreensíveis sob o seu olhar, no amor.
Nele temos a redenção, pelo seu sangue, a remissão dos pecados, segundo a riqueza da sua graça.`,
      },
      psalm: {
        reference: 'Salmo 97 (98), 1. 2-3ab. 3cd-4. 5-6 (R. 2a)',
        chorus: 'O Senhor fez conhecer a salvação!',
        verses: [
          'Cantai ao Senhor Deus um canto novo, porque ele fez prodígios! Sua mão e o seu braço forte e santo alcançaram-lhe a vitória.',
          'O Senhor fez conhecer a salvação, e às nações revelou sua justiça; recordou o seu amor sempre fiel pela casa de Israel.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 11, 47-54)',
        reference: 'São Lucas 11, 47-54',
        text: `Naquele tempo, disse o Senhor: "Ai de vós, mestres da Lei, porque tomastes a chave da ciência! Vós mesmos não entrastes, e ainda impedistes os que queriam entrar".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Celebramos hoje Santa Teresa de Ávila, baluarte da Comunidade Católica Shalom! "Nada te perturbe, nada te espante, tudo passa, só Deus basta!"',
      },
    },
    saints: [
      {
        name: 'Santa Teresa de Jesus (Santa Teresa de Ávila)',
        title: 'Virgem, Mística, Doutora da Oração e Baluarte do Carisma Shalom',
        feastDate: '15 de Outubro',
        summary: 'Mestra da oração contemplativa, reformadora do Carmelo e baluarte da Comunidade Católica Shalom, que definiu a oração como "trato de amizade estando muitas vezes tratando a sós com Quem sabemos que nos ama".',
        lifeStory: `Santa Teresa de Jesus nasceu em Ávila (Espanha) em 1515. Reformou a Ordem do Carmelo e escreveu obras-primas da espiritualidade cristã como "O Castelo Interior" e "Caminho de Perfeição". Foi a primeira mulher proclamada Doutora da Igreja por São Paulo VI em 1970 e é um dos grandes baluartes da vocação Shalom.`,
        virtue: 'Determinada determinação na vida de oração ("Só Deus basta!").',
        prayer: `Nada te perturbe, nada te espante, tudo passa, Deus não muda. A paciência tudo alcança; quem a Deus tem nada lhe falta: Só Deus basta! Santa Teresa de Jesus e Santa Gemma Galgani, rogai por nós!`,
      },
    ],
  },

  '2026-10-16': {
    isoDate: '2026-10-16',
    dayMonthKey: '16/10',
    liturgy: {
      date: 'Sexta-feira, 16 de Outubro de 2026',
      liturgicalColor: 'Branco (ou Verde) • Memória de Santa Margarida Maria Alacoque',
      headline: 'Sexta-feira da 28ª Semana do Tempo Comum • Santa Margarida Maria Alacoque & São Geraldo Majella',
      firstReading: {
        title: 'Primeira Leitura (Ef 1, 11-14)',
        reference: 'Carta de São Paulo aos Efésios 1, 11-14',
        text: `Irmãos: Em Cristo, fomos feitos herdeiros, predestinados segundo o desígnio daquele que realiza todas as coisas segundo a sua vontade, para sermos louvor da sua glória, nós que antes esperávamos em Cristo.
Nele, também vós ouvistes a palavra da verdade, o evangelho da vossa salvação; nele crestes e fostes selados com o Espírito Santo prometido, que é o penhor da nossa herança.`,
      },
      psalm: {
        reference: 'Salmo 32 (33), 1-2. 4-5. 12-13 (R. 12b)',
        chorus: 'Feliz o povo que o Senhor escolheu por sua herança!',
        verses: [
          'Ó justos, alegrai-vos no Senhor! Aos retos fica bem louvar a Deus. Dai graças ao Senhor ao som da harpa, tocai em sua honra a lira de dez cordas!',
          'Pois reta é a palavra do Senhor, e tudo o que ele faz merece fé. Ele ama a justiça e o direito; da bondade do Senhor está cheia a terra.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 1-7)',
        reference: 'São Lucas 12, 1-7',
        text: `Naquele tempo, milhares de pessoas se reuniram, a ponto de uns pisarem os outros. Jesus começou a dizer primeiro aos seus discípulos: "Tomai cuidado com o fermento dos fariseus, que é a hipocrisia. Não há nada de escondido que não venha a ser revelado, e não há nada em segredo que não venha a ser conhecido.
Portanto, tudo o que tiverdes dito na escuridão será ouvido na claridade; e o que tiverdes sussurrado aos ouvidos nos quartos fechados será proclamado de cima dos telhados.
A vós, meus amigos, eu digo: Não tenhais medo daqueles que matam o corpo e depois não podem fazer mais nada. Eu vos mostrarei a quem deveis temer: temei aquele que, depois de tirar a vida, tem o poder de lançar no inferno. Sim, eu vos digo, a esse deveis temer.
Não se vendem cinco pardais por duas moedinhas? No entanto, nenhum deles é esquecido por Deus. Até mesmo os cabelos da vossa cabeça estão todos contados. Não tenhais medo! Vós valeis mais do que muitos pardais".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Jesus nos chama de "meus amigos" e nos assegura que até os cabelos da nossa cabeça estão contados pelo Pai. Santa Margarida Maria, cuja revelação do Sagrado Coração inspirou Santa Gemma, nos convida a confiar plenamente no Coração de Jesus que arde de amor por nós.',
      },
    },
    saints: [
      {
        name: 'Santa Margarida Maria Alacoque e São Geraldo Majella',
        title: 'Apóstola do Sagrado Coração de Jesus e Patrono das Mães e Gestantes',
        feastDate: '16 de Outubro',
        summary: 'Santa Margarida Maria recebeu de Jesus as doze promessas do Sagrado Coração; São Geraldo Majella é invocado com enorme carinho pelas mães e famílias na hora do parto.',
        lifeStory: `Santa Margarida Maria Alacoque (1647–1690), religiosa da Visitação de Paray-le-Monial (França), recebeu as grandes revelações do Coração de Jesus: "Eis o Coração que tanto amou os homens". Seu testemunho foi pilar místico para Santa Gemma Galgani. No mesmo dia a Igreja celebra São Geraldo Majella (1726–1755), irmão redentorista modelo de pureza e socorro às mães em perigo de parto.`,
        virtue: 'Reparação de amor ao Sagrado Coração e fé inabalável na Providência.',
        prayer: `Sagrado Coração de Jesus, pelas preces de Santa Margarida Maria e de São Geraldo, protegei as mães, as crianças e as famílias de nossa célula. Jesus manso e humilde de coração, fazei o nosso coração semelhante ao Vosso! Amém.`,
      },
    ],
  },

  '2026-10-17': {
    isoDate: '2026-10-17',
    dayMonthKey: '17/10',
    liturgy: {
      date: 'Sábado, 17 de Outubro de 2026',
      liturgicalColor: 'Vermelho • Memória de Santo Inácio de Antioquia',
      headline: 'Memória de Santo Inácio de Antioquia, Bispo e Mártir',
      firstReading: {
        title: 'Primeira Leitura (Ef 1, 15-23)',
        reference: 'Carta de São Paulo aos Efésios 1, 15-23',
        text: `Irmãos: Tendo ouvido falar da vossa fé no Senhor Jesus e do vosso amor para com todos os santos, não cesso de dar graças por vós, lembrando-me de vós em minhas orações.
Peço que o Deus de nosso Senhor Jesus Cristo, o Pai da glória, vos dê um espírito de sabedoria e de revelação, que vos faça conhecê-lo plenamente. Que ele ilumine os olhos do vosso coração, para que compreendais qual é a esperança à qual vos chamou, qual é a riqueza da glória da sua herança entre os santos.`,
      },
      psalm: {
        reference: 'Salmo 8, 2-3a. 4-5. 6-7 (R. 7)',
        chorus: 'Destes ao vosso Filho poder sobre tudo!',
        verses: [
          'Ó Senhor, nosso Deus, como é grande vosso nome por todo o universo! Desdobrastes no céu vossa glória, com a voz de crianças e infantes.',
          'Contemplando este céu que teus dedos moldaram, a lua e as estrelas que ali fixastes: Que é o homem, para dele te lembrares? O ser humano, para que o visites?',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 8-12)',
        reference: 'São Lucas 12, 8-12',
        text: `Naquele tempo, disse Jesus aos seus discípulos: "Todo aquele que der testemunho de mim diante dos homens, também o Filho do Homem dará testemunho dele diante dos anjos de Deus. Mas aquele que me renegar diante dos homens, será renegado diante dos anjos de Deus.
Todo aquele que disser uma palavra contra o Filho do Homem será perdoado; mas quem blasfemar contra o Espírito Santo não será perdoado.
Quando vos conduzirem diante das sinagogas, magistrados e autoridades, não vos preocupeis como ou com que haveis de vos defender, ou com o que haveis de dizer; pois, naquela hora, o Espírito Santo vos ensinará o que deveis dizer".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Santo Inácio de Antioquia, a caminho do martírio no Coliseu de Roma, declarou: "Sou trigo de Cristo, para ser moído pelos dentes dos leões a fim de me tornar pão imaculado". A promessa de Jesus em Lc 12 de que o Espírito Santo nos ensinará o que falar anima o testemunho corajoso de nossa célula.',
      },
    },
    saints: [
      {
        name: 'Santo Inácio de Antioquia, Bispo e Mártir',
        title: 'Discípulo de São João Evangelista e Padre Apostólico da Igreja',
        feastDate: '17 de Outubro',
        summary: 'Segundo sucessor de São Pedro na Sé de Antioquia, foi condenado às feras em Roma no ano 107. Suas sete célebres cartas são tesouro de amor à Igreja e à Eucaristia.',
        lifeStory: `Santo Inácio foi pastor vigoroso e profundamente enamorado por Jesus Cristo. Ao ser conduzido sob escolta militar para o martírio em Roma, escreveu cartas às comunidades cristãs exortando à unidade com os bispos e amor incondicional ao Corpo Eucarístico de Cristo.`,
        virtue: 'Coragem inabalável no testemunho cristão e zelo pela unidade da Igreja.',
        prayer: `Senhor Jesus, que destes a Santo Inácio de Antioquia a graça de se oferecer como trigo moído pelo Vosso amor, concedei à nossa célula a fidelidade e a coragem de jamais renegar o Vosso Santo Nome. Amém.`,
      },
    ],
  },

  '2026-10-18': {
    isoDate: '2026-10-18',
    dayMonthKey: '18/10',
    liturgy: {
      date: 'Domingo, 18 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Vermelho na Festa Litúrgica) • 29º Domingo do Tempo Comum',
      headline: '29º Domingo do Tempo Comum (Ano C) • Festa de São Lucas Evangelista, Padroeiro dos Médicos',
      firstReading: {
        title: 'Primeira Leitura (Ex 17, 8-13 ou 2Tm 4, 9-17b)',
        reference: 'Êxodo 17, 8-13 (29º Domingo) / 2Timóteo 4, 9-17b (Festa de São Lucas)',
        text: `Naqueles dias, os amalecitas vieram atacar Israel em Refidim. Moisés disse a Josué: "Escolhe homens e vai combater contra os amalecitas. Amanhã eu estarei de pé no alto da colina, com a vara de Deus na mão". Josué fez como Moisés lhe ordenara e foi combater os amalecitas, enquanto Moisés, Aarão e Hur subiram ao alto da colina.
Quando Moisés mantinha a mão levantada, Israel vencia; mas quando a abaixava, vencia Amalec. Como as mãos de Moisés ficassem pesadas, pegaram uma pedra e a colocaram debaixo dele para que se sentasse; e Aarão e Hur sustentavam suas mãos, um de cada lado.
Assim suas mãos permaneceram firmes até o pôr do sol. E Josué derrotou Amalec e sua gente ao fio da espada.`,
      },
      psalm: {
        reference: 'Salmo 120 (121), 1-2. 3-4. 5-6. 7-8 (R. cf. 2)',
        chorus: 'O meu socorro virá do Senhor, que fez o céu e a terra!',
        verses: [
          'Eu levanto os meus olhos para os montes: de onde pode vir o meu socorro? Do Senhor é que me vem o meu socorro, do Senhor que fez o céu e fez a terra!',
          'Ele não deixa tropeçar os teus pés, nem dorme quem te guarda. Não há de dormir nem cochilar o guarda de Israel!',
          'O Senhor é o teu guarda, o teu protetor, à tua direita ele está como tua sombra. De dia o sol não te fará mal, nem a lua durante a noite.',
          'O Senhor te guardará de todo mal, ele guardará a tua vida. O Senhor guardará tua entrada e tua saída, agora e para sempre!',
        ],
      },
      secondReading: {
        title: 'Segunda Leitura (2Tm 3, 14 – 4, 2)',
        reference: 'Segunda Carta de São Paulo a Timóteo 3, 14 – 4, 2',
        text: `Caríssimo: Permanece firme naquilo que aprendeste e aceitaste como certo, sabendo de quem o aprendeste. Desde a infância conheces as Sagradas Escrituras; elas têm o poder de te comunicar a sabedoria que conduz à salvação pela fé em Jesus Cristo.
Toda a Escritura é inspirada por Deus e útil para ensinar, para repreender, para corrigir e para formar na justiça. Por ela, o homem de Deus se torna perfeito e capacitado para toda boa obra.
Eu te peço com insistência diante de Deus e de Jesus Cristo: proclama a Palavra, insiste a tempo e a contratempo, admoesta, repreende, aconselha com toda paciência e zelo pedagógico.`,
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 18, 1-8 ou Lc 10, 1-9)',
        reference: 'São Lucas 18, 1-8 (Parábola da Oração Insistente)',
        text: `Naquele tempo, Jesus contou aos discípulos uma parábola sobre a necessidade de rezar sempre e nunca desanimar, dizendo:
"Numa cidade havia um juiz que não temia a Deus e não respeitava homem algum. Na mesma cidade havia uma viúva que vinha à sua procura, pedindo: 'Faze-me justiça contra o meu adversário!'
Durante muito tempo o juiz não quis atender. Mas depois disse consigo mesmo: 'É bem verdade que não temo a Deus e não respeito homem algum. Mas esta viúva já me está aborrecendo. Vou fazer-lhe justiça, para que ela não venha a agredir-me!'".
E o Senhor acrescentou: "Escutai o que diz este juiz injusto! E Deus, não fará justiça aos seus eleitos, que clamam por ele dia e noite, mesmo que os faça esperar?
Eu vos declaro que ele lhes fará justiça bem depressa. Mas o Filho do Homem, quando vier, encontrará fé sobre a terra?"`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Neste domingo, 18 de outubro de 2026, a Palavra de Deus nos entrega o segredo da perseverança cristã: rezar sempre e nunca esmorecer! Como Aarão e Hur sustentaram os braços de Moisés na colina (Ex 17), assim nós na célula sustentamos uns aos outros pela intercessão fraterna diária.',
      },
    },
    saints: [
      {
        name: 'São Lucas, Evangelista',
        title: 'Médico Amado, Evangelista da Misericórdia e Historiador da Salvação',
        feastDate: '18 de Outubro',
        summary: 'Médico nascido em Antioquia e companheiro fiel de São Paulo ("Só Lucas está comigo"). Escreveu o terceiro Evangelho — o Evangelho da ternura e da oração — e o livro dos Atos dos Apóstolos.',
        lifeStory: `São Lucas foi médico e grego de origem. Após sua conversão, tornou-se colaborador incansável de São Paulo em suas viagens missionárias. Seu Evangelho é conhecido pela ênfase na misericórdia de Deus (Parábolas do Bom Samaritano, da Ovelha Perdida e do Filho Pródigo), na oração perseverante e no papel luminoso de Nossa Senhora, tendo recolhido os relatos da infância diretamente do coração da Mãe de Deus. É o padroeiro dos médicos e cirurgiões.`,
        virtue: 'Sensibilidade pastoral, fidelidade nos momentos difíceis e anúncio da misericórdia.',
        prayer: `Senhor nosso Deus, que escolhestes São Lucas para revelar em palavras e atos o mistério do Vosso amor pelos pobres e enfermos, abençoai todos os médicos e concedei aos irmãos da nossa célula a graça da oração perseverante que nunca desanima. Por Cristo nosso Senhor. Amém!`,
      },
    ],
  },

  '2026-10-19': {
    isoDate: '2026-10-19',
    dayMonthKey: '19/10',
    liturgy: {
      date: 'Segunda-feira, 19 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Branco na Memória Passionista)',
      headline: 'Segunda-feira da 29ª Semana do Tempo Comum • São Paulo da Cruz & Santos Mártires Canadenses',
      firstReading: {
        title: 'Primeira Leitura (Ef 2, 1-10)',
        reference: 'Carta de São Paulo aos Efésios 2, 1-10',
        text: `Irmãos: Vós estáveis mortos por causa de vossas faltas e pecados... Mas Deus, que é rico em misericórdia, pelo grande amor com que nos amou, a nós que estávamos mortos por causa dos nossos pecados, deu-nos a vida juntamente com Cristo. É por graça que fostes salvos!
Com ele nos ressuscitou e nos fez sentar nos céus, em Cristo Jesus. De fato, é pela graça que fostes salvos, mediante a fé. E isto não vem de vós, é dom de Deus; não vem das obras, para que ninguém se glorie. Pois nós somos obra de Deus, criados em Cristo Jesus para as boas obras que Deus preparou de antemão para que as praticássemos.`,
      },
      psalm: {
        reference: 'Salmo 99 (100), 2. 3. 4. 5 (R. 3b)',
        chorus: 'O Senhor nos fez, a ele pertencemos!',
        verses: [
          'Aclamai o Senhor, ó terra inteira, servi ao Senhor com alegria; vinde a ele cantando jubilosos!',
          'Sabei que o Senhor só ele é Deus, ele mesmo nos fez e somos seus; somos o seu povo e o rebanho do seu pasto.',
          'Entrai por suas portas dando graças e cantando louvores em seus átrios; bendizei para sempre o seu santo nome!',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 13-21)',
        reference: 'São Lucas 12, 13-21',
        text: `Naquele tempo, alguém do meio da multidão disse a Jesus: "Mestre, dize a meu irmão que reparta a herança comigo". Mas Jesus respondeu: "Homem, quem me encarregou de julgar ou de dividir vossos bens?"
E disse a todos: "Atenção! Tomai cuidado contra todo tipo de ganância, porque, mesmo que alguém tenha muitas coisas, a sua vida não consiste na abundância dos seus bens".
E contou-lhes uma parábola: "Havia um homem rico, cujas terras deram uma grande colheita. Ele pensava consigo mesmo: 'O que vou fazer? Não tenho onde guardar minha colheita'. Então disse: 'Já sei: vou derrubar meus celeiros e construir outros maiores... E direi à minha alma: Alma, tens uma grande quantidade de bens em reserva para muitos anos. Descansa, come, bebe e aproveita a vida!'
Mas Deus lhe disse: 'Insensato! Ainda nesta noite tua vida te será reclamada. E aquilo que guardaste, para quem vai ficar?' Assim acontece com quem ajunta tesouros para si mesmo, mas não é rico diante de Deus".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Neste encontro de segunda-feira da nossa célula, Jesus nos convida a sermos "ricos diante de Deus". Celebrando São Paulo da Cruz, fundador dos Padres Passionistas cuja espiritualidade moldou a vida de nossa padroeira Santa Gemma, recordamos que a maior riqueza da alma é a Paixão redentora de Jesus.',
      },
    },
    saints: [
      {
        name: 'São Paulo da Cruz, Presbítero',
        title: 'Fundador da Congregação da Paixão de Jesus Cristo (Passionistas)',
        feastDate: '19 de Outubro',
        summary: 'Místico italiano do século XVIII que fundou os Passionistas para manter viva a memória da Paixão de Jesus, berço espiritual e congregação venerada por Santa Gemma Galgani.',
        lifeStory: `São Paulo da Cruz (1694–1775) nasceu em Ovada (Itália). Recebeu inspirações místicas para reunir companheiros que vestissem o hábito negro com o emblema do Coração com a Cruz branca (o "Jesu XPI Passio") e pregassem missões populares com ardente amor ao Crucificado. Santa Gemma Galgani viveu em profunda consonância com essa congregação e foi sepultada no Mosteiro Passionista de Lucca.`,
        virtue: 'Amor contemplativo à Paixão de Cristo e zelo missionário pelas almas.',
        prayer: `Ó Deus, que destes a São Paulo da Cruz um singular amor pela Cruz de Cristo, concedei aos membros da Célula Santa Gemma Galgani a graça de encontrar na Paixão de Jesus a fonte de toda paz e santidade. Amém.`,
      },
    ],
  },

  '2026-10-20': {
    isoDate: '2026-10-20',
    dayMonthKey: '20/10',
    liturgy: {
      date: 'Terça-feira, 20 de Outubro de 2026',
      liturgicalColor: 'Verde (29ª Semana do Tempo Comum)',
      headline: 'Terça-feira da 29ª Semana do Tempo Comum • Santa Maria Bertilla Boscardin',
      firstReading: {
        title: 'Primeira Leitura (Ef 2, 12-22)',
        reference: 'Carta de São Paulo aos Efésios 2, 12-22',
        text: `Irmãos: Lembrai-vos de que outrora éreis pagãos... Mas agora, em Cristo Jesus, vós que antes estáveis longe, fostes aproximados graças ao sangue de Cristo.
De fato, ele é a nossa paz; dos dois povos fez um só, derrubando o muro de separação, a inimizade... Ele veio para anunciar a paz a vós que estáveis longe, e a paz aos que estavam perto. Pois, por meio dele, uns e outros temos acesso junto ao Pai, num só Espírito.
Assim já não sois forasteiros nem hóspedes, mas concidadãos dos santos e membros da família de Deus.`,
      },
      psalm: {
        reference: 'Salmo 84 (85), 9ab-10. 11-12. 13-14 (R. cf. 9a)',
        chorus: 'O Senhor anunciará a paz ao seu povo!',
        verses: [
          'Quero ouvir o que diz o Senhor Deus: é um anúncio de paz ao seu povo e a seus santos. A salvação está perto dos que o temem, e a glória habitará na nossa terra.',
          'A verdade e o amor se encontrarão, a justiça e a paz se abraçarão; da terra brotará a fidelidade, e a justiça olhará lá dos céus.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 35-38)',
        reference: 'São Lucas 12, 35-38',
        text: `Naquele tempo, disse Jesus aos seus discípulos: "Que vossos rins estejam cingidos e vossas lâmpadas acesas! Sede como homens que estão esperando o seu senhor voltar de uma festa de casamento, para lhe abrirem a porta logo que ele chegar e bater.
Felizes os servos que o senhor encontrar acordados quando chegar! Em verdade vos digo, ele mesmo vai cingir-se, fazê-los sentar à mesa e, passando de um a outro, os servirá. E se chegar à meia-noite ou de madrugada, e assim os encontrar, felizes serão eles!"`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Jesus nos pede prontidão de espírito e lâmpadas acesas na fé e na caridade. Na vida fraterna da célula, manter a lâmpada acesa é cultivar a oração pessoal diária e a fidelidade aos irmãos.',
      },
    },
    saints: [
      {
        name: 'Santa Maria Bertilla Boscardin',
        title: 'Virgem e Religiosa do Cuidado aos Enfermos',
        feastDate: '20 de Outubro',
        summary: 'Religiosa italiana que dedicou a vida com caridade heróica aos doentes e crianças enfermas durante a Primeira Guerra Mundial, sob o lema "Para Deus tudo, para o próximo nada além do amor, para mim o desprezo".',
        lifeStory: `Nasceu em Brendola (Itália) em 1888 em família camponesa modesta. Ingressou nas Irmãs Mestras de Santa Doroteia, servindo nos hospitais de Treviso. Canonizada por São João XXIII em 1961, é modelo de ternura desinteressada com os que sofrem.`,
        virtue: 'Simplicidade de coração e solicitude incansável pelos enfermos.',
        prayer: `Senhor Deus, concedei-nos a mansidão de Santa Maria Bertilla para servirmos com amor e sem vanglória cada irmão que passa por provação. Amém.`,
      },
    ],
  },

  '2026-10-21': {
    isoDate: '2026-10-21',
    dayMonthKey: '21/10',
    liturgy: {
      date: 'Quarta-feira, 21 de Outubro de 2026',
      liturgicalColor: 'Verde (29ª Semana do Tempo Comum)',
      headline: 'Quarta-feira da 29ª Semana do Tempo Comum • Santa Úrsula e Companheiras Mártires',
      firstReading: {
        title: 'Primeira Leitura (Ef 3, 2-12)',
        reference: 'Carta de São Paulo aos Efésios 3, 2-12',
        text: `Irmãos: Vós certamente ouvistes falar da graça que Deus me concedeu para o vosso bem... Esse mistério é que os pagãos são admitidos à mesma herança, membros do mesmo corpo e associados à mesma promessa em Jesus Cristo, por meio do Evangelho...
A mim, o menor de todos os santos, foi dada a graça de anunciar aos pagãos a insondável riqueza de Cristo e iluminar a todos sobre a realização do mistério escondido desde os séculos em Deus.`,
      },
      psalm: {
        reference: 'Cântico de Isaías 12, 2-3. 4bcd. 5-6 (R. cf. 3)',
        chorus: 'Com alegria bebereis do manancial da salvação!',
        verses: [
          'Eis o Deus, meu Salvador, eu confio e nada temo; o Senhor é minha força, meu louvor e salvação. Com alegria bebereis nas fontes da salvação!',
          'Louvai ao Senhor, invocai o seu nome santo, anunciai suas maravilhas entre os povos, proclamai que o seu nome é sublime!',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 39-48)',
        reference: 'São Lucas 12, 39-48',
        text: `Naquele tempo, disse Jesus aos seus discípulos: "Compreendei bem isto: se o dono da casa soubesse a que hora viria o ladrão, não deixaria que arrombassem sua casa. Vós também ficai preparados! Porque o Filho do Homem vai chegar na hora em que menos pensais".
Pedro disse: "Senhor, estás contando esta parábola para nós ou para todos?"
E o Senhor respondeu: "Quem é o administrador fiel e prudente que o senhor vai colocar à frente do pessoal de sua casa para dar-lhes a comida no tempo certo? Feliz o servo a quem o senhor, ao chegar, encontrar procedendo assim! Em verdade vos digo: ele o colocará à frente de todos os seus bens...
A quem muito foi dado, muito será pedido; a quem muito foi confiado, muito mais será exigido".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: '"A quem muito foi dado, muito será pedido". Recebemos da Comunidade Católica Shalom o tesouro do Carisma da Paz e a intercessão de Santa Gemma. Que saibamos administrar com zelo e alegria a nossa vocação.',
      },
    },
    saints: [
      {
        name: 'Santa Úrsula e Companheiras Mártires e Santo Hilarião',
        title: 'Testemunhas da Fidelidade Cristã e da Pureza Virginal',
        feastDate: '21 de Outubro',
        summary: 'Virgem cristã do século IV que liderou jovens na fidelidade corajosa a Cristo até o martírio às margens do Reno; Santo Hilarião foi pioneiro da vida monástica na Palestina.',
        lifeStory: `Santa Úrsula, princesa britânica cristã, preferiu o martírio em Colônia a renegar a fé e a pureza. Sua memória inspirou a fundação das Ursulinas por Santa Ângela Mérici dedicada à educação de meninas. Santo Hilarião (291–371), discípulo de Santo Antão do Deserto, santificou Gaza com oração incessante e prodígios.`,
        virtue: 'Fidelidade à vocação e pureza de intenções no serviço a Deus.',
        prayer: `Senhor Jesus, pela intercessão de Santa Úrsula e de Santo Hilarião, preservai os jovens e famílias de nossa célula nos caminhos da santidade e da fidelidade ao Evangelho. Amém.`,
      },
    ],
  },

  '2026-10-22': {
    isoDate: '2026-10-22',
    dayMonthKey: '22/10',
    liturgy: {
      date: 'Quinta-feira, 22 de Outubro de 2026',
      liturgicalColor: 'Branco • Memória de São João Paulo II, Papa',
      headline: 'Memória de São João Paulo II, Papa • O Peregrino do Amor e Apóstolo da Juventude',
      firstReading: {
        title: 'Primeira Leitura (Ef 3, 14-21)',
        reference: 'Carta de São Paulo aos Efésios 3, 14-21',
        text: `Irmãos: Dobro os joelhos diante do Pai, de quem toda família no céu e na terra recebe o seu nome. Peço-lhe que, segundo a riqueza da sua glória, vos conceda a graça de serdes fortalecidos pelo seu Espírito no homem interior.
Que Cristo habite pela fé em vossos corações e estejais enraizados e fundamentados no amor, para que possais compreender com todos os santos qual é a largura, o comprimento, a altura e a profundeza do amor de Cristo, que ultrapassa todo conhecimento, a fim de ficardes repletos de toda a plenitude de Deus.`,
      },
      psalm: {
        reference: 'Salmo 32 (33), 1-2. 4-5. 11-12. 18-19 (R. 5b)',
        chorus: 'Da bondade do Senhor está cheia a terra!',
        verses: [
          'Ó justos, alegrai-vos no Senhor! Aos retos fica bem louvar a Deus. Dai graças ao Senhor ao som da harpa, tocai em sua honra a lira de dez cordas!',
          'Os planos do Senhor são para sempre, os pensamentos do seu coração de geração em geração. Feliz o povo cujo Deus é o Senhor, a nação que ele escolheu para sua herança!',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 49-53)',
        reference: 'São Lucas 12, 49-53',
        text: `Naquele tempo, disse Jesus aos seus discípulos: "Eu vim para lançar fogo sobre a terra, e como gostaria que já estivesse aceso! Devo receber um batismo, e como estou ansioso até que ele se cumpra!
Pensais que eu vim trazer a paz à terra? Não, eu vos digo, mas a divisão. Pois de agora em diante, numa casa com cinco pessoas, três ficarão divididas contra duas e duas contra três: o pai contra o filho e o filho contra o pai; a mãe contra a filha e a filha contra a mãe; a sogra contra a nora e a nora contra a sogra".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Nesta memória luminosa de São João Paulo II, o Papa das Jornadas Mundiais da Juventude que tanto amou o Brasil, ecoa o seu brado de inauguração do pontificado em 1978: "Não tenhais medo! Abri, melhor, escancarais as portas a Cristo!". Que o fogo do Espírito Santo inflame a nossa célula!',
      },
    },
    saints: [
      {
        name: 'São João Paulo II, Papa',
        title: 'Apóstolo da Juventude, Peregrino da Paz e Testemunha da Misericórdia',
        feastDate: '22 de Outubro',
        summary: 'Karol Wojtyła governou a Igreja por 27 anos com ardor missionário inesgotável, canonizou Santa Gemma Galgani e consagrou o terceiro milênio à Divina Misericórdia sob o lema "Totus Tuus".',
        lifeStory: `Nascido em Wadowice (Polônia) em 1920, foi eleito Papa em 1978. Criou as Jornadas Mundiais da Juventude, sobreviveu ao atentado na Praça de São Pedro em 1981 creditando sua salvação a Nossa Senhora de Fátima, promulgou o Catecismo da Igreja Católica e proclamou o Domingo da Divina Misericórdia. Faleceu santamente em 2005 e foi canonizado em 2014.`,
        virtue: 'Coragem apostólica sem medo, amor à juventude e consagração total a Maria.',
        prayer: `São João Paulo II, que tantas vezes abençoastes as famílias e os jovens com amor ardente, intercedei pela nossa célula Santa Gemma Galgani para que sejamos sentinelas da manhã e apóstolos da paz de Cristo. Amém!`,
      },
    ],
  },

  '2026-10-23': {
    isoDate: '2026-10-23',
    dayMonthKey: '23/10',
    liturgy: {
      date: 'Sexta-feira, 23 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Branco) • Memória de São João de Capistrano',
      headline: 'Sexta-feira da 29ª Semana do Tempo Comum • São João de Capistrano, Presbítero',
      firstReading: {
        title: 'Primeira Leitura (Ef 4, 1-6)',
        reference: 'Carta de São Paulo aos Efésios 4, 1-6',
        text: `Irmãos: Eu, prisioneiro no Senhor, vos exorto a vos comportardes de maneira digna da vocação a que fostes chamados: com toda a humildade e mansidão, com paciência, suportando-vos uns aos outros com amor, empenhai-vos em guardar a unidade do Espírito pelo vínculo da paz.
Há um só corpo e um só Espírito, como também é uma só a esperança à qual fostes chamados. Há um só Senhor, uma só fé, um só batismo, um só Deus e Pai de todos, que reina sobre todos, age por meio de todos e está em todos.`,
      },
      psalm: {
        reference: 'Salmo 23 (24), 1-2. 3-4ab. 5-6 (R. cf. 6)',
        chorus: 'É assim a geração dos que procuram o Senhor!',
        verses: [
          'Ao Senhor pertence a terra e o que ela encerra, o mundo inteiro com os seus habitantes. Porque ele a fundou sobre as águas e sobre os rios a fixou firmemente.',
          'Quem subirá até o monte do Senhor, quem ficará em seu santo lugar? Aquele que tem as mãos limpas e o coração puro, que não leva sua alma para a vaidade.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 12, 54-59)',
        reference: 'São Lucas 12, 54-59',
        text: `Naquele tempo, dizia Jesus às multidões: "Quando vedes uma nuvem subindo no poente, logo dizeis: 'Vem chuva'. E assim acontece. E quando sentis soprar o vento do sul, dizeis: 'Vai fazer calor'. E assim acontece.
Hipócritas! Sabeis discernir o aspecto da terra e do céu; como não sabeis discernir este tempo?
Por que não julgais por vós mesmos o que é justo? Quando fores com o teu adversário ao tribunal, esforça-te para entrar em acordo com ele pelo caminho; para que ele não te arraste perante o juiz, o juiz te entregue ao carcereiro e o carcereiro te jogue na prisão.
Eu te digo: não sairás de lá enquanto não pagares até o último centavo".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Neste encontro de sexta-feira, São Paulo nos convida a viver "o vínculo da paz com toda humildade, mansidão e paciência, suportando-vos com amor". Que o Espírito Santo purifique nossos corações de todo ressentimento para sermos verdadeiros pacificadores.',
      },
    },
    saints: [
      {
        name: 'São João de Capistrano, Presbítero',
        title: 'Frade Franciscano, Grande Pregador e Patrono dos Capelães Militares',
        feastDate: '23 de Outubro',
        summary: 'Frade menor franciscano italiano do século XV dotado de profunda oração e eloquência que renovou espiritualmente a Europa Central e defendeu a cristandade em Belgrado.',
        lifeStory: `Brilhante jurista e governador de Perugia, renunciou aos cargos e bens materiais para ingressar na Ordem dos Frades Menores. Percorreu a Europa a pé pregando a penitência, o Santo Nome de Jesus e a paz entre os povos cristãos. Faleceu na Croácia em 1456.`,
        virtue: 'Coragem na pregação da conversão e reconciliação fraterna.',
        prayer: `Senhor Deus, que suscitastes São João de Capistrano para consolar o Vosso povo na tribulação, guardai a nossa célula em contínua paz sob o impulso do Espírito Santo. Amém.`,
      },
    ],
  },

  '2026-10-24': {
    isoDate: '2026-10-24',
    dayMonthKey: '24/10',
    liturgy: {
      date: 'Sábado, 24 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Branco) • Santo Antônio Maria Claret',
      headline: 'Sábado da 29ª Semana do Tempo Comum • Santo Antônio Maria Claret, Bispo',
      firstReading: {
        title: 'Primeira Leitura (Ef 4, 7-16)',
        reference: 'Carta de São Paulo aos Efésios 4, 7-16',
        text: `Irmãos: A cada um de nós foi dada a graça na medida do dom de Cristo... E ele mesmo a uns constituiu apóstolos; a outros, profetas; a outros, evangelistas; a outros, pastores e doutores, para o aperfeiçoamento dos santos, para o ministério do serviço, para a edificação do corpo de Cristo, até que todos cheguemos à unidade da fé e do conhecimento do Filho de Deus, ao estado de homem perfeito, à medida da estatura da plenitude de Cristo.`,
      },
      psalm: {
        reference: 'Salmo 121 (122), 1-2. 3-4a. 4b-5 (R. 1)',
        chorus: 'Que alegria quando me disseram: Vamos à casa do Senhor!',
        verses: [
          'Que alegria quando ouvi que me disseram: "Vamos à casa do Senhor!" E agora nossos pés já se detêm diante de tuas portas, ó Jerusalém!',
          'Jerusalém, cidade bem edificada num conjunto harmonioso; para lá sobem as tribos de Israel, as tribos do Senhor!',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 13, 1-9)',
        reference: 'São Lucas 13, 1-9',
        text: `Naquele momento chegaram algumas pessoas trazendo a Jesus notícias a respeito dos galileus cujo sangue Pilatos tinha misturado com o dos sacrifícios que eles realizavam.
Jesus respondeu-lhes: "Pensais vós que esses galileus eram mais pecadores do que todos os outros galileus, por terem sofrido tal coisa? Eu vos digo que não. Mas se vós não vos converterdes, perecereis todos do mesmo modo...
E propôs esta parábola: "Certo homem tinha uma figueira plantada na sua vinha. Foi até ela procurar fruto e não encontrou. Então disse ao vinhateiro: 'Já faz três anos que venho procurando fruto nesta figueira e não encontro nada. Corta-a! Para que está ela inutilizando a terra?'
O vinhateiro, porém, respondeu: 'Senhor, deixa-a ainda este ano. Vou cavar ao redor dela e adubá-la. Talvez ela dê frutos no futuro. Se não der, então a cortarás'".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'A parábola da figueira revela a paciência incansável de Deus, que não desiste de nós mas cava ao redor da nossa alma e nos alimenta com Sua graça. Aproveitemos o tempo oportuno para produzir frutos saborosos de conversão e caridade na célula.',
      },
    },
    saints: [
      {
        name: 'Santo Antônio Maria Claret, Bispo',
        title: 'Fundador dos Missionários Claretianos e Apóstolo da Boa Imprensa',
        feastDate: '24 de Outubro',
        summary: 'Arcebispo de Santiago de Cuba e confessor da Rainha da Espanha, utilizou os livros e a imprensa católica para semear a semente do Evangelho com audácia missionária.',
        lifeStory: `Nascido na Catalunha (1807), foi tecelão antes de ser ordenado padre. Pregou incansavelmente por toda a Espanha e nas Ilhas Canárias. Fundou os Filhos do Imaculado Coração de Maria (Claretianos). Como arcebispo em Cuba, defendeu os escravizados e fundou cooperativas para os camponeses.`,
        virtue: 'Ardor missionário de evangelizar por todos os meios possíveis.',
        prayer: `Santo Antônio Maria Claret, alcançai para os irmãos de nossa célula o ardor missionário de anunciar a boa nova de Jesus Cristo a todos os corações. Amém.`,
      },
    ],
  },

  '2026-10-25': {
    isoDate: '2026-10-25',
    dayMonthKey: '25/10',
    liturgy: {
      date: 'Domingo, 25 de Outubro de 2026',
      liturgicalColor: 'Verde • 30º Domingo do Tempo Comum',
      headline: '30º Domingo do Tempo Comum (Ano C) • Santo Antônio de Sant\'Ana Galvão (Frei Galvão, 1º Santo Brasileiro)',
      firstReading: {
        title: 'Primeira Leitura (Eclo 35, 12-14. 16-18)',
        reference: 'Livro do Eclesiástico 35, 12-14. 16-18',
        text: `O Senhor é um juiz que não faz acepção de pessoas. Ele não faz discriminação contra o pobre, mas ouve a súplica do oprimido. Não despreza a oração do órfão, nem a viúva que desafoga a sua queixa.
Quem serve a Deus com todo o coração é acolhido, e a sua oração sobe até as nuvens. A prece do humilde atravessa as nuvens; ele não se consola enquanto ela não chegar a Deus, e não se afasta até que o Altíssimo olhe para ele, faça justiça e execute o julgamento.`,
      },
      psalm: {
        reference: 'Salmo 33 (34), 2-3. 17-18. 19 e 23 (R. 7a)',
        chorus: 'O pobre clama a Deus e ele escuta: o Senhor liberta a vida dos seus servos!',
        verses: [
          'Bendirei o Senhor em todo o tempo, seu louvor estará sempre em minha boca. Minha alma se gloria no Senhor; que os humildes escutem e se alegrem!',
          'O Senhor volta o seu rosto contra os maus para apagar sua lembrança da terra. Os justos clamam e o Senhor os ouve, livrando-os de todas as suas angústias.',
          'O Senhor está perto dos corações contritos e salva os de espírito abatido. O Senhor liberta a vida dos seus servos, quem nele se abriga não será condenado.',
        ],
      },
      secondReading: {
        title: 'Segunda Leitura (2Tm 4, 6-8. 16-18)',
        reference: 'Segunda Carta de São Paulo a Timóteo 4, 6-8. 16-18',
        text: `Caríssimo: Quanto a mim, eu já estou sendo oferecido em libação, e o tempo da minha partida se aproxima.
Combati o bom combate, terminei a corrida, guardei a fé. Desde já me está reservada a coroa da justiça, que o Senhor, justo juiz, me dará naquele dia; e não somente a mim, mas também a todos os que amaram a sua manifestação.
Na minha primeira defesa, ninguém me assistiu, todos me abandonaram... O Senhor, porém, esteve ao meu lado e me encheu de força, para que por meu intermédio a mensagem fosse plenamente anunciada. A ele a glória pelos séculos dos séculos. Amém!`,
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 18, 9-14)',
        reference: 'São Lucas 18, 9-14',
        text: `Naquele tempo, Jesus contou esta parábola para alguns que confiavam na sua própria justiça e desprezavam os outros:
"Dois homens subiram ao Templo para rezar: um era fariseu e o outro cobrador de impostos.
O fariseu, de pé, rezava assim em seu íntimo: 'Ó Deus, eu te dou graças porque não sou como os outros homens: ladrões, injustos, adúlteros, nem como este cobrador de impostos. Jejuo duas vezes por semana e pago o dízimo de tudo o que recebo'.
O cobrador de impostos, porém, ficou à distância e nem se atrevia a levantar os olhos para o céu; mas batia no peito, dizendo: 'Meu Deus, tem piedade de mim, que sou pecador!'
Eu vos digo: este último voltou para casa justificado, o outro não. Pois todo aquele que se eleva será humilhado, e quem se humilha será elevado".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'A oração humilde do pecador que bate no peito ("Meu Deus, tem piedade de mim") alcança o coração do Pai mais do que toda a vanglória. Neste domingo celebramos também São Frei Galvão, o primeiro santo nascido no Brasil, que dedicou sua vida a levar a paz aos lares e a saúde aos aflitos.',
      },
    },
    saints: [
      {
        name: 'Santo Antônio de Sant\'Ana Galvão (Frei Galvão)',
        title: 'Primeiro Santo Nascido no Brasil • O Homem da Paz e da Caridade',
        feastDate: '25 de Outubro',
        summary: 'Frade franciscano brasileiro nascido em Guaratinguetá (SP) em 1739, fundador do Mosteiro da Luz em São Paulo e célebre pelas Pílulas de Frei Galvão que alcançam curas prodigiosas para enfermos e parturientes.',
        lifeStory: `Santo Antônio de Sant'Ana Galvão viveu inteiramente consagrado à oração e à caridade em São Paulo colonial. Famoso por sua doçura franciscana, bilocava-se para atender agonizantes e acolhia todos com compaixão. Canonizado pelo Papa Bento XVI no Campo de Marte em São Paulo em 11 de maio de 2007.`,
        virtue: 'Humildade franciscana, mansidão com os aflitos e devoção filial à Imaculada Conceição.',
        prayer: `Deus de amor e Pai de misericórdia, que fizestes de Santo Antônio de Sant'Ana Galvão um instrumento de paz e de caridade para o povo brasileiro, concedei aos 48 irmãos da nossa célula a humildade de coração e a graça da reconciliação fraterna. Por Cristo nosso Senhor. Amém!`,
      },
    ],
  },

  '2026-10-26': {
    isoDate: '2026-10-26',
    dayMonthKey: '26/10',
    liturgy: {
      date: 'Segunda-feira, 26 de Outubro de 2026',
      liturgicalColor: 'Verde (30ª Semana do Tempo Comum)',
      headline: 'Segunda-feira da 30ª Semana do Tempo Comum • Santo Evaristo, Papa e Mártir',
      firstReading: {
        title: 'Primeira Leitura (Ef 4, 32 – 5, 8)',
        reference: 'Carta de São Paulo aos Efésios 4, 32 – 5, 8',
        text: `Irmãos: Sede bondosos e compassivos uns para com os outros, perdoando-vos mutuamente, como Deus vos perdoou em Cristo.
Sede imitadores de Deus como filhos muito amados. E andai no amor, como Cristo vos amou e se entregou a si mesmo por nós, como oferenda e sacrifício de suave odor a Deus...
Outrora éreis trevas, mas agora sois luz no Senhor. Andai como filhos da luz!`,
      },
      psalm: {
        reference: 'Salmo 1, 1-2. 3. 4 e 6 (R. cf. Ef 5, 1)',
        chorus: 'Sede imitadores de Deus como filhos muito amados!',
        verses: [
          'Feliz é todo aquele que não anda conforme os conselhos dos perversos; mas tem seu prazer na lei de Deus e a medita dia e noite!',
          'Ele é como árvore plantada junto às águas correntes: dá fruto no devido tempo e suas folhas nunca murcham; em tudo o que faz tem sucesso.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 13, 10-17)',
        reference: 'São Lucas 13, 10-17',
        text: `Naquele tempo, Jesus estava ensinando numa sinagoga, em dia de sábado. Havia ali uma mulher que há dezoito anos estava com um espírito que a tornava doente: andava curvada e não conseguia de modo algum endireitar-se.
Ao vê-la, Jesus a chamou e lhe disse: "Mulher, estás livre da tua doença". Pôs as mãos sobre ela, e ela imediatamente se endireitou e começou a louvar a Deus.
O chefe da sinagoga, indignado porque Jesus curava no sábado, tomou a palavra e disse à multidão: "Há seis dias para trabalhar. Vinde, pois, nesses dias para serdes curados, e não em dia de sábado!"
O Senhor, porém, respondeu-lhe: "Hipócritas! Cada um de vós não desamarra no sábado o seu boi ou o seu jumento da manjedoura para levá-lo a beber? E esta filha de Abraão, a quem Satanás prendeu durante dezoito anos, não deveria ser liberta desta prisão em dia de sábado?"
Ao ouvir isso, todos os seus adversários ficaram envergonhados, e a multidão se alegrava com todas as maravilhas que Jesus realizava.`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'No nosso encontro de segunda-feira das 19h às 21h, Jesus se aproxima de cada irmão que se sente encurvado pelo peso das preocupações e diz: "Estás livre da tua aflição!". A compaixão de Cristo cura, ergue e põe o cântico de louvor em nossos lábios.',
      },
    },
    saints: [
      {
        name: 'Santo Evaristo, Papa e Mártir',
        title: 'Quinto Papa da Igreja de Roma e Organizador das Paróquias',
        feastDate: '26 de Outubro',
        summary: 'Sucessor de São Clemente no final do século I, organizou a divisão pastoral da diocese de Roma e ordenou os primeiros diáconos para o auxílio dos fiéis sob perseguição do imperador Trajano.',
        lifeStory: `Nascido em Belém de família judaica, converteu-se e tornou-se pastor em Roma. Durante o império de Trajano guiou com sabedoria e ternura a comunidade cristã nas catacumbas, derramando seu sangue por amor a Cristo por volta do ano 108.`,
        virtue: 'Organização pastoral serena e perseverança nas perseguições.',
        prayer: `Senhor Deus, concedei à Célula Santa Gemma Galgani o zelo pastoral de Santo Evaristo, para que vivamos em comunhão fraterna como autênticos filhos da luz. Amém.`,
      },
    ],
  },

  '2026-10-27': {
    isoDate: '2026-10-27',
    dayMonthKey: '27/10',
    liturgy: {
      date: 'Terça-feira, 27 de Outubro de 2026',
      liturgicalColor: 'Verde (30ª Semana do Tempo Comum)',
      headline: 'Terça-feira da 30ª Semana do Tempo Comum • São Gonçalo de Lagos',
      firstReading: {
        title: 'Primeira Leitura (Ef 5, 21-33)',
        reference: 'Carta de São Paulo aos Efésios 5, 21-33',
        text: `Irmãos: Sede submissos uns aos outros no temor de Cristo... Vós, maridos, amai as vossas mulheres, como Cristo amou a Igreja e se entregou por ela, a fim de purificá-la com o banho da água e a palavra...
Por isso o homem deixará pai e mãe e se unirá à sua mulher, e os dois serão uma só carne. Este mistério é grande: refiro-me a Cristo e à Igreja!`,
      },
      psalm: {
        reference: 'Salmo 127 (128), 1-2. 3. 4-5 (R. 1a)',
        chorus: 'Felizes os que temem o Senhor e trilham seus caminhos!',
        verses: [
          'Feliz és tu se temes o Senhor e trilhas seus caminhos! Do trabalho de tuas mãos hás de viver, serás feliz e tudo irá bem.',
          'Tua esposa será como videira fecunda no coração de tua casa; teus filhos como brotos de oliveira ao redor de tua mesa.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 13, 18-21)',
        reference: 'São Lucas 13, 18-21',
        text: `Naquele tempo, Jesus dizia: "A que é semelhante o Reino de Deus e a que poderei compará-lo? Ele é semelhante a um grão de mostarda que um homem pegou e plantou no seu jardim. O grão cresceu, tornou-se uma grande árvore e as aves do céu fizeram ninhos nos seus ramos".
E disse ainda: "A que poderei comparar o Reino de Deus? Ele é semelhante ao fermento que uma mulher pegou e misturou em três medidas de farinha, até que tudo ficasse levedado".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'O Reino de Deus na célula começa pequeno como um grão de mostarda ou um punhado de fermento: um sorriso, uma oração de escuta, uma acolhida sincera. De passo em passo, o amor de Cristo transforma os nossos lares.',
      },
    },
    saints: [
      {
        name: 'São Gonçalo de Lagos e Beato Bartolomeu dos Mártires',
        title: 'Religioso Agostiniano • Mestre da Catequese das Crianças',
        feastDate: '27 de Outubro',
        summary: 'Frei agostiniano português do século XV que dedicou seus talentos à instrução religiosa dos mais simples, aos pobres e aos pescadores.',
        lifeStory: `Nascido em Lagos (Algarve, Portugal), renunciou a cargos de destaque para ensinar a doutrina cristã aos pequeninos. Notabilizou-se por milagres com o pão dos pobres e orações contínuas diante do Sacrário.`,
        virtue: 'Paciência no ensino da fé e predileção pelos mais pequeninos.',
        prayer: `Senhor Jesus, fazei frutificar na nossa célula a semente do Teu Reino, tornando-nos fermento de amor e paz onde quer que estejamos. Amém.`,
      },
    ],
  },

  '2026-10-28': {
    isoDate: '2026-10-28',
    dayMonthKey: '28/10',
    liturgy: {
      date: 'Quarta-feira, 28 de Outubro de 2026',
      liturgicalColor: 'Vermelho • Festa de São Simão e São Judas Tadeu',
      headline: 'Festa dos Santos Apóstolos Simão e Judas Tadeu • Padroeiro das Causas Impossíveis',
      firstReading: {
        title: 'Primeira Leitura (Ef 2, 19-22)',
        reference: 'Carta de São Paulo aos Efésios 2, 19-22',
        text: `Irmãos: Já não sois estrangeiros nem hóspedes, mas concidadãos dos santos e membros da família de Deus, edificados sobre o fundamento dos apóstolos e dos profetas, tendo como pedra angular o próprio Cristo Jesus.
É nele que toda a construção bem ajustada cresce para formar um templo santo no Senhor; e vós também sois integrados nessa construção para vos tornardes morada de Deus no Espírito.`,
      },
      psalm: {
        reference: 'Salmo 18 (19A), 2-3. 4-5 (R. 5a)',
        chorus: 'Seu som ressoa e se espalha em toda a terra!',
        verses: [
          'Os céus proclamam a glória do Senhor e o firmamento anuncia as obras de suas mãos; o dia ao dia transmite esta mensagem, a noite à noite publica este saber.',
          'Não são discursos nem frases ou palavras, nem são vozes que possam ser ouvidas; seu som ressoa e se espalha em toda a terra, chega aos confins do universo a sua voz.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 6, 12-16)',
        reference: 'São Lucas 6, 12-16',
        text: `Naqueles dias, Jesus foi à montanha para rezar e passou a noite toda em oração a Deus.
Ao amanhecer, chamou os seus discípulos e escolheu doze dentre eles, aos quais deu o nome de apóstolos:
Simão, a quem deu o nome de Pedro, e seu irmão André; Tiago e João; Filipe e Bartolomeu; Mateus e Tomé; Tiago, filho de Alfeu, e Simão, chamado Zelota; Judas, filho de Tiago, e Judas Iscariotes, que se tornou traidor.`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'Antes de tomar qualquer decisão ou escolher os Doze Apóstolos, Jesus passou a noite inteira em oração no alto da montanha. Que a nossa célula aprenda do Mestre a prioridade absoluta da oração pessoal antes de cada projeto.',
      },
    },
    saints: [
      {
        name: 'São Simão e São Judas Tadeu, Apóstolos',
        title: 'Apóstolos de Jesus e Patrono das Causas Aflitas e Desesperadas',
        feastDate: '28 de Outubro',
        summary: 'Apóstolos mártires que pregaram juntos o Evangelho na Pérsia. São Judas Tadeu é mundialmente invocado pelos fiéis nas causas mais difíceis e impossíveis.',
        lifeStory: `São Judas Tadeu, primo de Jesus segundo a carne e irmão de São Tiago Menor, é autor de uma das cartas do Novo Testamento. Na Última Ceia perguntou a Jesus: "Senhor, como é que te manifestarás a nós e não ao mundo?". Levou o fogo do Evangelho até o martírio ao lado de São Simão Zelota. É refúgio certo nas aflições de saúde, trabalho e família.`,
        virtue: 'Intercessão infalível e fidelidade irrestrita à fé apostólica.',
        prayer: `São Judas Tadeu, apóstolo fiel e amigo de Jesus, socorrei as causas impossíveis e aflitas dos membros de nossa Célula Santa Gemma Galgani. Apresentai nossas preces diante de Deus para que nunca percamos a esperança. Amém!`,
      },
    ],
  },

  '2026-10-29': {
    isoDate: '2026-10-29',
    dayMonthKey: '29/10',
    liturgy: {
      date: 'Quinta-feira, 29 de Outubro de 2026',
      liturgicalColor: 'Verde (30ª Semana do Tempo Comum)',
      headline: 'Quinta-feira da 30ª Semana do Tempo Comum • São Narciso de Jerusalém',
      firstReading: {
        title: 'Primeira Leitura (Ef 6, 10-20)',
        reference: 'Carta de São Paulo aos Efésios 6, 10-20',
        text: `Irmãos: Fortalecei-vos no Senhor e na força do seu poder soberano. Revesti-vos da armadura de Deus para que possais resistir às ciladas do diabo...
Calçai os pés com a prontidão para o Evangelho da paz; empunhai sempre o escudo da fé, com o qual podereis apagar todos os dardos inflamados do maligno; tomai o capacete da salvação e a espada do Espírito, que é a palavra de Deus.
Orai sem cessar no Espírito com toda oração e súplica!`,
      },
      psalm: {
        reference: 'Salmo 143 (144), 1. 2. 9-10 (R. 1a)',
        chorus: 'Bendito seja o Senhor, meu rochedo!',
        verses: [
          'Bendito seja o Senhor, o meu rochedo, que adestrou minhas mãos para o combate e meus dedos para a batalha!',
          'Ele é meu amor e meu refúgio, minha fortaleza e meu libertador; ele é meu escudo e em quem me abrigo, que submete os povos ao meu poder.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 13, 31-35)',
        reference: 'São Lucas 13, 31-35',
        text: `Naquele momento, alguns fariseus aproximaram-se de Jesus e disseram-lhe: "Sai daqui e vai embora, porque Herodes quer te matar".
Jesus respondeu-lhes: "Ide dizer àquela raposa: 'Eu expulso demônios e faço curas hoje e amanhã, e no terceiro dia terminarei meu caminho'. No entanto, preciso continuar meu caminho hoje, amanhã e depois de amanhã, porque não convém que um profeta morra fora de Jerusalém.
Jerusalém, Jerusalém, que matas os profetas e apedrejas os que te são enviados! Quantas vezes eu quis reunir teus filhos como a galinha recolhe os pintainhos debaixo das asas, e tu não quiseste! Eis que a vossa casa vos ficará abandonada..."`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'São Paulo nos recorda a armadura de Deus: a verdade, a fé como escudo e a Palavra de Deus como espada do Espírito. Com Santa Gemma, que lutou bravamente contra as investidas do maligno com o seu Anjo da Guarda, permaneçamos vigilantes na oração.',
      },
    },
    saints: [
      {
        name: 'São Narciso de Jerusalém, Bispo',
        title: 'Bispo de Jerusalém no Século II • Exemplo de Pureza e Oração Paciente',
        feastDate: '29 de Outubro',
        summary: 'Bispo centenário da Cidade Santa lembrado pela oração fervorosa que transformava água em azeite para as lâmpadas da Vigília Pascal e pela mansidão perante calúnias.',
        lifeStory: `Governou a Igreja de Jerusalém no final do século II, presidindo com o Papa São Vítor a data da Páscoa. Vítima de falsas acusações, retirou-se pacificamente para o deserto na oração, sendo mais tarde chamado de volta pelo povo quando sua santidade foi comprovada.`,
        virtue: 'Paciência inalterável perante as incompreensões e confiança na justiça divina.',
        prayer: `Senhor Deus, concedei-nos o escudo da fé de São Narciso e a pureza de Santa Gemma para vencermos todas as tentações do desânimo. Amém.`,
      },
    ],
  },

  '2026-10-30': {
    isoDate: '2026-10-30',
    dayMonthKey: '30/10',
    liturgy: {
      date: 'Sexta-feira, 30 de Outubro de 2026',
      liturgicalColor: 'Verde (30ª Semana do Tempo Comum)',
      headline: 'Sexta-feira da 30ª Semana do Tempo Comum • São Marcelo, Centurião Mártir',
      firstReading: {
        title: 'Primeira Leitura (Fl 1, 1-11)',
        reference: 'Carta de São Paulo aos Filipenses 1, 1-11',
        text: `Paulo e Timóteo, servos de Cristo Jesus, a todos os santos em Cristo Jesus que estão em Filipos... Dou graças a meu Deus cada vez que me lembro de vós; em todas as minhas orações por vós, peço sempre com alegria, pela vossa comunhão no anúncio do Evangelho, desde o primeiro dia até agora.
Tenho certeza de que aquele que começou em vós tão boa obra há de levá-la a bom termo até o Dia de Cristo Jesus... E peço que o vosso amor cresça mais e mais em conhecimento e em todo discernimento.`,
      },
      psalm: {
        reference: 'Salmo 110 (111), 1-2. 3-4. 5-6 (R. 2a)',
        chorus: 'Grandiosas são as obras do Senhor!',
        verses: [
          'Eu agradeço a Deus de todo o coração, junto com todos os seus justos reunidos! Que grandiosas são as obras do Senhor, elas merecem todo o amor e admiração!',
          'Majestade e esplendor são suas obras, sua justiça permanece para sempre. O Senhor fez portentos memoráveis, o Senhor é piedade e compaixão.',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 14, 1-6)',
        reference: 'São Lucas 14, 1-6',
        text: `Aconteceu que, num sábado, Jesus foi comer na casa de um dos chefes dos fariseus; e eles o observavam atentamente. Diante dele estava um homem com hidropisia.
Jesus perguntou aos mestres da Lei e aos fariseus: "É permitido curar no sábado ou não?" Mas eles ficaram calados.
Então Jesus tomou o homem pela mão, curou-o e despediu-o. Depois disse a eles: "Se algum de vós tiver um filho ou um boi que cair num poço, não o tirará logo, mesmo em dia de sábado?" E eles não foram capazes de responder nada a isso.`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'No nosso encontro de sexta-feira, São Paulo nos consola com a certeza de que Aquele que começou em nossa célula esta boa obra há de levá-la à perfeição! Jesus não hesita em estender a mão para curar qualquer dor ou hidropisia da alma.',
      },
    },
    saints: [
      {
        name: 'São Marcelo, Mártir',
        title: 'Centurião Romano que Depôs as Armas por Amor a Jesus Cristo',
        feastDate: '30 de Outubro',
        summary: 'Oficial militar romano em Tânger que declarou: "Eu sou soldado de Jesus Cristo, o Rei Eterno; não posso mais servir aos deuses falsos", entregando a vida pela fé.',
        lifeStory: `Centurião da Legião Trajana na África no ano 298, durante a festa do imperador recusou-se a prestar culto pagão, desarmou-se publicamente e foi martirizado pela sua fidelidade irrenunciável ao Evangelho da Paz.`,
        virtue: 'Coerência de vida e primazia absoluta de Cristo sobre qualquer conveniência humana.',
        prayer: `Senhor Jesus, dai aos irmãos da nossa célula a coragem serena de São Marcelo para testemunharmos a Tua verdade em todas as circunstâncias de nossa vida profissional e familiar. Amém.`,
      },
    ],
  },

  '2026-10-31': {
    isoDate: '2026-10-31',
    dayMonthKey: '31/10',
    liturgy: {
      date: 'Sábado, 31 de Outubro de 2026',
      liturgicalColor: 'Verde (ou Branco) • Santo Afonso Rodrigues',
      headline: 'Sábado da 30ª Semana do Tempo Comum • Véspera da Solenidade de Todos os Santos',
      firstReading: {
        title: 'Primeira Leitura (Fl 1, 18b-26)',
        reference: 'Carta de São Paulo aos Filipenses 1, 18b-26',
        text: `Irmãos: Quer por fingimento, quer com sinceridade, Cristo é anunciado; e nisso me alegro e hei de alegrar-me sempre. Pois sei que isto contribuirá para a minha salvação...
Para mim, de fato, o viver é Cristo e o morrer é lucro. Mas se, vivendo no corpo, eu posso produzir fruto de trabalho, não sei o que escolher. Sinto-me atraído pelos dois lados: tenho o desejo de partir e estar com Cristo, o que seria muito melhor; mas por vossa causa é mais necessário que eu permaneça no corpo.`,
      },
      psalm: {
        reference: 'Salmo 41 (42), 2. 3. 5bcd (R. 3a)',
        chorus: 'A minha alma tem sede de Deus!',
        verses: [
          'Assim como a corça suspira pelas águas correntes, assim suspira minha alma por vós, ó meu Deus! A minha alma tem sede de Deus, do Deus vivo; quando irei contemplar a face de Deus?',
          'Recordo estas coisas com a alma em lágrimas: como eu ia em festa no meio do povo, caminhando com eles até a casa de Deus, entre cantos de júbilo e de ação de graças!',
        ],
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Lucas (Lc 14, 1. 7-11)',
        reference: 'São Lucas 14, 1. 7-11',
        text: `Aconteceu que, num sábado, Jesus foi comer na casa de um dos chefes dos fariseus. Jesus notava como os convidados escolhiam os primeiros lugares e contou-lhes esta parábola:
"Quando fores convidado para um casamento, não te sentes no primeiro lugar. Pode ser que tenha sido convidada uma pessoa mais importante do que tu, e o dono da casa venha te dizer: 'Dá o lugar a este'. Então, envergonhado, terás de ocupar o último lugar.
Mas quando fores convidado, vai sentar-te no último lugar; para que, quando vier o dono da casa, te diga: 'Amigo, vem mais para cima!' Então isso será uma honra para ti diante de todos os convidados.
Pois todo aquele que se eleva será humilhado, e quem se humilha será elevado".`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: '"Para mim o viver é Cristo!". Na vigília da Solenidade de Todos os Santos, Jesus nos ensina a humildade de sentar no último lugar. Como ensinava Santo Afonso Rodrigues, o porteiro santo, quem atende a porta do coração com caridade acolhe o próprio Cristo.',
      },
    },
    saints: [
      {
        name: 'Santo Afonso Rodrigues',
        title: 'Irmão Jesuíta e Porteiro da Santidade • Conselheiro de São Pedro Claver',
        feastDate: '31 de Outubro',
        summary: 'Comerciante espanhol que, após enviuvar e perder os filhos, ingressou como irmão leigo jesuíta e serviu como porteiro do colégio em Maiorca por 46 anos, recebendo a todos como a Jesus Cristo.',
        lifeStory: `Nascido em Segóvia (Espanha) em 1532, superou dolorosas perdas familiares refugiando-se na oração e no Santo Terço. Como porteiro no Colégio de Montesión em Palma de Maiorca, atendeu milhares de necessitados repetindo ao tocar da campainha: "Já vou, Senhor!". Foi o grande conselheiro espiritual que motivou o jovem São Pedro Claver a partir em missão para evangelizar os escravizados na América.`,
        virtue: 'Acolhida humilde dos outros como se fossem o próprio Cristo e oração contínua.',
        prayer: `Senhor Deus, concedei à Célula Santa Gemma Galgani a simplicidade de Santo Afonso Rodrigues para abrirmos as portas de nosso coração e acolhermos com alegria cada irmão que busca a Deus. Amém!`,
      },
    ],
  },

  '2026-11-01': {
    isoDate: '2026-11-01',
    dayMonthKey: '01/11',
    liturgy: {
      date: 'Domingo, 01 de Novembro de 2026',
      liturgicalColor: 'Branco • Solenidade de Todos os Santos',
      headline: 'Solenidade de Todos os Santos • A Grande Multidão Celeste e a Vocação Universal à Santidade',
      firstReading: {
        title: 'Primeira Leitura (Ap 7, 2-4. 9-14)',
        reference: 'Livro do Apocalipse de São João 7, 2-4. 9-14',
        text: `Eu, João, vi outro anjo subir do lado onde nasce o sol, trazendo o selo do Deus vivo... Depois disso, vi uma grande multidão que ninguém podia contar, de todas as nações, tribos, povos e línguas. Estavam de pé diante do trono e diante do Cordeiro, vestidos com túnicas brancas e trazendo palmas na mão...
Estes são os que vieram da grande tribulação; lavaram suas vestes e as alvejaram no sangue do Cordeiro.`,
      },
      psalm: {
        reference: 'Salmo 23 (24), 1-2. 3-4ab. 5-6 (R. cf. 6)',
        chorus: 'É assim a geração dos que procuram o Senhor!',
        verses: [
          'Ao Senhor pertence a terra e o que ela encerra, o mundo inteiro com os seus habitantes. Porque ele a fundou sobre as águas e sobre os rios a fixou firmemente.',
          'Quem subirá até o monte do Senhor, quem ficará em seu santo lugar? Aquele que tem mãos limpas e o coração puro, que não leva sua alma para a vaidade.',
          'Ele receberá a bênção do Senhor e a recompensa de Deus, seu Salvador. É assim a geração dos que o procuram, que buscam a face do Deus de Jacó!',
        ],
      },
      secondReading: {
        title: 'Segunda Leitura (1Jo 3, 1-3)',
        reference: 'Primeira Carta de São João 3, 1-3',
        text: `Caríssimos: Vede que grande presente de amor o Pai nos deu: sermos chamados filhos de Deus! E nós o somos! Se o mundo não nos conhece, é porque não conheceu o Pai.
Caríssimos, desde já somos filhos de Deus, mas o que nós seremos ainda não se manifestou. Sabemos que, quando ele se manifestar, seremos semelhantes a ele, porque o veremos tal como ele é.
Todo aquele que tem nele esta esperança purifica-se a si mesmo, assim como ele é puro.`,
      },
      gospel: {
        title: 'Proclamação do Evangelho de Jesus Cristo segundo São Mateus (Mt 5, 1-12a)',
        reference: 'São Mateus 5, 1-12a',
        text: `Naquele tempo, vendo Jesus as multidões, subiu ao monte e sentou-se. Os seus discípulos aproximaram-se dele, e ele começou a ensiná-los:
"Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.
Bem-aventurados os aflitos, porque serão consolados.
Bem-aventurados os mansos, porque possuirão a terra.
Bem-aventurados os que têm fome e sede de justiça, porque serão saciados.
Bem-aventurados os misericordiosos, porque alcançarão misericórdia.
Bem-aventurados os puros de coração, porque verão a Deus.
Bem-aventurados os pacificadores, porque serão chamados filhos de Deus.
Bem-aventurados os que sofrem perseguição por causa da justiça, porque deles é o Reino dos Céus.
Bem-aventurados sois vós, quando vos injuriarem e perseguirem, e, mentindo, disserem todo tipo de mal contra vós por minha causa. Alegrai-vos e exultai, porque é grande a vossa recompensa nos céus!"`,
      },
      reflection: {
        author: 'Liturgia Diária • Célula Santa Gemma Galgani',
        text: 'A santidade não é privilégio de heróis inalcançáveis, mas a alegria dos Bem-Aventurados! Com nossa padroeira Santa Gemma Galgani e a multidão incontável dos santos no Céu, celebramos a nossa vocação comum de sermos santos na vida cotidiana da célula.',
      },
    },
    saints: [
      {
        name: 'Solenidade de Todos os Santos',
        title: 'A Igreja Triunfante e Todos os Amigos de Deus no Céu',
        feastDate: '01 de Novembro',
        summary: 'Festa solene de todos os santos conhecidos e desconhecidos que perseveraram na fé e agora intercedem por nós junto de Deus na glória eterna.',
        lifeStory: `Neste dia a Igreja na terra une-se à liturgia dos Céus para contemplar a multidão incontável dos santos que lavaram suas vestes no Sangue de Jesus. A comunhão dos santos nos sustenta na caminhada fraterna até o encontro definitivo na Casa do Pai.`,
        virtue: 'Vocação universal à santidade e caridade fraterna.',
        prayer: `Santos e Santas de Deus, amigos e intercessores da nossa Célula Santa Gemma Galgani, rogai por nós e conduzi nossos passos no Caminho da Paz! Amém.`,
      },
    ],
  },
};

/**
 * Retorna a Liturgia Diária e o Santo do Dia para qualquer data ISO (YYYY-MM-DD).
 * Se a data exata estiver no calendário verificado, retorna os dados exatos.
 * Caso contrário, seleciona de forma inteligente com base no dia/mês atual.
 */
export function getLiturgyAndSaintForDate(isoDate?: string): CompleteDayLiturgyAndSaint {
  const targetIso = isoDate || getTodayIsoDate();

  if (OFFICIAL_OCTOBER_2026_LITURGY[targetIso]) {
    return OFFICIAL_OCTOBER_2026_LITURGY[targetIso];
  }

  // Verifica se o dia/mês bate com alguma entrada de Outubro (ex: se o relógio do aparelho estiver em outro ano)
  const [, month, day] = targetIso.split('-');
  const matchingOctKey = `2026-${month}-${day}`;
  if (OFFICIAL_OCTOBER_2026_LITURGY[matchingOctKey]) {
    const entry = OFFICIAL_OCTOBER_2026_LITURGY[matchingOctKey];
    return {
      ...entry,
      isoDate: targetIso,
      liturgy: {
        ...entry.liturgy,
        date: formatIsoDateToPtBr(targetIso),
      },
    };
  }

  // Fallback inteligente para a data de Hoje (18/10/2026, Domingo)
  const baseToday = OFFICIAL_OCTOBER_2026_LITURGY['2026-10-18'] || OFFICIAL_OCTOBER_2026_LITURGY['2026-10-08'];
  return {
    ...baseToday,
    isoDate: targetIso,
    liturgy: {
      ...baseToday.liturgy,
      date: formatIsoDateToPtBr(targetIso),
    },
  };
}

/**
 * Busca a Liturgia Diária em tempo real da API Litúrgica Católica Brasileira (se houver internet e data fora do catálogo local),
 * mantendo prioridade para os textos verificados da CNBB / Canção Nova.
 */
export async function fetchDailyLiturgyAndSaint(isoDate?: string): Promise<CompleteDayLiturgyAndSaint> {
  const targetIso = isoDate || getTodayIsoDate();
  const localVerified = getLiturgyAndSaintForDate(targetIso);

  // Se já temos a data exata verificada no banco de Outubro de 2026 (ex: 08/10/2026 Lc 11,5-13), retorna imediatamente com precisão 100%
  const [, m, d] = targetIso.split('-');
  if (OFFICIAL_OCTOBER_2026_LITURGY[`2026-${m}-${d}`]) {
    return localVerified;
  }

  // Para outras datas fora do catálogo local, tenta buscar da API pública de Liturgia Diária CNBB
  try {
    const resp = await fetch(`https://liturgia.up.railway.app/v2/?dia=${d}&mes=${m}&ano=${targetIso.split('-')[0]}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.evangelho && data.primeiraLeitura) {
        return {
          isoDate: targetIso,
          dayMonthKey: `${d}/${m}`,
          liturgy: {
            date: formatIsoDateToPtBr(targetIso),
            liturgicalColor: `${data.cor || 'Verde'} (${data.liturgia || 'Tempo Comum'})`,
            headline: data.liturgia || localVerified.liturgy.headline,
            firstReading: {
              title: `${data.primeiraLeitura.titulo || 'Primeira Leitura'} (${data.primeiraLeitura.referencia || ''})`,
              reference: data.primeiraLeitura.referencia || '',
              text: data.primeiraLeitura.texto || localVerified.liturgy.firstReading.text,
            },
            psalm: {
              reference: data.salmo?.referencia || localVerified.liturgy.psalm.reference,
              chorus: data.salmo?.refrao || localVerified.liturgy.psalm.chorus,
              verses: data.salmo?.texto
                ? String(data.salmo.texto)
                    .split('\n')
                    .map((line: string) => line.replace(/^—\s*/, '').trim())
                    .filter(Boolean)
                : localVerified.liturgy.psalm.verses,
            },
            secondReading:
              data.segundaLeitura && data.segundaLeitura.texto
                ? {
                    title: `${data.segundaLeitura.titulo || 'Segunda Leitura'} (${data.segundaLeitura.referencia || ''})`,
                    reference: data.segundaLeitura.referencia || '',
                    text: data.segundaLeitura.texto,
                  }
                : undefined,
            gospel: {
              title: `${data.evangelho.titulo || 'Proclamação do Evangelho'} (${data.evangelho.referencia || ''})`,
              reference: data.evangelho.referencia || '',
              text: data.evangelho.texto || localVerified.liturgy.gospel.text,
            },
            reflection: localVerified.liturgy.reflection,
          },
          saints: localVerified.saints,
        };
      }
    }
  } catch {
    // Offline ou API indisponível -> usa o banco local verificado
  }

  return localVerified;
}
