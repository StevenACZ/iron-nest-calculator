export const DEG_PER_METER = 0.012
export const MAX_ELEVATION_DEG = 60
export const MIN_CHARGE = 1
export const MAX_CHARGE = 6
export const GUN_CAPACITY = 7

export const ROUND_TYPES = ['HE', 'AP', 'DRIL', 'STAR', 'EMPT'] as const
export type RoundType = (typeof ROUND_TYPES)[number]

export function elevationDeg(meters: number, charge: number): number {
  return (meters * DEG_PER_METER) / charge
}

export function isChargeValid(meters: number, charge: number): boolean {
  return elevationDeg(meters, charge) <= MAX_ELEVATION_DEG
}

export function lowestValidCharge(meters: number): number | null {
  for (let c = MIN_CHARGE; c <= MAX_CHARGE; c++) {
    if (isChargeValid(meters, c)) return c
  }
  return null
}

export function maxRangeKm(charge: number): number {
  return (MAX_ELEVATION_DEG * charge) / DEG_PER_METER / 1000
}

export const MAX_RANGE_KM = maxRangeKm(MAX_CHARGE)

export function normalizeAzimuth(deg: number): number {
  const n = deg % 360
  return n < 0 ? n + 360 : n
}

export function formatAzimuth(deg: number): string {
  return deg.toFixed(2).padStart(6, '0')
}

export function formatElevation(deg: number): string {
  return deg.toFixed(2)
}

export function formatKm(km: number): string {
  return km.toFixed(2).padStart(5, '0')
}

export function formatMeters(km: number): string {
  return Math.round(km * 1000)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
