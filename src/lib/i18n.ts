import { computed, ref } from 'vue'

export type Lang = 'es' | 'en'

const STORAGE_KEY = 'ironnest.lang'

const messages = {
  es: {
    tagline: 'Referencia de campo · No oficial',
    subtitle: 'Calculadora Balística',
    azimuth: 'Azimut hacia objetivo',
    distance: 'Distancia al objetivo',
    degrees: 'grados',
    km: 'km',
    charges: 'Cargas de pólvora',
    auto: 'AUTO',
    roundType: 'Tipo de obús',
    requiredElevation: 'Elevación requerida',
    outOfRange: 'Fuera de alcance · máx 30 km',
    logShot: 'Registrar disparo',
    gun: 'Cañón',
    next: 'siguiente',
    empty: 'Vacío',
    full: 'Cargador lleno',
    modeAuto: 'Alternar',
    modeGun1: 'Todo al 1',
    modeGun2: 'Todo al 2',
    reset: 'Reiniciar',
    volley: 'Tanda',
    match: 'Partida',
    charges_short: 'cargas',
    charge_short: 'carga',
    history: 'Historial de tandas',
    currentMatch: 'Partida actual',
    closeMatch: 'Cerrar partida',
    noHistory: 'Sin tandas guardadas todavía.',
    clearHistory: 'Borrar historial',
    shots: 'disparos',
    shot: 'disparo',
    hintKeys: 'Enter avanza y registra · R reinicia y guarda la tanda · C cambia el cañón destino',
    hintDrag: 'Arrastra las tarjetas entre cañones',
    disclaimer:
      'Herramienta de fans no oficial para Iron Nest: Heavy Turret Simulator. Sin afiliación con sus creadores.',
    langLabel: 'English',
    intro:
      'Calculadora balística gratuita y no oficial para IRON NEST: Heavy Turret Simulator. Introduce azimut, distancia y cargas de pólvora y obtén la elevación exacta del cañón con la fórmula del juego (12° por km por carga, 5 km de alcance por carga, 30 km máximo). Tarjetas de disparo para ambos cañones, todo por teclado.',
    faqTitle: 'Preguntas frecuentes',
    faq1q: '¿Cómo funciona la calculadora balística de Iron Nest?',
    faq1a:
      'Usa el modelo balístico del juego: la elevación en grados es la distancia en metros por 0.012 entre el número de cargas de pólvora, con un máximo de 60 grados. Cada carga añade 5 km de alcance, hasta 30 km con seis cargas. La herramienta siempre sugiere la carga más baja que llega al objetivo.',
    faq2q: '¿Es una herramienta oficial de IRON NEST?',
    faq2a:
      'No. Es una herramienta de fans gratuita y no oficial. No tiene afiliación ni respaldo de los desarrolladores de IRON NEST: Heavy Turret Simulator.',
    faq3q: '¿Es gratis y guarda mis datos?',
    faq3a:
      'Sí, es completamente gratis, sin cuentas y sin rastreo. Las tarjetas de disparo y el historial de tandas se guardan solo en tu navegador.',
    faq4q: '¿Está disponible en español?',
    faq4a:
      'Sí. La calculadora es bilingüe: detecta el idioma del navegador y puedes cambiar entre español e inglés con un clic.',
    linkSteam: 'IRON NEST: Heavy Turret Simulator en Steam',
    linkGithub: 'Código fuente en GitHub',
    linkWiki: 'Wiki de IRON NEST (Fandom)',
  },
  en: {
    tagline: 'Field reference · Unofficial',
    subtitle: 'Ballistic Calculator',
    azimuth: 'Azimuth to target',
    distance: 'Distance to target',
    degrees: 'degrees',
    km: 'km',
    charges: 'Powder charges',
    auto: 'AUTO',
    roundType: 'Shell type',
    requiredElevation: 'Required elevation',
    outOfRange: 'Out of range · max 30 km',
    logShot: 'Log shot',
    gun: 'Gun',
    next: 'next',
    empty: 'Empty',
    full: 'Magazine full',
    modeAuto: 'Alternate',
    modeGun1: 'All to 1',
    modeGun2: 'All to 2',
    reset: 'Reset',
    volley: 'Volley',
    match: 'Match',
    charges_short: 'charges',
    charge_short: 'charge',
    history: 'Volley history',
    currentMatch: 'Current match',
    closeMatch: 'Close match',
    noHistory: 'No volleys saved yet.',
    clearHistory: 'Clear history',
    shots: 'shots',
    shot: 'shot',
    hintKeys: 'Enter advances and logs · R resets and saves the volley · C switches target gun',
    hintDrag: 'Drag cards between guns',
    disclaimer:
      'Unofficial fan tool for Iron Nest: Heavy Turret Simulator. Not affiliated with its creators.',
    langLabel: 'Español',
    intro:
      'Free, unofficial ballistic calculator for IRON NEST: Heavy Turret Simulator. Enter azimuth, distance and powder charges and get the exact gun elevation using the in-game formula (12° per km per charge, 5 km of range per charge, 30 km max). Shot cards for both guns, fully keyboard-driven.',
    faqTitle: 'FAQ',
    faq1q: 'How does the Iron Nest ballistic calculator work?',
    faq1a:
      'It uses the in-game ballistic model: elevation in degrees equals distance in meters times 0.012 divided by the number of powder charges, capped at 60 degrees. Each charge extends maximum range by 5 km, up to 30 km with six charges. The tool always suggests the lowest charge that reaches the target.',
    faq2q: 'Is this an official IRON NEST tool?',
    faq2a:
      'No. This is an unofficial, free, fan-made companion tool. It is not affiliated with or endorsed by the developers of IRON NEST: Heavy Turret Simulator.',
    faq3q: 'Is it free and does it store my data?',
    faq3a:
      'Yes, it is completely free with no accounts and no tracking. Shot cards and volley history are stored locally in your browser only.',
    faq4q: 'Is it available in Spanish?',
    faq4a:
      'Yes. The calculator is bilingual: it detects your browser language and you can switch between Spanish and English with one click.',
    linkSteam: 'IRON NEST: Heavy Turret Simulator on Steam',
    linkGithub: 'Source code on GitHub',
    linkWiki: 'IRON NEST Wiki (Fandom)',
  },
} as const

export type MessageKey = keyof (typeof messages)['es']

function initialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'es' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export const lang = ref<Lang>(initialLang())

export function toggleLang(): void {
  lang.value = lang.value === 'es' ? 'en' : 'es'
  localStorage.setItem(STORAGE_KEY, lang.value)
  document.documentElement.lang = lang.value
}

export const t = computed(() => {
  const dict = messages[lang.value]
  return (key: MessageKey) => dict[key]
})
