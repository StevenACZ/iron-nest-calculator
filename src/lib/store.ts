import { computed, reactive, watch } from 'vue'
import { GUN_CAPACITY, type RoundType } from './ballistics.ts'

export type GunId = 1 | 2
export type AssignMode = 'alternate' | 'gun1' | 'gun2'

export interface Shot {
  id: string
  azimuth: number
  km: number
  charge: number
  elevation: number
  type: RoundType
  gun: GunId
}

export interface Volley {
  n: number
  closedAt: string
  shots: Omit<Shot, 'id'>[]
}

export interface Match {
  n: number
  startedAt: string
  closedAt?: string
  volleys: Volley[]
}

interface PersistedHistory {
  matches: Match[]
  currentMatch: number
  currentVolley: number
}

const HISTORY_KEY = 'ironnest.history.v1'
const MODE_KEY = 'ironnest.assignMode'

function loadHistory(): PersistedHistory {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedHistory
      if (Array.isArray(parsed.matches)) return parsed
    }
  } catch {
    localStorage.removeItem(HISTORY_KEY)
  }
  return { matches: [], currentMatch: 1, currentVolley: 1 }
}

function loadMode(): AssignMode {
  const saved = localStorage.getItem(MODE_KEY)
  return saved === 'gun1' || saved === 'gun2' || saved === 'alternate' ? saved : 'alternate'
}

const persisted = loadHistory()

export const store = reactive({
  shots: [] as Shot[],
  assignMode: loadMode(),
  lastGun: 2 as GunId,
  matches: persisted.matches,
  currentMatch: persisted.currentMatch,
  currentVolley: persisted.currentVolley,
})

watch(
  () => store.assignMode,
  (mode) => localStorage.setItem(MODE_KEY, mode),
)

watch(
  () => [store.matches, store.currentMatch, store.currentVolley],
  () => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify({
        matches: store.matches,
        currentMatch: store.currentMatch,
        currentVolley: store.currentVolley,
      }),
    )
  },
  { deep: true },
)

export const gunShots = (gun: GunId) => store.shots.filter((s) => s.gun === gun)

export const gunCounts = computed(() => ({
  1: store.shots.filter((s) => s.gun === 1).length,
  2: store.shots.filter((s) => s.gun === 2).length,
}))

export function targetGun(): GunId | null {
  const counts = gunCounts.value
  if (store.assignMode === 'gun1') return counts[1] < GUN_CAPACITY ? 1 : null
  if (store.assignMode === 'gun2') return counts[2] < GUN_CAPACITY ? 2 : null
  const preferred: GunId = store.lastGun === 1 ? 2 : 1
  const other: GunId = preferred === 1 ? 2 : 1
  if (counts[preferred] < GUN_CAPACITY) return preferred
  if (counts[other] < GUN_CAPACITY) return other
  return null
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function registerShot(data: Omit<Shot, 'id' | 'gun'>): Shot | null {
  const gun = targetGun()
  if (gun === null) return null
  const shot: Shot = { ...data, id: newId(), gun }
  store.shots.push(shot)
  store.lastGun = gun
  return shot
}

export function removeShot(id: string): void {
  const i = store.shots.findIndex((s) => s.id === id)
  if (i !== -1) store.shots.splice(i, 1)
}

export function moveShot(id: string, gun: GunId): void {
  const shot = store.shots.find((s) => s.id === id)
  if (!shot || shot.gun === gun) return
  if (gunCounts.value[gun] >= GUN_CAPACITY) return
  removeShot(id)
  store.shots.push({ ...shot, gun })
}

function currentMatchEntry(): Match {
  let match = store.matches.find((m) => m.n === store.currentMatch && !m.closedAt)
  if (!match) {
    match = { n: store.currentMatch, startedAt: new Date().toISOString(), volleys: [] }
    store.matches.push(match)
  }
  return match
}

export function resetVolley(): boolean {
  if (store.shots.length === 0) return false
  const match = currentMatchEntry()
  match.volleys.push({
    n: store.currentVolley,
    closedAt: new Date().toISOString(),
    shots: store.shots.map(({ id: _id, ...rest }) => rest),
  })
  store.currentVolley += 1
  store.shots = []
  store.lastGun = 2
  return true
}

export function closeMatch(): void {
  resetVolley()
  const match = store.matches.find((m) => m.n === store.currentMatch && !m.closedAt)
  if (match) {
    if (match.volleys.length === 0) {
      store.matches.splice(store.matches.indexOf(match), 1)
    } else {
      match.closedAt = new Date().toISOString()
    }
  }
  const highest = store.matches.reduce((max, m) => Math.max(max, m.n), 0)
  store.currentMatch = highest + 1
  store.currentVolley = 1
}

export function clearHistory(): void {
  store.matches = []
  store.currentMatch = 1
  store.currentVolley = 1
}

export function cycleAssignMode(): void {
  const order: AssignMode[] = ['alternate', 'gun1', 'gun2']
  const next = order[(order.indexOf(store.assignMode) + 1) % order.length]
  store.assignMode = next
}
