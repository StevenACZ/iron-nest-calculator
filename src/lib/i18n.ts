import { computed, ref } from 'vue'

export type Lang = 'es' | 'en'

const STORAGE_KEY = 'ironnest.lang'

const messages = {
  es: {
    tagline: 'Referencia de campo · No oficial',
    subtitle: 'Calculadora de Control de Fuego',
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
  },
  en: {
    tagline: 'Field reference · Unofficial',
    subtitle: 'Fire Control Calculator',
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
