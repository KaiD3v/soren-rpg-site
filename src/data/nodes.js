// Personagens que orbitam Soren na Matriz Visual. imageTruth = retrato na Ressonância do Colar (opcional).
export const NODES = {
  soren: {
    id: "soren",
    name: "Soren Alkahest",
    formerName: "Vaelor",
    role: "O Protagonista • Tiefling por Pacto Ritual",
    caste: "Ex-Casta do Mercúrio (Renegado)",
    casteColor: "#e58e26",
    soulDensity: 88,
    soulLabel: "Alma Expandida por Pacto Infernal (Pago com a Alma dos Pais)",
    alchemicalSymbol: "🜍",
    symbolName: "Alkahest (O Solvente Universal)",
    shortRelation: "Centro da Matriz",
    visualGuide: [
      {
        label: "Fisionomia & Presença Infernal",
        text: "Jovem (18–20 anos), estatura mediana, físico esguio e atraente. Carrega uma presença imponente e fria que impõe respeito e causa desconforto por onde passa."
      },
      {
        label: "Marcas do Sangue Infernal (Tiefling)",
        text: "Pele pálida acinzentada com nuances rubras, cauda fina sob o sobretudo, chifres escuros estriados e olhos em brasa capazes de enxergar na escuridão absoluta."
      },
      {
        label: "Trajes, Fogo & Sombras",
        text: "Sobretudo escuro de gola alta da elite Vaelor (com as insígnias arrancadas), bandoleiras de reagentes alquímicos e um poder inato ligado ao fogo e às sombras."
      },
      {
        label: "O Detalhe Inconsciente",
        text: "Pela abertura da gola repousa o antigo colar arcano de cristal azulado de seus pais — a única relíquia humana não maculada pelo pacto infernal."
      }
    ],
    relationToCenter: "Soren é o epicentro do conflito: nascido humano com a mente de um gênio na casta mais baixa, foi submetido aos 7 anos a um Pacto Infernal forçado por Lazare Vaelor, que sacrificou a alma dos pais de Soren como moeda de troca para infundir sangue e poder infernal no garoto.",
    egoQuote: "“Não confunda minha eficiência com crueldade. Pessoas com pouco controle sobre o Arcanum são rascunhos inacabados. Meus pais eram fracos; meu ódio por Lazare é apenas porque aquele velho usou meu corpo sem permissão e vendeu minha carne a um pacto infernal!”",
    egoAnalysis: "Soren mantém a crença elitista implantada pela Casa Vaelor: quem não domina o Arcanum é como um inseto. Para não admitir que sofre pela morte de pais considerados 'fracos', ele inventa a desculpa esfarrapada de que sua revolta é puro orgulho ferido por ter tido seu sangue amaldiçoado.",
    truthQuote: "“Cada vez que conjuro o fogo ou as sombras do meu sangue Tiefling, eu sei exatamente quanto ele custou. Lazare comprou o meu poder entregando a alma do meu pai e da minha mãe ao Inferno... e eu nunca consegui tirar o colar deles do peito.”",
    truthAnalysis: "No fundo, Soren amava profundamente Elian e Lyra. A prova viva de sua contradição é o fato de que ele jogou fora toda a sua posição na Alta Casta aos 17 anos no instante em que descobriu que seus pais foram a moeda de troca do seu ritual.",
    image: "/assets/soren.jpg",
    imageTruth: "/assets/soren-verdade.webp"
  },
  parents: {
    id: "parents",
    name: "Elian & Lyra Vaelor",
    formerName: null,
    role: "Os Pais • A Moeda de Troca do Pacto",
    caste: "Casta do Enxofre (Baixa Casta)",
    casteColor: "#60a5fa",
    soulDensity: 22,
    soulLabel: "Almas Sacrificadas como Pagamento Infernal",
    alchemicalSymbol: "🜂",
    symbolName: "Sal & Mercúrio Base (A Fundação)",
    shortRelation: "Origem & Preço do Pacto",
    visualGuide: [
      {
        label: "Aparência Geral",
        text: "Um casal humano de feições gentis, porém marcadas pelo cansaço precoce dos laboratórios subterrâneos. Usavam túnicas simples de linho cinza manchadas de enxofre, ervas e fuligem alquímica."
      },
      {
        label: "Elian (O Pai)",
        text: "Olhos castanhos serenos, barba rala grisalha e mãos calejadas por décadas manipulando vidrarias e ácidos. Tinha um porte protetor e voz calma, sempre calibrando o colar arcano da família."
      },
      {
        label: "Lyra (A Mãe)",
        text: "De sorriso acolhedor e cabelos presos de forma prática; foi dela que Soren herdou os traços finos do rosto e o fascínio inicial pela botânica e pela estrutura invisível dos elementos."
      },
      {
        label: "A Relíquia Deixada (O Colar Arcano)",
        text: "Um pingente prateado contendo um cristal azul lapidado de baixo teor mágico, criado para estabilizar vapores tóxicos. Hoje repousa no peito de Soren."
      }
    ],
    relationToCenter: "Como no universo do Arcanum a alma é a moeda de troca suprema, Lazare Vaelor acorrentou Elian e Lyra no altar subterrâneo e sacrificou a alma dos dois como pagamento a uma entidade infernal, comprando o sangue Tiefling e a expansão anímica de Soren.",
    egoQuote: "“Elian e Lyra? Dois servos da Casta do Enxofre com almas tão estreitas que mal conseguiam acender uma vela. Pelo menos serviram de moeda para comprar algo superior. Minha fúria é que Lazare fez esse negócio usando a minha pele!”",
    egoAnalysis: "Na superfície, Soren fala dos pais com desdém clínico, tratando-os como moedas baratas da pirâmide do clã. Ele finge que o sacrifício deles foi 'natural' dentro da lei dos mais fortes.",
    truthQuote: "“Eles tinham almas pequenas, sim... mas naquele laboratório escuro, eles nunca me olharam como uma arma. Saber que as almas deles foram entregues ao abismo para que eu tivesse este poder é o que me faz querer queimar a Casa Vaelor inteira.”",
    truthAnalysis: "A contradição central de Soren: segundo sua própria ideologia, a vida de seus pais era insignificante. Contudo, a dor por eles foi tão avassaladora que o fez trair todo o seu clã e abandonar seu nome.",
    image: "/assets/parents.jpg",
    imageTruth: "/assets/pais-verdade.webp"
  },
  clan: {
    id: "clan",
    name: "A Casa Vaelor",
    formerName: null,
    role: "O Clã • A Cidadela do Crisol Áureo",
    caste: "Império Eugenista de 4 Castas",
    casteColor: "#eab308",
    soulDensity: 95,
    soulLabel: "Hegemonia Anímica Milenar",
    alchemicalSymbol: "🜚",
    symbolName: "Aurum (A Hierarquia Absoluta)",
    shortRelation: "Doutrinação & Inimigo",
    visualGuide: [
      {
        label: "Arquitetura Vertical de Castas",
        text: "Uma fortaleza colossal esculpida em um pico rochoso negro. A própria geografia da cidadela reflete o valor das almas: quanto mais densa a alma, mais alto se vive."
      },
      {
        label: "O Topo (A Coroa do Éter)",
        text: "Torres douradas reluzentes cercadas por anéis arcanos flutuantes no céu, onde residem os arquimagos de linhagem pura em silêncio absoluto."
      },
      {
        label: "O Meio (As Torres de Mercúrio)",
        text: "Grandes vitrais góticos, bibliotecas imensas e laboratórios de transmutação avançada onde Soren foi treinado dos 7 aos 17 anos como Aprendiz Arcano."
      },
      {
        label: "A Base Subterrânea (Fornalhas de Enxofre)",
        text: "Cavernas esfumaçadas e minas de reagentes na base da montanha, exalando vapores amarelos tóxicos onde a baixa casta trabalha até a exaustão."
      }
    ],
    relationToCenter: "A Casa Vaelor moldou a mente de Soren. Foi o clã que implantou nele a certeza de que seres com menos controle do Arcanum são inferiores, transformou-o em um Tiefling através de um ritual proibido e hoje o caça como uma arma rebelde.",
    egoQuote: "“A Casa Vaelor compreendeu a única verdade que importa: o Arcanum não é igualitário. Os fortes governam a matéria; os fracos são a matéria. Meu único problema com o clã é que eles acharam que eu seria a coleira deles, e não o seu carrasco.”",
    egoAnalysis: "Mesmo renegado, Soren ainda pensa como um Vaelor. Ele não quer destruir o clã para 'libertar os oprimidos' — ele quer provar que sua própria capacidade supera toda a linhagem pura que o usou.",
    truthQuote: "“Aquela montanha dourada inteira foi construída sobre pactos sujos e almas sacrificadas no escuro. Eu risquei o nome Vaelor com uma lâmina porque cada letra dele tem o gosto do sangue dos meus pais.”",
    truthAnalysis: "Por trás da arrogância herdada do clã, Soren carrega um trauma profundo dos dez anos em que serviu fielmente aos assassinos de sua própria família sem saber.",
    image: "/assets/clan.jpg",
    imageTruth: "/assets/cla-verdade.webp"
  },
  villain: {
    id: "villain",
    name: "Arquimago Lazare Vaelor",
    formerName: null,
    role: "O Vilão • O Lapidador de Almas",
    caste: "Patriarca Supremo (Casta do Éter)",
    casteColor: "#ef4444",
    soulDensity: 100,
    soulLabel: "Alma Abissal / Domínio Molecular Absoluto",
    alchemicalSymbol: "🜔",
    symbolName: "Regulus (O Soberano do Crisol)",
    shortRelation: "Criador, Mentor & Alvo de Vingança",
    visualGuide: [
      {
        label: "Presença & Fisionomia",
        text: "Um homem mais velho, de feições aristocráticas afiadas, cabelos escuros com mechas prateadas e barba impecavelmente aparada. Seus olhos pálidos têm a frieza de um cirurgião."
      },
      {
        label: "Vestimentas do Patriarca",
        text: "Mantos cerimoniais negros, rubros e dourados de gola imponente, inteiramente bordados com selos de contenção anímica. Carrega um cajado de cristal carmesim e orbes de captura espiritual."
      },
      {
        label: "Estilo de Magia",
        text: "Enquanto magos comuns recitam fórmulas, Lazare possui tanta densidade de alma que altera a pressão atmosférica, o calor e a gravidade da sala apenas com um gesto calmo dos dedos."
      },
      {
        label: "Postura Psicológica",
        text: "Jamais levanta a voz. Trata Soren não com ódio, mas como um pai severo e orgulhoso diante de uma obra-prima rebelde que precisa ser disciplinada."
      }
    ],
    relationToCenter: "Lazare é o responsável direto por tudo o que Soren é hoje: foi quem sacrificou a alma de Elian e Lyra em um pacto infernal para transformar Soren em Tiefling e expandir seu poder, o mestre que o ensinou alta magia por dez anos e o homem que quase o matou quando a verdade veio à tona.",
    egoQuote: "“Lazare ousou usar minha carne para selar um pacto infernal sem meu consentimento. Ele me derrotou uma vez porque tinha décadas de vantagem no cultivo da alma. Na próxima vez que nos encontrarmos, vou dissolver cada molécula do corpo dele.”",
    egoAnalysis: "Para Soren, Lazare é o obstáculo supremo. Derrotá-lo significa usar o próprio fogo infernal e a alquimia que Lazare lhe impôs para aniquilar seu criador.",
    truthQuote: "“Ele me olhou nos olhos quando eu tinha sete anos, entregou o colar sujo de cinzas dos meus pais e me acolheu como um filho... minutos depois de ter entregue a alma dos dois ao Inferno. Eu não quero apenas matá-lo; quero destruir tudo o que ele construiu.”",
    truthAnalysis: "A traição de Lazare dói em dobro porque, durante dez anos, Soren o admirou como figura paterna substituta e mentor antes de descobrir os arquivos do 'Projeto Quimera'.",
    image: "/assets/villain.jpg",
    imageTruth: "/assets/vilao-verdade.webp"
  }
};
