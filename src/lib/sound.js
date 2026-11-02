// Efeitos sonoros (gerados no ElevenLabs, em public/sons). Todos tocam em resposta a um clique,
// então não esbarram no bloqueio de autoplay dos navegadores.
const VOLUME = {
  "colar-tocar": 0.6,
  "colar-soltar": 0.6,
  chamas: 0.4,
  magia: 0.4,
  pagina: 0.5,
  capa: 0.55,
  selo: 0.5,
};

const STORAGE_KEY = "soren-som";
const cache = {};

let muted = false;
try {
  muted = localStorage.getItem(STORAGE_KEY) === "mudo";
} catch {
  // armazenamento bloqueado: fica com som ligado
}

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "mudo" : "som");
  } catch {
    // sem armazenamento, vale só para esta visita
  }
  syncMusic();
}

// Trilha de fundo: um tema por lente, em loop. Começa no primeiro clique (autoplay exige um gesto)
// e, ao trocar de lente, uma faixa se dissolve na outra.
const THEMES = {
  mascara: "/musica/house-of-ashen-vows.mp3", // House of Ashen Vows
  verdade: "/musica/lost-lullaby.mp3", // Lost Lullaby
};
const MUSIC_VOLUME = 0.22;
const CROSSFADE_MS = 1800;
const themes = {};
let lens = "mascara";
let musicStarted = false;

const theme = (name) => (themes[name] ??= Object.assign(new Audio(THEMES[name]), { loop: true, preload: "none", volume: 0 }));

// Timer em vez de requestAnimationFrame: o fade termina mesmo com a aba em segundo plano.
function fadeTo(audio, target) {
  clearInterval(audio.fadeTimer); // um fade novo cancela o anterior
  const from = audio.volume;
  const start = performance.now();
  if (target > 0 && audio.paused) audio.play().catch(() => {});
  audio.fadeTimer = setInterval(() => {
    const k = Math.min(1, (performance.now() - start) / CROSSFADE_MS);
    audio.volume = from + (target - from) * k;
    if (k < 1) return;
    clearInterval(audio.fadeTimer);
    if (target === 0) audio.pause();
  }, 50);
}

function syncMusic() {
  if (!musicStarted) return;
  for (const name of Object.keys(THEMES)) {
    const audible = !muted && name === lens;
    if (audible || themes[name]) fadeTo(theme(name), audible ? MUSIC_VOLUME : 0);
  }
}

export function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  syncMusic();
}

export function setMusicLens(name) {
  lens = name;
  syncMusic();
}

export function play(name) {
  if (muted) return;
  cache[name] ??= Object.assign(new Audio(`/sons/${name}.mp3`), { preload: "auto", volume: VOLUME[name] ?? 0.5 });
  // Clonar permite sobrepor o mesmo som (ex.: virar páginas rápido).
  const audio = cache[name].cloneNode();
  audio.volume = cache[name].volume;
  audio.play().catch(() => {});
}
