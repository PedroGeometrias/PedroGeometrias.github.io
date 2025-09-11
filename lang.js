// translation "engine"
// holds the text variants
const translations = {
  pt: {
    page_title: "Portfólio do Pedro De Oliveira Haro",
    nav_about: "Sobre Mim",
    nav_projects: "Projetos",
    nav_skills: "Habilidades",
    nav_contact: "Contato",

    about_heading: "Sobre Mim",
    start_sec: "-> COMECO",
    about_p1:
      "Meu nome é Pedro. Meus principais interesses são quadrinhos, matemática, videogames, espaço e Linux. O design deste site mostra bem que tipo de pessoa eu sou, e fico feliz que você tenha tirado um tempo do seu dia para dar uma olhada.",
    about_p2:
      "Meu foco principal são linguagens de baixo nível como C, C++ e Assembly, mas gosto de brincar com Lua e Python de vez em quando. Minhas skills de front-end também não são ruins: essas estrelas aí no fundo são puro CSS, a animação de digitação etc, e toda a lógica do site é JavaScript puro, inclusive o joguo a intro.",
    about_p3:
      "Uso Linux como sistema principal há um bom tempo e já peguei bem o jeito do terminal. Todo o meu setup gira em torno do teclado e da minha config no Neovim, com scripts Bash amarrando tudo. Uso as ferramentas de terminal do Linux praticamente todo dia.",

    projects_heading: "Projetos",
    fractal_in_cobol:
      "Eu fiz um renderizador de um fractal em cobol, ate onde eu sei, e o primeiro projeto desse tipo, ja e bem dificil encontrar uma GUI feita em cobol, mais dificil ainda e encontra uma GUI em cobol que renderize algo tao complexo quanto um fractal",
    proj_chess:
      "Escrevi uma IA que joga xadrez. Ela se integra a um servidor socket em C que se conecta a um tabuleiro, permitindo que usuários joguem contra a IA. A IA foi feita com TensorFlow e o tabuleiro com SDL2.",
    proj_SHA:
      "Implementacao do SHA-256 em c, com o objeto de imitar o comando sha256sum do linux",
    proj_neovim:
      "Minha config personalizada do Neovim, com um setup de LSPs modulares e mapeamentos de tecla para edição ed texto, tenho comnados de scripts para navegação e manipulação de texto. Tem um README completo no GitHub se quiser dar uma olhada.",
    proj_brainfuck:
      "Um interpretador Brainfuck leve e rápido, que suporta todos os comandos e lida com estruturas de loop complexas do Brainfuck. Aguenta até 30 000 células; implementar a lógica de loop foi a parte mais difícil e mais divertida.",
    proj_space:
      "Este jogo foi escrito em Java. Tornei o loop de jogo thread-safe inspirado no Minecraft. Tem vários tipos de alienígenas e um chefe com múltiplos padrões de ataque. Tudo com detecção de colisão; o loop cuida de lógica e desenho com imagens em buffer.",
    proj_server:
      "Comunicação bidirecional entre dois clientes, com um servidor que apenas retransmite mensagens. Thread-safe, usa sockets e foi escrito em C.",
    proj_beecrowd:
      "Lista de todos os problemas que já resolvi na plataforma BeeCrowd.",

    skills_heading: "Linguagens de Programação",
    other_skills_heading: "Habilidades",
    skill_pt: "Português",
    skill_en: "Inglês",

    contact_heading: "Contato",
  },
};

// this is used because I can't remember if I already used certain variable names
(() => {
  "use strict";

  // current flag location
  const FLAG_SRC = {
    en: "assets/us.png",
    pt: "assets/br.png",
  };

  // naming the two languages
  const LANGS = ["en", "pt"];
  // keeping the choice even after refresh, can either be lang or fall back
  let curLang = localStorage.getItem("lang") || "en";
  // adding value after refresh to global
  window.curLang = curLang;
  // every one that has the data-i18n atribute gets saved into translation.en, in case user swaps back
  // to english
  if (!translations.en) translations.en = {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (!(k in translations.en)) translations.en[k] = el.textContent;
  });

  // makes language and triggers open to other modules
  window.getLang = () => curLang;
  window.translatePage = translatePage;

  // translation
  // takes the current language chosen and swaps for it
  function translatePage(lang) {
    // case language wasn't initiated, fallback to english
    if (!LANGS.includes(lang)) lang = "en";
    // updates the current language to the one chosen
    curLang = lang;
    // update global
    window.curLang = lang;
    // persistent after reloads
    localStorage.setItem("lang", lang);
    // screen-readers & SEO know the active language
    document.documentElement.lang = lang;

    // swaps text
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const txt = translations[lang][key];
      if (txt !== undefined) el.textContent = txt;
    });

    // updates the flag
    const flag = document.getElementById("flagIcon");
    if (flag) {
      flag.src = FLAG_SRC[lang];
      flag.alt = lang === "en" ? "Mudar para Português" : "Switch to English";
    }
    // updates to everyone listening
    document.dispatchEvent(new Event("languageChanged"));
  }

  // this function is pretty self explanatory
  function init() {
    //translate for the current language
    translatePage(curLang);
    const btn = document.getElementById("langToggle");
    // flag button activates
    if (btn)
      btn.addEventListener("click", () =>
        translatePage(curLang === "en" ? "pt" : "en"),
      );
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
