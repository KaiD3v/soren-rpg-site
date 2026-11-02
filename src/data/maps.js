// linkedMapIdx aponta para o índice de outra planta neste array.
export const MAPS = [
  {
    id: "full",
    code: "Mapa geral, corte vertical",
    title: "Cidadela da Casa Vaelor (Visão Completa)",
    subtitle: "Corte Arquitetônico dos 4 Níveis da Montanha do Crisol",
    scale: "Escala Vertical: 600m de Altitude • 4 Estratificações de Casta",
    securityLevel: "Fortaleza Arcana Autossuficiente",
    overview: "Esculpida diretamente na rocha negra da montanha, a Cidadela Vaelor foi desenhada para que sua própria geografia física impusesse a hierarquia do Arcanum. Um único eixo vertical — o Poço de Ascensão Vaelor — conecta desde as minas tóxicas na base até as torres douradas no topo.",
    sorenMemory: "“Durante dez anos eu subi por aquele eixo central achando que estava me aproximando do topo do mundo, sem saber que a verdade sobre o pacto que me transformou em Tiefling estava enterrada no último subsolo.”",
    pins: [
      {
        num: "1",
        x: 56,
        y: 23,
        title: "Nível 1: As Torres Áureas do Éter (Cume)",
        areaTag: "Alta Casta • Soberanos",
        desc: "O topo banhado em ouro e cercado por anéis de transmutação celeste. Aqui ficam a Sala do Trono e o Observatório de Lazare.",
        linkedMapIdx: 1
      },
      {
        num: "2",
        x: 60,
        y: 44,
        title: "Nível 2: Bibliotecas e Salões de Mercúrio (Meio)",
        areaTag: "Média-Alta Casta • Artífices",
        desc: "O coração acadêmico do clã, iluminado por vitrais azulados. Onde Soren viveu e estudou dos 7 aos 17 anos e onde ficam os Arquivos Restritos.",
        linkedMapIdx: 2
      },
      {
        num: "3",
        x: 37,
        y: 63,
        title: "Nível 3: Fornalhas e Cavernas de Enxofre (Base)",
        areaTag: "Baixa Casta • Catalisadores",
        desc: "Fornalhas industriais, minas de reagentes e laboratórios abafados onde Elian e Lyra trabalhavam.",
        linkedMapIdx: 3
      },
      {
        num: "4",
        x: 50,
        y: 83,
        title: "Nível 4: Abóbada do Crisol de Almas (Subterrâneo Profundo)",
        areaTag: "Zona Proibida • Pacto Infernal",
        desc: "Câmara oculta abaixo das fundações da montanha onde Lazare realizou o pacto infernal sacrificando os pais de Soren.",
        linkedMapIdx: 3
      }
    ],
    image: "/assets/map_full.jpg"
  },
  {
    id: "ether",
    code: "Planta 1, topo",
    title: "Santuário do Pico do Éter (Alta Casta)",
    subtitle: "Salão do Trono, Observatório de Lazare e a Ala Leste Colapsada",
    scale: "Planta Tática (1 Quadrado = 1,5m / 5ft) • Acesso Exclusivo Casta do Éter",
    securityLevel: "Segurança Máxima (Selos de Gravidade & Pressão Anímica)",
    overview: "Suspenso sobre um abismo perpétuo no cume da montanha, o Santuário do Éter gira em torno de uma gigantesca matriz de transmutação dourada. A ala direita do mapa ainda exibe a cicatriz deixada pela fuga de Soren.",
    sorenMemory: "“Foi naquele círculo central que Lazare esmagou meus ossos sem sequer sujar as mãos. E foi na varanda leste que eu detonei cada frasco que tinha no peito para derrubar as colunas e cair no escuro.”",
    pins: [
      {
        num: "1",
        x: 50,
        y: 50,
        title: "Matriz Central & Salão do Trono",
        areaTag: "Epicentro de Poder",
        desc: "Um círculo de transmutação colossal gravado em ouro sobre obsidiana, amplificando o Arcanum de Lazare Vaelor em todo o salão."
      },
      {
        num: "2",
        x: 77,
        y: 51,
        title: "Ala Leste Destruída (Varanda Colapsada)",
        areaTag: "Local da Fuga de Soren",
        desc: "O balcão que Soren implodiu aos 17 anos com reagentes alquímicos instáveis para escapar da execução e despencar no abismo."
      },
      {
        num: "3",
        x: 16,
        y: 50,
        title: "Observatório Privado do Arquimago Lazare",
        areaTag: "Sanctum do Vilão",
        desc: "Sala equipada com astrolábios anímicos onde Lazare estuda o tecido do Arcanum e guarda orbes de almas."
      },
      {
        num: "4",
        x: 45,
        y: 83,
        title: "Laboratório Pessoal & Escadaria de Acesso",
        areaTag: "Entrada Sul",
        desc: "O único acesso físico a partir das Torres de Mercúrio, guardado por pontes flutuantes retráteis."
      }
    ],
    image: "/assets/map_ether.jpg"
  },
  {
    id: "mercury",
    code: "Planta 2, nível médio",
    title: "Salões de Mercúrio & Grande Biblioteca",
    subtitle: "Claustros Acadêmicos, Destilarias e os Arquivos Restritos",
    scale: "Planta Tática (1 Quadrado = 3m / 10ft) • Casta do Mercúrio",
    securityLevel: "Segurança Alta (Guardas Arcanos & Portas Seladas)",
    overview: "O complexo onde Soren passou uma década inteira sendo moldado como o prodígio da Casa Vaelor. Combina uma biblioteca monumental com destilarias alquímicas e laboratórios circulares.",
    sorenMemory: "“Conheço cada ladrilho deste andar de olhos fechados. Passei dez anos estudando nesses laboratórios circulares, sem imaginar que a porta com a efígie de leão ao lado do meu quarto guardava a verdade sobre a morte dos meus pais.”",
    pins: [
      {
        num: "1",
        x: 50,
        y: 49,
        title: "Grande Biblioteca Alquímica & Domo Central",
        areaTag: "Centro de Estudos",
        desc: "Milhares de tomos sobre alteração molecular e história do Arcanum. O coração ideológico da Casa Vaelor."
      },
      {
        num: "2",
        x: 73,
        y: 34,
        title: "Porta Oculta para os Arquivos Restritos",
        areaTag: "O Segredo do Projeto Quimera",
        desc: "Passagem selada com o brasão alquímico de leão que leva ao subsolo onde Soren leu as notas de Lazare sobre o pacto infernal e o sacrifício de Elian e Lyra."
      },
      {
        num: "3",
        x: 74,
        y: 13,
        title: "Alojamentos dos Aprendizes Arcanos",
        areaTag: "Antigo Quarto de Soren",
        desc: "Aposentos austeros onde os jovens prodígios da Casta do Mercúrio dormem sob vigilância."
      },
      {
        num: "4",
        x: 85,
        y: 52,
        title: "Laboratórios Circulares de Transmutação",
        areaTag: "Bancadas de Alquimia",
        desc: "Anfiteatros de experimentação química onde Soren desenvolveu suas primeiras fórmulas do solvente Alkahest."
      },
      {
        num: "5",
        x: 16,
        y: 51,
        title: "Câmaras de Destilação Pesada",
        areaTag: "Ala Oeste",
        desc: "Grandes colunas de cobre e vidro que refinam os reagentes brutos enviados das minas de enxofre abaixo."
      }
    ],
    image: "/assets/map_mercury.jpg"
  },
  {
    id: "sulfur",
    code: "Planta 3, subterrâneo",
    title: "Laboratórios de Enxofre & Cofre do Pacto Quimera",
    subtitle: "O Berço de Elian e Lyra Conectado à Câmara de Sacrifício Infernal",
    scale: "Planta de Masmorra (1 Quadrado = 1,5m / 5ft) • Casta do Enxofre & Zona Proibida",
    securityLevel: "Dividida: Ala de Trabalho (Oeste) vs. Cofre Selado a Sangue (Leste)",
    overview: "A planta mais trágica da Cidadela Vaelor. À esquerda ficam as estufas subterrâneas e bancadas onde Soren cresceu ao lado de Elian e Lyra; à direita, separado apenas por uma porta secreta trancada, fica o altar octogonal onde as almas dos dois foram entregues em um pacto infernal.",
    sorenMemory: "“Lazare disse que meus pais haviam morrido numa explosão acidental na bancada oeste. Na verdade, ele os arrastou através daquela porta trancada no centro e entregou a alma dos dois nos círculos vermelhos de pacto a vinte passos de onde eu costumava brincar.”",
    pins: [
      {
        num: "1",
        x: 19,
        y: 49,
        title: "Estação de Destilação & Bancadas de Reagentes",
        areaTag: "Posto de Trabalho de Elian",
        desc: "A bancada úmida onde o pai de Soren preparava compostos básicos e calibrava o colar arcano de cristal azul."
      },
      {
        num: "2",
        x: 19,
        y: 79,
        title: "Estufas Botânicas Subterrâneas",
        areaTag: "Jardim de Lyra",
        desc: "Cultivo de fungos luminescentes e ervas alquímicas onde a mãe de Soren lhe ensinou as primeiras noções da natureza."
      },
      {
        num: "3",
        x: 41,
        y: 50,
        title: "Porta Secreta Selada & 'O Caminho da Sombra'",
        areaTag: "Transição Proibida",
        desc: "Passagem oculta na parede leste do laboratório usada por Lazare para levar cobaias da Casta do Enxofre até o cofre ritual."
      },
      {
        num: "4",
        x: 75,
        y: 51,
        title: "Altar Central do Pacto & Círculos Gêmeos de Sacrifício",
        areaTag: "Berço Infernal do Tiefling",
        desc: "Câmara octogonal com dois círculos vermelhos de oferta anímica (onde as almas de Elian e Lyra foram pagas ao Inferno) ligados ao altar central onde o sangue de Soren foi reescrito como Tiefling."
      }
    ],
    image: "/assets/map_sulfur.jpg"
  }
];
