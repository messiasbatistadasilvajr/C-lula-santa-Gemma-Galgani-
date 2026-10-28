/**
 * Serviço de Santos do Dia & Santoral Católico
 * Célula Santa Gemma Galgani • Comunidade Católica Shalom
 * 
 * Fornece o Santo do Dia para qualquer data do ano, com nome, resumo de sua história,
 * biografia detalhada, virtude exemplar, citação marcante e oração oficial de intercessão.
 */

import { SaintOfDay } from '../types';
import { getLiturgyAndSaintForDate, getTodayIsoDate } from './liturgyCalendar';

export interface DetailedSaint extends SaintOfDay {
  id: string;
  dayMonthKey: string; // Ex: '11/04' ou '05/10'
  category: 'padroeira' | 'mistico' | 'doutor' | 'martir' | 'juventude' | 'pastor' | 'mariano';
  patronage?: string;
  famousQuote?: string;
  century?: string;
}

/**
 * Catálogo rico e verificado de grandes Santos da Igreja Católica e santos do dia a dia
 */
export const SAINTS_DATABASE: DetailedSaint[] = [
  // 1. Padroeira Principal da Célula
  {
    id: 'santa-gemma-galgani',
    name: 'Santa Gemma Galgani',
    title: 'Virgem e Mística Passionista • Padroeira da Nossa Célula',
    feastDate: '11 de Abril / 16 de Maio',
    dayMonthKey: '11/04',
    category: 'padroeira',
    patronage: 'Dos farmacêuticos, estudantes, jovens em provação e da nossa Célula',
    century: 'Século XIX (1878 - 1903)',
    summary: 'Jovem leiga italiana conhecida como o "Lírio de Lucca", recebeu os estigmas da Paixão de Jesus e viveu em constante colóquio com seu Anjo da Guarda, ensinando que a santidade floresce no amor à Cruz cotidiana.',
    lifeStory: `Santa Gemma Galgani nasceu em Camigliano (Itália) em 12 de março de 1878. Desde a infância demonstrou extraordinária intimidade com Deus e amor filial à Paixão de Cristo.
Após superar graves doenças pela intercessão de São Gabriel de Nossa Senhora das Dores e de Santa Margarida Maria Alacoque, recebeu em 1899 a graça mística dos estigmas sagrados em suas mãos, pés e coração.
Viveu como leiga consagrada na casa da família Giannini, sendo exemplo de pureza incondicional, oração fervorosa e caridade silenciosa. Seu anjo da guarda lhe era visível e a acompanhava nas batalhas espirituais.
Faleceu santamente em 11 de abril de 1903, no Sábado Santo, aos 25 anos de idade, e foi canonizada pelo Papa Pio XII em 1940. É a amada padroeira e modelo de seguimento a Cristo para a nossa célula Shalom.`,
    virtue: 'Amor apaixonado pela Cruz de Cristo, pureza de coração e colóquio com o Anjo da Guarda.',
    famousQuote: '"Se verdadeiramente desejas amar a Jesus, aprende primeiro a sofrer por Ele, porque o sofrimento ensina a amar."',
    prayer: `Ó Santa Gemma, que vos tornastes hóstia viva de amor com Cristo Crucificado, alcançai para todos os 48 irmãos da nossa célula a fidelidade à oração pessoal, a pureza nos pensamentos e a coragem de abraçar com júbilo o carisma da paz. Amém.`,
  },

  // 01 de Outubro
  {
    id: 'santa-teresinha',
    name: 'Santa Teresinha do Menino Jesus',
    title: 'Virgem, Doutora da Igreja e Padroeira das Missões',
    feastDate: '01 de Outubro',
    dayMonthKey: '01/10',
    category: 'doutor',
    patronage: 'Das missões universais, dos floristas e dos jovens',
    century: 'Século XIX (1873 - 1897)',
    summary: 'Religiosa carmelita francesa que ensinou ao mundo a "Pequena Via" da infância espiritual: santificar cada pequeno gesto diário com infinito amor.',
    lifeStory: `Marie-Françoise-Thérèse Martin nasceu em Alençon (França) e ingressou aos 15 anos no Carmelo de Lisieux. Em sua autobiografia "História de uma Alma", revelou o caminho da confiança e do abandono nas mãos misericordiosas do Pai.
Sem nunca ter saído da clausura do mosteiro, sua ardente intercessão pela salvação das almas fez a Igreja proclamá-la Padroeira Universal das Missões ao lado de São Francisco Xavier e Doutora da Igreja pelo Papa São João Paulo II.`,
    virtue: 'Infância espiritual, confiança cega na misericórdia de Deus e oferta do amor nos pequenos atos.',
    famousQuote: '"No coração da Igreja, minha Mãe, eu serei o Amor!"',
    prayer: `Santa Teresinha do Menino Jesus, derramai sobre nossa célula a chuva de rosas do amor fraterno e ensinai-nos a trilhar com simplicidade o Vosso pequeno caminho de santidade. Amém.`,
  },

  // 02 de Outubro
  {
    id: 'santos-anjos-da-guarda',
    name: 'Santos Anjos da Guarda',
    title: 'Nossos Santos Protetores e Mensageiros Celestes',
    feastDate: '02 de Outubro',
    dayMonthKey: '02/10',
    category: 'mariano',
    patronage: 'De todas as almas cristãs e protetores da nossa célula',
    century: 'Eternidade',
    summary: 'Ministros divinos designados pelo Criador para guardar, iluminar, governar e conduzir cada um de nós pelo caminho da salvação até o Reino dos Céus.',
    lifeStory: `A celebração dos Santos Anjos da Guarda recorda a paternidade cuidadosa de Deus, que atribui a cada ser humano um companheiro espiritual e defensor invisível desde o primeiro instante da vida.
Santa Gemma Galgani tinha relação constante e visível com seu anjo da guarda, confiando-lhe cartas e orações. Na espiritualidade católica, o anjo da guarda é mestre de oração, escudo contra as ciladas do maligno e consolador nas angústias.`,
    virtue: 'Docilidade às inspirações do Espírito Santo e prontidão no louvor a Deus.',
    famousQuote: '"Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarde, me governe, me ilumine. Amém."',
    prayer: `Santos Anjos da Guarda dos 48 irmãos de nossa célula, defendei-nos nos combates espirituais e guardai nossos lares na paz e concórdia. Amém.`,
  },

  // 04 de Outubro
  {
    id: 'sao-francisco-de-assis',
    name: 'São Francisco de Assis',
    title: 'O Pobrezinho de Assis • Fundador da Ordem Franciscana',
    feastDate: '04 de Outubro',
    dayMonthKey: '04/10',
    category: 'mistico',
    patronage: 'Da ecologia, dos animais, dos pobres e da Paz',
    century: 'Séculos XII - XIII (1182 - 1226)',
    summary: 'Jovem nobre que renunciou a todas as glórias mundanas para abraçar a "Dama Pobreza", reconstruir a Igreja de Cristo e viver o Evangelho em fraternidade com toda a criação.',
    lifeStory: `Nascido em Assis (Itália), filho de rico comerciante de tecidos, Francisco ouviu a voz de Cristo no crucifixo de São Damião: "Francisco, vai e reconstrói a minha Igreja que está em ruínas".
Despojou-se de tudo, reuniu irmãos ao redor do Santo Evangelho e fundou a Ordem dos Frades Menores e as Clarissas com Santa Clara. No Monte Alverne, recebeu os sagrados estigmas de Jesus Crucificado. Compôs o "Cântico das Criaturas" e tornou-se ícone mundial da fraternidade e da paz.`,
    virtue: 'Pobreza evangélica, fraternidade sincera, reconciliação e amor à criação.',
    famousQuote: '"Senhor, fazei-me um instrumento de vossa paz. Onde houver ódio, que eu leve o amor."',
    prayer: `São Francisco de Assis, dai à nossa célula o Vosso ardor missionário e o espírito de paz e bem, para que sejamos instrumentos vivos de reconciliação em nosso meio. Amém.`,
  },

  // 05 de Outubro
  {
    id: 'sao-benedito-santa-faustina',
    name: 'São Benedito e Santa Faustina Kowalska',
    title: 'Apóstola da Divina Misericórdia e Santo da Humildade e Caridade',
    feastDate: '05 de Outubro',
    dayMonthKey: '05/10',
    category: 'mistico',
    patronage: 'Dos cozinheiros, afrodescendentes e devotos da Divina Misericórdia',
    century: 'São Benedito (XVI) / Santa Faustina (XX)',
    summary: 'No Brasil celebra-se com imensa devoção São Benedito, o Mouro, exemplo de humildade fraterna na cozinha do convento, e na Igreja Universal Santa Faustina, mensageira da Divina Misericórdia.',
    lifeStory: `Santa Faustina (1905–1938), religiosa polonesa, recebeu de Jesus as revelações contidas em seu célebre Diário: a imagem de Jesus Misericordioso com os raios pálido e vermelho, a Festa da Misericórdia e o Terço da Divina Misericórdia para a salvação do mundo inteiro.
No Brasil, São Benedito (1526–1589), filho de escravizados na Sicília, ingressou nos franciscanos e, mesmo analfabeto e ocupando a cozinha, conquistou corações pela oração mística, sabedoria espiritual e abundância de pães aos necessitados.`,
    virtue: 'Humildade profunda, caridade generosa e confiança absoluta no Coração de Jesus.',
    famousQuote: '"Jesus, eu confio em Vós!"',
    prayer: `Ó Jesus Misericordioso, pelas preces de Santa Faustina e São Benedito, derramai rios de misericórdia sobre as famílias de nossa célula e fazei-nos fiéis no socorro aos mais necessitados. Amém.`,
  },

  // 06 de Outubro
  {
    id: 'sao-bruno',
    name: 'São Bruno, Presbítero',
    title: 'Fundador da Ordem dos Cartuxos • Mestre da Contemplação',
    feastDate: '06 de Outubro',
    dayMonthKey: '06/10',
    category: 'doutor',
    patronage: 'Da contemplação, da vida monástica e dos estudantes de teologia',
    century: 'Século XI (1030 - 1101)',
    summary: 'Brilhante mestre da Universidade de Reims que deixou a notoriedade acadêmica para fundar no deserto das montanhas de Chartreuse uma das ordens monásticas mais dedicadas ao silêncio.',
    lifeStory: `Nascido em Colônia (Alemanha), tornou-se renomado teólogo e chanceler da arquidiocese de Reims. Desejando buscar unicamente o Absoluto de Deus, renunciou às dignidades eclesiásticas e com seis companheiros retirou-se para a solidão alpina, dando origem à Cartuxa.
Seu lema atravessou mil anos: "Stat Crux dum volvitur orbis" (A Cruz permanece firme enquanto o mundo gira).`,
    virtue: 'Silêncio interior, oração perseverante e desapego das vaidades do mundo.',
    famousQuote: '"A Cruz permanece firme enquanto o mundo gira."',
    prayer: `Ó Deus, que concedestes a São Bruno a graça de Vos servir na solidão e na oração contínua, concedei aos membros de nossa célula a graça de encontrar momentos de recolhimento para escutar Tua voz. Amém.`,
  },

  // 07 de Outubro
  {
    id: 'nossa-senhora-do-rosario',
    name: 'Nossa Senhora do Rosário',
    title: 'Rainha do Santíssimo Rosário • Protetora da Cristandade',
    feastDate: '07 de Outubro',
    dayMonthKey: '07/10',
    category: 'mariano',
    patronage: 'De toda a Igreja, dos devotos do Santo Terço e das vitórias da fé',
    century: 'Tradição Apostólica / Batalha de Lepanto (1571)',
    summary: 'A Santíssima Virgem Maria venerada sob o título do Santo Rosário, oração contemplativa predileta dos santos que recapitula os mistérios da encarnação, paixão e ressurreição de Cristo.',
    lifeStory: `Instituída pelo Papa São Pio V em ação de graças pela vitória na histórica batalha de Lepanto em 1571, onde os fiéis rezaram incessantemente o Santo Rosário pela preservação da civilização cristã.
Nossa Senhora confirmou em Lourdes e Fátima o seu desejo materno: "Rezem o terço todos os dias para alcançar a paz no mundo e o fim das guerras". O rosário é arma espiritual de ternura e fortaleza.`,
    virtue: 'Fidelidade filial à Mãe de Deus e contemplação meditativa dos mistérios de Cristo.',
    famousQuote: '"Fazei tudo o que Ele vos disser!" (Jo 2, 5)',
    prayer: `Nossa Senhora do Rosário, abençoai o Terço Virtual de nossa célula e cobri com Vosso manto de amor cada irmão e irmã em suas batalhas diárias. Amém.`,
  },

  // 08 de Outubro
  {
    id: 'santa-pelagia-simeao',
    name: 'Santa Pelágia, São Simeão e Santa Reparata',
    title: 'Testemunhas da Conversão, da Esperança e do Martírio',
    feastDate: '08 de Outubro',
    dayMonthKey: '08/10',
    category: 'martir',
    patronage: 'Dos penitentes, dos anciãos justos e da pureza juvenil',
    century: 'Séculos III e IV',
    summary: 'Santa Pelágia testemunhou a força da conversão e da oração penitente; São Simeão acolheu a Salvação no Templo em Jerusalém; e Santa Reparata manteve a pureza cristã até o martírio.',
    lifeStory: `Santa Pelágia, ao ouvir as pregações de São Nono, converteu-se de sua vida de vaidades e entregou-se à oração solitária no Monte das Oliveiras.
Neste mesmo dia recorda-se o venerável Simeão, o profeta de Deus que no Templo tomou o Menino Jesus nos braços exclamando: "Agora, Senhor, podes deixar partir em paz o teu servo, porque meus olhos viram a tua Salvação!".
E Santa Reparata, jovem virgem que aos 12 anos deu o supremo testemunho de sangue por Jesus em Cesareia.`,
    virtue: 'Disposição para recomeçar em Deus, pureza e esperança na Salvação.',
    famousQuote: '"Agora, Senhor, podes deixar partir teu servo em paz, conforme a tua palavra, porque meus olhos viram a tua salvação!"',
    prayer: `Senhor Deus, concedei-nos o coração puro de Pelágia e Reparata e os olhos iluminados de Simeão para reconhecermos a presença viva de Jesus em nossa célula. Amém.`,
  },

  // 09 de Outubro
  {
    id: 'sao-dionisio-joao-leonardi',
    name: 'São Dionísio e São João Leonardi',
    title: 'Primeiro Bispo de Paris e Apóstolo da Renovação Católica',
    feastDate: '09 de Outubro',
    dayMonthKey: '09/10',
    category: 'pastor',
    patronage: 'Da França, de Paris e da evangelização dos povos',
    century: 'Séculos III e XVI',
    summary: 'São Dionísio evangelizou as Gálias e entregou a vida no martírio em Montmartre; São João Leonardi foi pioneiro da formação sacerdotal e dos seminários missionários.',
    lifeStory: `São Dionísio foi enviado de Roma a Paris no século III para semear o Evangelho. Sofreu perseguição feroz e foi decapitado no monte que desde então se chama Montmartre ("Monte dos Mártires").
São João Leonardi (1541–1609) trabalhou incansavelmente após o Concílio de Trento na catequese das crianças, fundou a Congregação dos Clérigos Regulares da Mãe de Deus e colaborou na criação da Congregação para a Propagação da Fé.`,
    virtue: 'Coragem evangelizadora e ardor apostólico missionário.',
    famousQuote: '"Quem quer que pretenda uma reforma da Igreja deve começar por si mesmo."',
    prayer: `Concedei-nos, Senhor, a audácia apostólica de São Dionísio e São João Leonardi para testemunharmos Vosso Reino em nossos ambientes de trabalho e estudo. Amém.`,
  },

  // 10 de Outubro
  {
    id: 'sao-daniel-comboni',
    name: 'São Daniel Comboni',
    title: 'Apóstolo da África e Fundador dos Missionários Combonianos',
    feastDate: '10 de Outubro',
    dayMonthKey: '10/10',
    category: 'pastor',
    patronage: 'Das missões africanas e dos defensores dos direitos humanos',
    century: 'Século XIX (1831 - 1881)',
    summary: 'Bispo missionário italiano que dedicou sua existência ao lema "Salvar a África com a África", combatendo a escravidão e semeando a fé com dedicação incondicional.',
    lifeStory: `Nascido no norte da Itália, sentiu o apelo de anunciar Cristo no Sudão e na África Central em condições extremas de clima, febres e perseguição.
Defendia que os próprios africanos deveriam ser os protagonistas da evangelização e da promoção humana de seu continente. Faleceu em Cartum aos 50 anos, exausto de trabalhos missionários, repetindo: "Eu morro, mas minha obra não morrerá".`,
    virtue: 'Amor intrépido pelos povos marginalizados e dedicação total à missão.',
    famousQuote: '"Salvar a África com a África, ou dar a vida por ela!"',
    prayer: `São Daniel Comboni, acendei no coração dos jovens da nossa célula o fogo missionário de levar a alegria do Evangelho a todos os cantos. Amém.`,
  },

  // 11 de Outubro
  {
    id: 'sao-joao-xxiii',
    name: 'São João XXIII, Papa',
    title: 'O "Papa Bom" • Iniciador do Concílio Vaticano II',
    feastDate: '11 de Outubro',
    dayMonthKey: '11/10',
    category: 'pastor',
    patronage: 'Da paz universal e dos concílios ecumênicos',
    century: 'Século XX (1881 - 1963)',
    summary: 'Angelo Giuseppe Roncalli encantou o mundo com sua afabilidade e bondade pastoral, abrindo as janelas da Igreja para o sopro renovador do Espírito Santo no Concílio Vaticano II.',
    lifeStory: `Originário de família camponesa simples de Sotto il Monte, foi diplomata do Vaticano na Bulgária, Turquia e França, salvando milhares de judeus durante a Segunda Guerra Mundial.
Eleito Papa aos 77 anos em 1958, surpreendeu a Igreja convocando o Concílio Ecumênico Vaticano II para um aggiornamento pastoral. Sua encíclica "Pacem in Terris" foi marco de fraternidade universal. Canonizado em 2014 pelo Papa Francisco.`,
    virtue: 'Bondade serena, mansidão, diálogo e confiança na Providência Divina.',
    famousQuote: '"Ao voltar para casa, deem uma carícia aos seus filhos e digam: \'Esta é a carícia do Papa\'."',
    prayer: `São João XXIII, ensinai-nos a cultivar a mansidão e a alegria do Evangelho no convívio com nossos irmãos de célula e em nossas famílias. Amém.`,
  },

  // 12 de Outubro
  {
    id: 'nossa-senhora-aparecida',
    name: 'Nossa Senhora da Conceição Aparecida',
    title: 'Rainha e Padroeira Principal do Brasil',
    feastDate: '12 de Outubro',
    dayMonthKey: '12/10',
    category: 'mariano',
    patronage: 'De toda a nação brasileira, dos pescadores e dos pobres',
    century: '1717 até hoje',
    summary: 'A bendita imagem encontrada nas águas do Rio Paraíba do Sul pelos pescadores, sinal de esperança, libertação dos oprimidos e unidade do povo brasileiro sob o manto maternal de Maria.',
    lifeStory: `Em outubro de 1717, três pescadores simples (Domingos Garcia, Felipe Pedroso e João Alves) após horas sem apanhar peixes, recolheram na rede primeiro o corpo e depois a cabeça da imagem enegrecida da Imaculada Conceição. Imediatamente a pesca foi tão abundante que o barco quase soçobrou.
A devoção espalhou-se rapidamente com inúmeros prodígios, como o rompimento das correntes do escravo Zacarias. Em 1930 o Papa Pio XI proclamou Nossa Senhora Aparecida Padroeira do Brasil. Seu Santuário Nacional é o maior templo mariano do mundo.`,
    virtue: 'Maternidade compassiva, refúgio dos aflitos e zelo pelos pequeninos.',
    famousQuote: '"Aparecida das águas, Mãe do povo brasileiro, rogai por nós!"',
    prayer: `Ó incomparável Senhora da Conceição Aparecida, Mãe de Deus e nossa Mãe, abençoai nossa Pátria, protegei os 48 irmãos de nossa célula e conduzi-nos sempre a Jesus Cristo. Amém!`,
  },

  // 12 de Outubro - Carlo Acutis
  {
    id: 'sao-carlo-acutis',
    name: 'Beato Carlo Acutis',
    title: 'O Apóstolo da Internet e da Eucaristia',
    feastDate: '12 de Outubro',
    dayMonthKey: '12/10',
    category: 'juventude',
    patronage: 'Dos jovens, internautas, programadores e catequistas',
    century: 'Século XXI (1991 - 2006)',
    summary: 'Jovem apaixonado pela Eucaristia ("Minha autoestrada para o Céu"), usou a informática e a internet para evangelizar e documentar os milagres eucarísticos do mundo antes de falecer aos 15 anos.',
    lifeStory: `Nascido em Londres e criado em Milão, Carlo levava vida ordinária de estudante, jogava videogame, andava de bicicleta e amava animais, mas centrava seus dias na Missa diária e no Santo Rosário.
Com genialidade computacional precoce, criou o catálogo virtual dos Milagres Eucarísticos. Ao ser diagnosticado com leucemia fulminante aos 15 anos, ofereceu seus sofrimentos pelo Papa e pela Igreja. Seu corpo descansa em Assis e é modelo de juventude luminosa.`,
    virtue: 'Amor ardente à Eucaristia, originalidade santa e uso evangelizador da tecnologia.',
    famousQuote: '"Todos nascem como originais, mas muitos morrem como fotocópias."',
    prayer: `Beato Carlo Acutis, intercedei pela juventude e pelos membros de nossa célula, para que façamos da Eucaristia nossa autoestrada diária para o Céu. Amém!`,
  },

  // 13 de Outubro
  {
    id: 'santo-eduardo-fatima',
    name: 'Santo Eduardo e Memória do Milagre de Fátima',
    title: 'Rei da Inglaterra e Aniversário da Última Aparição de Fátima',
    feastDate: '13 de Outubro',
    dayMonthKey: '13/10',
    category: 'mariano',
    patronage: 'Dos governantes justos, dos casamentos em dificuldade e devotos de Fátima',
    century: 'Séculos XI (Santo Eduardo) e XX (1917)',
    summary: 'Data que une a santidade de Santo Eduardo o Confessor, rei que governou com justiça e caridade, à memória gloriosa do Milagre do Sol em Fátima perante 70 mil pessoas.',
    lifeStory: `Santo Eduardo (1003–1066) foi rei da Inglaterra lembrado pela benevolência, proteção aos órfãos e construção da Abadia de Westminster.
Em 13 de outubro de 1917, na Cova da Iria em Fátima (Portugal), a Virgem Maria realizou o profetizado "Milagre do Sol" presenciado por crentes e céticos, confirmando a mensagem de oração, conversão e consagração ao Seu Imaculado Coração.`,
    virtue: 'Justiça nos atos, integridade no serviço e atendimento aos apelos marianos.',
    famousQuote: '"O meu Imaculado Coração será o teu refúgio e o caminho que te conduzirá até Deus."',
    prayer: `Nossa Senhora de Fátima e Santo Eduardo, ensinai nossa célula a viver na retidão e a perseverar na oração diária pelo triunfo do Imaculado Coração. Amém.`,
  },

  // 14 de Outubro
  {
    id: 'sao-calisto-i',
    name: 'São Calisto I, Papa e Mártir',
    title: 'Defensor da Misericórdia e Organizador das Catacumbas',
    feastDate: '14 de Outubro',
    dayMonthKey: '14/10',
    category: 'pastor',
    patronage: 'Dos cemitérios cristãos e dos que acolhem os pecadores arrependidos',
    century: 'Século III (faleceu em 222)',
    summary: 'De escravo a Sumo Pontífice, São Calisto administrou o famoso cemitério da Via Ápia em Roma (Catacumbas de São Calisto) e defendeu o perdão generoso aos pecadores arrependidos.',
    lifeStory: `Nascido escravo romano, superou sofrimentos e trabalhos forçados nas minas da Sardenha. Ordenado diácono pelo Papa Zeferino, organizou o cemitério oficial da Igreja de Roma na Via Ápia.
Eleito Papa em 217, combateu heresias trinitárias e enfrentou rigoristas acolhendo com bondade evangélica os pecadores penitentes, afirmando que a Igreja deve ser mãe misericordiosa. Morreu mártir jogado em um poço em Trastevere.`,
    virtue: 'Acolhimento aos caídos, misericórdia pastoral e fidelidade até o martírio.',
    famousQuote: '"A Igreja de Cristo não repele quem chora seus pecados, mas abre seus braços para erguê-lo."',
    prayer: `São Calisto, intercedei por nossa célula para que sejamos uma comunidade onde ninguém se sinta julgado, mas todos acolhidos pelo amor restaurador de Cristo. Amém.`,
  },

  // 15 de Outubro
  {
    id: 'santa-teresa-de-jesus',
    name: 'Santa Teresa de Jesus (de Ávila)',
    title: 'Virgem e Primeira Mulher Doutora da Igreja • Reformadora do Carmelo',
    feastDate: '15 de Outubro',
    dayMonthKey: '15/10',
    category: 'doutor',
    patronage: 'Dos escritores católicos, dos mestres de oração e dos doentes da coluna',
    century: 'Século XVI (1515 - 1582)',
    summary: 'Mística genial espanhola que reformou o Carmelo Descalço, autora do "Castelo Interior", mestra insuperável da oração mental e do abandono em Deus.',
    lifeStory: `Nascida em Ávila (Espanha), Teresa Cepeda y Ahumada ingressou no Carmelo da Encarnação. Após anos de busca, experimentou profunda conversão perante um Cristo chagado.
Em união com São João da Cruz, empreendeu a gigantesca reforma carmelitana fundando dezenas de conventos por toda a Espanha a pé e sob intempéries. Suas obras espirituais ("Livro da Vida", "Caminho de Perfeição", "Moradas") elevaram-na a Doutora da Igreja pelo Papa São Paulo VI em 1970.`,
    virtue: 'Determinação resoluta na oração pessoal e íntima amizade com Jesus.',
    famousQuote: '"Nada te perturbe, nada te espante, tudo passa, Deus não muda. A paciência tudo alcança. Quem a Deus tem, nada lhe falta: só Deus basta!"',
    prayer: `Santa Teresa de Jesus, ensinai nossa célula a entender a oração como um íntimo trato de amizade com Aquele que sabemos que nos ama. Amém!`,
  },

  // 16 de Outubro
  {
    id: 'santa-margarida-maria',
    name: 'Santa Margarida Maria Alacoque e São Geraldo Majella',
    title: 'Apóstola do Sagrado Coração de Jesus e Protetor das Mães',
    feastDate: '16 de Outubro',
    dayMonthKey: '16/10',
    category: 'mistico',
    patronage: 'Dos devotos do Sagrado Coração, das gestantes e das mães',
    century: 'Século XVII',
    summary: 'Santa Margarida Maria recebeu do próprio Jesus as revelações do Sagrado Coração, pilar místico que inspirou Santa Gemma Galgani na vivência da reparação e do amor fraterno.',
    lifeStory: `Religiosa salesiana da Visitação de Paray-le-Monial (França), foi escolhida por Jesus para manifestar ao mundo as doze promessas de Seu Sagrado Coração. No mesmo dia a Igreja celebra São Geraldo Majella, irmão leigo redentorista e padroeiro das mães e do parto seguro.`,
    virtue: 'Reparação de amor, desagravo ao Coração de Jesus e auxílio aos enfermos.',
    famousQuote: '"Eis o Coração que tanto amou os homens que nada poupou até se esgotar para testemunhar-lhes o seu amor."',
    prayer: `Sagrado Coração de Jesus, pelas preces de Santa Margarida Maria e de São Geraldo, protegei as mães, as crianças e as famílias de nossa célula. Amém!`,
  },

  // 17 de Outubro
  {
    id: 'santo-inacio-antioquia',
    name: 'Santo Inácio de Antioquia',
    title: 'Bispo de Antioquia, Padre Apostólico e Mártir',
    feastDate: '17 de Outubro',
    dayMonthKey: '17/10',
    category: 'martir',
    patronage: 'Da unidade da Igreja e dos mártires cristãos',
    century: 'Século II (faleceu em 107)',
    summary: 'Sucessor de São Pedro em Antioquia e discípulo de São João, a caminho do Coliseu de Roma pediu que não o impedissem de ser martirizado pelas feras por amor a Jesus.',
    lifeStory: `Conduzido acorrentado a Roma, escreveu sete cartas fundamentais para as Igrejas primitivas defendendo a Eucaristia como o verdadeiro Corpo de Cristo e a união em torno dos bispos. Foi devorado pelas feras no anfiteatro Flávio em 107.`,
    virtue: 'Coragem inquebrantável na fé e amor apaixonado à Sagrada Eucaristia.',
    famousQuote: '"Sou trigo de Cristo, serei moído pelos dentes das feras para me tornar pão puro de Cristo."',
    prayer: `Senhor Jesus, concedei aos membros de nossa célula a firmeza de fé e o amor ardente à Eucaristia de Santo Inácio de Antioquia. Amém!`,
  },

  // 18 de Outubro (Hoje!)
  {
    id: 'sao-lucas-evangelista',
    name: 'São Lucas, Evangelista',
    title: 'Médico Querido, Historiador da Salvação e Pintor de Maria',
    feastDate: '18 de Outubro',
    dayMonthKey: '18/10',
    category: 'doutor',
    patronage: 'Dos médicos, cirurgiões, artistas e historiadores',
    century: 'Século I',
    summary: 'Discípulo e companheiro fiel de São Paulo, autor do Evangelho da Misericórdia e dos Atos dos Apóstolos, descreveu com riqueza poética a Anunciação e o Magnificat.',
    lifeStory: `Nativo de Antioquia da Síria e médico de profissão, converteu-se à fé e acompanhou São Paulo em suas viagens apostólicas e durante a prisão em Roma ("Só Lucas está comigo", escreveu Paulo em 2Tm 4,11).
Seu Evangelho destaca a ternura de Jesus para com as mulheres, os pecadores e os pobres (Parábolas do Bom Samaritano e do Filho Pródigo) e o nascimento virginal de Cristo através de relatos preservados diretamente do Coração da Virgem Maria.`,
    virtue: 'Sensibilidade pastoral, amor aos enfermos e fidelidade aos amigos na tribulação.',
    famousQuote: '"Alegra-te, cheia de graça! O Senhor está contigo!" (Lc 1, 28)',
    prayer: `São Lucas Evangelista, iluminai os profissionais de saúde e intercedei pelos irmãos enfermos de nossa célula, para que a misericórdia de Cristo cure corpo e alma. Amém.`,
  },

  // 19 de Outubro
  {
    id: 'sao-paulo-da-cruz',
    name: 'São Paulo da Cruz',
    title: 'Fundador dos Passionistas • Mestre do Amor à Cruz',
    feastDate: '19 de Outubro',
    dayMonthKey: '19/10',
    category: 'mistico',
    patronage: 'Dos missionários da Paixão e berço espiritual de Santa Gemma Galgani',
    century: 'Século XVIII (1694 - 1775)',
    summary: 'Místico italiano que fundou a Congregação dos Passionistas para pregar o amor de Cristo Crucificado, espiritualidade à qual Santa Gemma Galgani consagrou toda a sua vida.',
    lifeStory: `Nascido no norte da Itália, Paulo Danei teve visões celestes que o chamaram a fundar os Clérigos Regulares da Santa Cruz e da Paixão de Jesus Cristo (Passionistas). Percorreu cidades e campos com o crucifixo nas mãos, promovendo curas e reconciliações comoventes. Foi no mosteiro passionista que repousam os restos mortais de Santa Gemma.`,
    virtue: 'Amor fervoroso à Paixão de Cristo e silêncio interior.',
    famousQuote: '"A Paixão de Jesus é a obra mais estupenda do amor divino."',
    prayer: `São Paulo da Cruz, ensinai nossa célula Santa Gemma Galgani a encontrar na Cruz de Cristo a nossa maior sabedoria e a nossa verdadeira paz. Amém!`,
  },

  // 20 de Outubro
  {
    id: 'santa-maria-bertilla',
    name: 'Santa Maria Bertilla Boscardin',
    title: 'Virgem e Serva dos Enfermos',
    feastDate: '20 de Outubro',
    dayMonthKey: '20/10',
    category: 'pastor',
    patronage: 'Dos enfermeiros e cuidadores hospitalares',
    century: 'Século XIX - XX (1888 - 1922)',
    summary: 'Religiosa italiana que dedicou sua vida aos enfermos e feridos de guerra nos hospitais, tornando-se modelo de caridade silenciosa e abnegação cristã.',
    lifeStory: `De família humilde camponesa, ingressou nas Irmãs Mestras de Santa Doroteia. Atuou no hospital de Treviso cuidando de crianças tuberculosas e feridos militares sob bombardeios, sempre serena e com um sorriso acolhedor. Canonizada por São João XXIII em 1961.`,
    virtue: 'Mansidão, serviço aos que sofrem e humildade no trabalho simples.',
    famousQuote: '"Para Deus todo o louvor; para o próximo todo o amor; para mim todo o esquecimento."',
    prayer: `Senhor Jesus, dai aos membros de nossa célula a ternura e paciência de Santa Maria Bertilla para cuidarmos uns dos outros com verdadeiro espírito fraterno. Amém.`,
  },

  // 21 de Outubro
  {
    id: 'santa-ursula-martires',
    name: 'Santa Úrsula e Companheiras Mártires',
    title: 'Virgens e Mártires da Fé',
    feastDate: '21 de Outubro',
    dayMonthKey: '21/10',
    category: 'martir',
    patronage: 'Das estudantes, professoras e das jovens cristãs',
    century: 'Século IV',
    summary: 'Jovem princesa que liderou donzelas cristãs testemunhando com coragem a fé e a pureza em Colônia, recusando-se a abandonar o seguimento a Cristo.',
    lifeStory: `A tradição cristã recorda o heroísmo de Santa Úrsula que, ao navegar pelo rio Reno, foi cercada pelos invasores hunos e preferiu sofrer o martírio a violar a virgindade prometida a Deus. Inspirou séculos mais tarde a criação das Ursulinas voltadas ao ensino de meninas.`,
    virtue: 'Pureza inabalável e liderança corajosa na fé.',
    famousQuote: '"Antes morrer mil vezes do que negar o amor que consagramos a Jesus Cristo."',
    prayer: `Santa Úrsula, protegei as jovens e moças de nossa célula para que vivam com alegria a beleza da pureza cristã. Amém.`,
  },

  // 22 de Outubro
  {
    id: 'sao-joao-paulo-ii',
    name: 'São João Paulo II, Papa',
    title: 'O Peregrino do Amor • Apóstolo da Juventude e da Família',
    feastDate: '22 de Outubro',
    dayMonthKey: '22/10',
    category: 'pastor',
    patronage: 'Da juventude, das Jornadas Mundiais da Juventude e das famílias',
    century: 'Séculos XX - XXI (1920 - 2005)',
    summary: 'Karol Wojtyła, papa polonês que enfrentou regimes totalitários, viajou por mais de 120 países convidando o mundo com coragem: "Não tenhais medo! Abri as portas a Cristo!"',
    lifeStory: `Marcado pela perda precoce dos pais e pela brutal ocupação nazista e comunista na Polônia, foi ator, operário e padre clandestino antes de ser arcebispo de Cracóvia.
Eleito Papa em 1978, fundou as Jornadas Mundiais da Juventude, proclamou a Teologia do Corpo e a Divina Misericórdia, sobreviveu a um atentado em 1981 perdoando o agressor na prisão, e guiou a Igreja para o terceiro milênio. Canonizado em 2014.`,
    virtue: 'Coragem evangélica inquebrantável, amor filial a Nossa Senhora ("Totus Tuus") e defesa da família.',
    famousQuote: '"Não tenhais medo! Abri, melhor, escancarais as portas a Cristo!"',
    prayer: `São João Paulo II, abençoai nossa célula e as famílias dos 48 irmãos, dai aos jovens o ardor de serem sentinelas da manhã e santos do novo milênio. Amém!`,
  },

  // 23 de Outubro
  {
    id: 'sao-joao-capistrano',
    name: 'São João de Capistrano, Presbítero',
    title: 'Grande Pregador Franciscano e Reformador Espiritual',
    feastDate: '23 de Outubro',
    dayMonthKey: '23/10',
    category: 'pastor',
    patronage: 'Dos capelães militares e dos juristas católicos',
    century: 'Século XV (1386 - 1456)',
    summary: 'Jurista italiano que abandonou a magistratura para ingressar nos franciscanos, tornando-se pregador incansável da misericórdia e defensor da cristandade.',
    lifeStory: `Discípulo de São Bernardino de Sena, propagou o culto ao Santo Nome de Jesus em praças públicas de toda a Europa. Aos 70 anos participou da defesa de Belgrado com um crucifixo erguido nas mãos exortando os soldados à oração e penitência.`,
    virtue: 'Audácia profética e fidelidade ao Santo Nome de Jesus.',
    famousQuote: '"Que o Santo Nome de Jesus seja a vossa bandeira e a vossa vitória."',
    prayer: `São João de Capistrano, intercedei por nossa célula para que sejamos fortes em meio a todas as batalhas espirituais deste tempo. Amém.`,
  },

  // 24 de Outubro
  {
    id: 'santo-antonio-claret',
    name: 'Santo Antônio Maria Claret, Bispo',
    title: 'Fundador dos Claretianos e Apóstolo da Boa Imprensa',
    feastDate: '24 de Outubro',
    dayMonthKey: '24/10',
    category: 'pastor',
    patronage: 'Dos editores católicos, jornalistas e missionários',
    century: 'Século XIX (1807 - 1870)',
    summary: 'Arcebispo de Santiago de Cuba e confessor real na Espanha, foi pioneiro do uso da imprensa e dos livros para espalhar a semente viva da Palavra de Deus.',
    lifeStory: `Nascido na Espanha, fundou os Missionários Filhos do Imaculado Coração de Maria (Claretianos). Pregou missões populares a pé e escreveu dezenas de opúsculos e catecismos. Em Cuba promoveu reformas agrárias e a libertação de escravizados, sofrendo atentados por causa da justiça evangélica.`,
    virtue: 'Zelo ardente pela salvação das almas por todos os meios possíveis.',
    famousQuote: '"Um filho do Imaculado Coração de Maria é um homem que arde em caridade e que abrasa por onde passa."',
    prayer: `Santo Antônio Maria Claret, inflamai o coração dos irmãos de nossa célula no ardor de anunciar o Evangelho com fidelidade e ousadia. Amém.`,
  },

  // 25 de Outubro
  {
    id: 'sao-frei-galvao',
    name: 'Santo Antônio de Sant\'Ana Galvão (Frei Galvão)',
    title: 'Primeiro Santo Nascido no Brasil • O Homem da Paz e da Caridade',
    feastDate: '25 de Outubro',
    dayMonthKey: '25/10',
    category: 'mistico',
    patronage: 'Das parturientes, dos doentes em perigo e do povo brasileiro',
    century: 'Séculos XVIII - XIX (1739 - 1822)',
    summary: 'Frade franciscano nascido em Guaratinguetá (SP), fundador do Mosteiro da Luz, famoso pela oração prodigiosa das Pílulas de Frei Galvão que curam enfermidades graves.',
    lifeStory: `Frei Galvão percorreu o Vale do Paraíba e São Paulo semeando concórdia e caridade. Quando alguém doente pedia socorro e ele não podia comparecer imediatamente, escrevia em pedacinhos de papel uma oração à Santíssima Virgem ("Depois do parto, ó Virgem, permaneceste intacta: Mãe de Deus, intercedei por nós"), enrolava-os como pílulas e os enfermos ficavam curados. Foi canonizado por Bento XVI no Brasil em 2007.`,
    virtue: 'Mansidão franciscana, caridade com os aflitos e devoção filial à Virgem Maria.',
    famousQuote: '"Depois do parto, ó Virgem, permaneceste intacta: Mãe de Deus, intercedei por nós!"',
    prayer: `São Frei Galvão, primeiro santo brasileiro, abençoai nossa célula e derramai a paz e a cura física e espiritual sobre os nossos irmãos enfermos e suas famílias. Amém!`,
  },

  // 26 de Outubro
  {
    id: 'santo-evaristo-papa',
    name: 'Santo Evaristo, Papa e Mártir',
    title: 'Quinto Papa da Igreja de Roma',
    feastDate: '26 de Outubro',
    dayMonthKey: '26/10',
    category: 'pastor',
    patronage: 'Da organização pastoral e dos diáconos da Igreja',
    century: 'Século II',
    summary: 'Sucessor de São Clemente em Roma, organizou a assistência aos necessitados através de paróquias e do serviço caritativo dos diáconos durante as perseguições romanas.',
    lifeStory: `Converteu-se ao cristianismo e governou a Igreja por cerca de nove anos. Instituiu a bênção nupcial pública para os casamentos cristãos e consagrou a vida até o martírio no ano 108 sob o imperador Trajano.`,
    virtue: 'Ordem e dedicação ao serviço pastoral dos irmãos mais pobres.',
    famousQuote: '"Aquele que serve a Cristo nos irmãos guarda para si o maior de todos os tesouros."',
    prayer: `Santo Evaristo, intercedei pela nossa célula para que sejamos organizados no amor e generosos no serviço fraterno. Amém.`,
  },

  // 27 de Outubro
  {
    id: 'sao-goncalo-de-lagos',
    name: 'São Gonçalo de Lagos',
    title: 'Mestre da Doutrina Cristã e dos Pobres',
    feastDate: '27 de Outubro',
    dayMonthKey: '27/10',
    category: 'pastor',
    patronage: 'Dos pescadores e catequistas',
    century: 'Século XV',
    summary: 'Religioso agostiniano em Portugal que uniu erudição teológica a uma vida humilde dedicada à catequese de crianças, idosos e pescadores.',
    lifeStory: `Destacou-se pela caridade incondicional na partilha de alimentos com os indigentes e pela doçura no aconselhamento espiritual. É lembrado pela paciência cristã em tempos de peste e carência.`,
    virtue: 'Doçura evangélica e dedicação aos pequeninos.',
    famousQuote: '"O coração que ama a Deus fala pouco e faz muito pelos que sofrem."',
    prayer: `Senhor Deus, concedei à Célula Santa Gemma a sabedoria e a simplicidade de São Gonçalo de Lagos para semearmos a fé com paciência. Amém.`,
  },

  // 28 de Outubro
  {
    id: 'sao-judas-tadeu',
    name: 'São Simão e São Judas Tadeu, Apóstolos',
    title: 'Apóstolos de Jesus e Patrono das Causas Impossíveis e Desesperadas',
    feastDate: '28 de Outubro',
    dayMonthKey: '28/10',
    category: 'martir',
    patronage: 'Das causas aflitas, causas perdidas, das famílias em desespero e dos hospitais',
    century: 'Século I',
    summary: 'Parentes e apóstolos fiéis de Jesus Cristo que pregaram com zelo fervoroso na Pérsia e Mesopotâmia, selando seu ministério apostólico com o martírio.',
    lifeStory: `São Judas Tadeu, irmão de Tiago Menor e autor de uma das cartas católicas do Novo Testamento, era primo de Jesus segundo a carne.
Durante a Última Ceia perguntou ao Mestre: "Senhor, como é que te manifestarás a nós e não ao mundo?". Dedicou-se à evangelização na Mesopotâmia ao lado de São Simão Cananeu. É invocado em todo o planeta com assombrosa eficácia nas causas mais angustiantes e humanamente impossíveis.`,
    virtue: 'Fidelidade apostólica, intercessão infalível e zelo pela fé recebida dos Apóstolos.',
    famousQuote: '"Conservai-vos no amor de Deus, esperando a misericórdia de nosso Senhor Jesus Cristo para a vida eterna." (Jd 1, 21)',
    prayer: `Glorioso Apóstolo São Judas Tadeu, fiel servo e amigo de Jesus, socorrei as causas desesperadas e angustiadas dos membros de nossa célula neste dia. Amém!`,
  },

  // 01 de Novembro
  {
    id: 'todos-os-santos',
    name: 'Solenidade de Todos os Santos',
    title: 'A Grande Multidão dos Justos e Triunfo da Igreja Celeste',
    feastDate: '01 de Novembro',
    dayMonthKey: '01/11',
    category: 'padroeira',
    patronage: 'De todos os batizados chamados à santidade',
    century: 'Eternidade',
    summary: 'A gloriosa festa de todos os santos canonizados e daqueles anônimos que lavaram suas vestes no Sangue do Cordeiro e agora intercedem por nós junto ao trono de Deus.',
    lifeStory: `A Igreja Militante na terra eleva seu louvor unindo-se à Igreja Triunfante nos Céus. Celebra não apenas os santos com altares e festas no calendário, mas a incontável multidão de homens e mulheres simples — pais de família, jovens, avós e trabalhadores — que viveram as Bem-Aventuranças e alcançaram a felicidade eterna na visão de Deus.`,
    virtue: 'Vocação universal à santidade e certeza da comunhão dos santos.',
    famousQuote: '"A santidade não é um privilégio de poucos, mas uma vocação para todos!"',
    prayer: `Ó Santos e Santas de Deus, orai por nossa célula e ajudai-nos a perseverar no seguimento de Cristo até a pátria celeste. Amém.`,
  },

  // 19 de Março
  {
    id: 'sao-jose',
    name: 'São José, Esposo da Virgem Maria',
    title: 'Patrono Universal da Igreja Católica e da Sagrada Família',
    feastDate: '19 de Março',
    dayMonthKey: '19/03',
    category: 'pastor',
    patronage: 'Das famílias, dos pais, dos operários e da boa morte',
    century: 'Século I',
    summary: 'O homem justo e silencioso a quem o Pai Eterno confiou a guarda de seus maiores tesouros: o Menino Deus e a Virgem Maria.',
    lifeStory: `Descendente da linhagem real de Davi, exerceu o ofício humilde de carpinteiro em Nazaré. Na Anunciação em sonhos, acolheu sem hesitar Maria como sua esposa e educou Jesus com amor e ternura paternal.
Proclamado pelo Beato Papa Pio IX como Patrono Universal da Igreja, São José é o modelo perfeito de obediência sem queixas, trabalho honesto e silenciosa custódia do sagrado.`,
    virtue: 'Silêncio obediente, justiça, fortaleza e paternidade acolhedora.',
    famousQuote: '"Ide a José e fazei tudo o que ele vos disser!"',
    prayer: `Glorioso Patriarca São José, guardião da Sagrada Família, protegei os lares e o sustento de cada irmão de nossa célula Santa Gemma Galgani. Amém.`,
  },

  // 13 de Junho
  {
    id: 'santo-antonio-de-padua',
    name: 'Santo Antônio de Pádua (de Lisboa)',
    title: 'Doutor Evangélico • Martelo dos Hereges e Pai dos Pobres',
    feastDate: '13 de Junho',
    dayMonthKey: '13/06',
    category: 'doutor',
    patronage: 'Dos pobres, das causas perdidas, dos namorados e dos noivos',
    century: 'Século XIII (1195 - 1231)',
    summary: 'Frade franciscano nascido em Portugal que comoveu a Europa medieval com sua eloquência inspirada pela Palavra de Deus, seus milagres e o pão dos pobres.',
    lifeStory: `Fernando de Bulhões nasceu em Lisboa, foi cônego regrante de Santo Agostinho e depois abraçou a pobreza dos frades menores de São Francisco.
Dotado de prodigiosa memória bíblica e ardor missionário, pregou na França e na Itália arrependendo multidões. O Menino Jesus apareceu-lhe em seus braços em sinal de sua virginal pureza. Faleceu em Pádua aos 36 anos e foi canonizado em menos de um ano.`,
    virtue: 'Caridade para com os necessitados e conhecimento ardente da Sagrada Escritura.',
    famousQuote: '"A palavra é viva quando são as obras que falam."',
    prayer: `Santo Antônio de Pádua, doutor da ternura e da verdade, abençoai os relacionamentos dos nossos jovens de célula e concedei-nos o pão da caridade diária. Amém.`,
  },

  // 11 de Julho
  {
    id: 'sao-bento-abade',
    name: 'São Bento de Núrsia',
    title: 'Pai do Monaquismo Ocidental e Padroeiro da Europa',
    feastDate: '11 de Julho',
    dayMonthKey: '11/07',
    category: 'doutor',
    patronage: 'Contra as ciladas do demônio, das enfermidades e dos estudantes',
    century: 'Séculos V - VI (480 - 547)',
    summary: 'Autor da célebre Regra Monástica e do lema "Ora et Labora" (Reza e Trabalha), sua santa Cruz é invocada como escudo invencível contra o poder das trevas.',
    lifeStory: `Desiludido com a corrupção de Roma na juventude, Bento retirou-se para a solidão de Subiaco onde viveu anos de contemplação e penitência.
Mais tarde fundou no Monte Cassino o mosteiro que se tornou berço da civilização cristã e do monaquismo ocidental. Sua santa Regra uniu oração litúrgica, trabalho manual fecundo e hospitalidade aos viajantes. A Medalha de São Bento traz exorcismos poderosos contra o maligno.`,
    virtue: 'Equilíbrio na oração e no trabalho, ordem e firmeza na fé.',
    famousQuote: '"A Cruz Sagrada seja a minha Luz, não seja o dragão meu guia!"',
    prayer: `Pela intercessão de São Bento, afastai de nossa célula e de nossas famílias todas as tentações e ciladas do inimigo de Deus. Amém.`,
  },
];

const FAVORITES_STORAGE_KEY = 'sg_favorite_saints_v1';

class SaintsService {
  /**
   * Obtém os santos do dia para qualquer data ISO (YYYY-MM-DD) ou objeto Date.
   * Conecta com a base litúrgica e com a base rica de santos.
   */
  public getSaintsForDate(dateParam?: string | Date): {
    formattedDate: string;
    dayMonthKey: string;
    saints: DetailedSaint[];
    primarySaint: DetailedSaint;
  } {
    let iso = getTodayIsoDate();
    if (typeof dateParam === 'string' && dateParam.trim().length >= 8) {
      iso = dateParam.trim();
    } else if (dateParam instanceof Date) {
      const y = dateParam.getFullYear();
      const m = String(dateParam.getMonth() + 1).padStart(2, '0');
      const d = String(dateParam.getDate()).padStart(2, '0');
      iso = `${y}-${m}-${d}`;
    }

    const [, monthStr, dayStr] = iso.split('-');
    const dayMonthKey = `${dayStr}/${monthStr}`;

    // 1. Procura primeiro na base oficial local de liturgia do mês/ano
    const liturgyDay = getLiturgyAndSaintForDate(iso);
    const saintsList: DetailedSaint[] = [];

    // Busca na base detalhada interna
    const exactMatches = SAINTS_DATABASE.filter(s => s.dayMonthKey === dayMonthKey);

    if (exactMatches.length > 0) {
      saintsList.push(...exactMatches);
    }

    // Se temos dados do liturgyCalendar que ainda não estão mapeados
    if (liturgyDay && liturgyDay.saints && liturgyDay.saints.length > 0) {
      for (const s of liturgyDay.saints) {
        const alreadyInList = saintsList.some(item => item.name.toLowerCase() === s.name.toLowerCase());
        if (!alreadyInList) {
          saintsList.push({
            id: `liturgy-${dayMonthKey}-${s.name.replace(/\s+/g, '-').toLowerCase()}`,
            name: s.name,
            title: s.title || 'Santo do Dia',
            feastDate: s.feastDate || `${dayStr} de Outubro`,
            dayMonthKey,
            category: 'pastor',
            summary: s.summary,
            lifeStory: s.lifeStory,
            virtue: s.virtue,
            prayer: s.prayer,
          });
        }
      }
    }

    // Se por acaso a data não tiver santos cadastrados, pega o patrono da célula ou primeiro registro
    if (saintsList.length === 0) {
      const fallback = SAINTS_DATABASE[0]; // Santa Gemma
      saintsList.push({
        ...fallback,
        feastDate: `${dayStr}/${monthStr}`,
        dayMonthKey,
      });
    }

    return {
      formattedDate: liturgyDay?.liturgy?.date || `${dayStr}/${monthStr}/${iso.split('-')[0]}`,
      dayMonthKey,
      saints: saintsList,
      primarySaint: saintsList[0],
    };
  }

  /**
   * Catálogo completo de todos os santos para busca e exploração
   */
  public getAllSaints(): DetailedSaint[] {
    return [...SAINTS_DATABASE];
  }

  /**
   * Busca santos por texto (nome, virtude, resumo, padroeiro)
   */
  public searchSaints(query: string, categoryFilter?: string): DetailedSaint[] {
    const q = (query || '').toLowerCase().trim();
    return SAINTS_DATABASE.filter(saint => {
      const matchesCategory = !categoryFilter || categoryFilter === 'todos' || saint.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        saint.name.toLowerCase().includes(q) ||
        saint.title.toLowerCase().includes(q) ||
        saint.summary.toLowerCase().includes(q) ||
        saint.lifeStory.toLowerCase().includes(q) ||
        saint.virtue.toLowerCase().includes(q) ||
        (saint.patronage && saint.patronage.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Gerenciamento de Santos Favoritos da Devoção do Irmão (Salvo no LocalStorage)
   */
  public getFavoriteSaintIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return data ? JSON.parse(data) : ['santa-gemma-galgani'];
    } catch {
      return ['santa-gemma-galgani'];
    }
  }

  public isFavorite(id: string): boolean {
    const ids = this.getFavoriteSaintIds();
    return ids.includes(id);
  }

  public toggleFavorite(id: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const ids = this.getFavoriteSaintIds();
      let updated: string[];
      let isNowFav = false;
      if (ids.includes(id)) {
        updated = ids.filter(x => x !== id);
        isNowFav = false;
      } else {
        updated = [...ids, id];
        isNowFav = true;
      }
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      return isNowFav;
    } catch {
      return false;
    }
  }
}

export const saintsService = new SaintsService();
