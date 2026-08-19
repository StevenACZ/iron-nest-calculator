<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  MAX_CHARGE,
  MAX_RANGE_KM,
  MIN_CHARGE,
  ROUND_TYPES,
  elevationDeg,
  formatElevation,
  isChargeValid,
  lowestValidCharge,
  normalizeAzimuth,
  type RoundType,
} from '../lib/ballistics.ts'
import { registerShot, type Shot } from '../lib/store.ts'
import { t } from '../lib/i18n.ts'
import AzimuthDial from './AzimuthDial.vue'
import ElevationGauge from './ElevationGauge.vue'
import ShellIcon from './ShellIcon.vue'

const azimuthRaw = ref('')
const distanceRaw = ref('')
const manualCharge = ref<number | null>(null)
const roundType = ref<RoundType>('EMPT')

const azimuthEl = ref<HTMLInputElement | null>(null)
const distanceEl = ref<HTMLInputElement | null>(null)
const chargesEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const flash = ref(false)

const charges = Array.from({ length: MAX_CHARGE - MIN_CHARGE + 1 }, (_, i) => MIN_CHARGE + i)

function parseNum(raw: string): number | null {
  const n = parseFloat(raw.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

const azimuth = computed(() => {
  const n = parseNum(azimuthRaw.value)
  return n === null ? null : normalizeAzimuth(n)
})

const km = computed(() => {
  const n = parseNum(distanceRaw.value)
  return n !== null && n > 0 ? n : null
})

const meters = computed(() => (km.value === null ? 0 : km.value * 1000))
const outOfRange = computed(() => km.value !== null && km.value > MAX_RANGE_KM)

const autoCharge = computed(() => (meters.value > 0 ? lowestValidCharge(meters.value) : null))

const effectiveCharge = computed(() => {
  if (meters.value <= 0) return manualCharge.value ?? MIN_CHARGE
  if (manualCharge.value !== null && isChargeValid(meters.value, manualCharge.value)) {
    return manualCharge.value
  }
  return autoCharge.value ?? MAX_CHARGE
})

const isAuto = computed(
  () => manualCharge.value === null || manualCharge.value !== effectiveCharge.value,
)

const elevation = computed(() => {
  if (meters.value <= 0 || outOfRange.value) return null
  return elevationDeg(meters.value, effectiveCharge.value)
})

const canRegister = computed(
  () => azimuth.value !== null && km.value !== null && elevation.value !== null,
)

function chargeInvalid(c: number): boolean {
  return meters.value > 0 && !isChargeValid(meters.value, c)
}

function pickCharge(c: number): void {
  if (chargeInvalid(c)) return
  manualCharge.value = manualCharge.value === c ? null : c
}

const INPUT_RULES = {
  az: { max: 360, intDigits: 3, decimals: 2 },
  km: { max: MAX_RANGE_KM, intDigits: 2, decimals: 2 },
} as const

function validPartial(value: string, rule: { max: number; intDigits: number; decimals: number }) {
  const re = new RegExp(`^\\d{0,${rule.intDigits}}(\\.\\d{0,${rule.decimals}})?$`)
  if (!re.test(value)) return false
  const n = parseFloat(value)
  return Number.isNaN(n) || n <= rule.max
}

function handleNumKey(e: KeyboardEvent, kind: 'az' | 'km'): void {
  if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return
  e.preventDefault()
  if (!/[\d.,]/.test(e.key)) return
  const rule = INPUT_RULES[kind]
  const target = kind === 'az' ? azimuthRaw : distanceRaw
  const input = e.target as HTMLInputElement
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const base = input.value.slice(0, start) + input.value.slice(end)
  const key = e.key === ',' ? '.' : e.key
  const candidate = base.slice(0, start) + key + base.slice(start)
  let next: string | null = null
  let caret = start + 1
  if (validPartial(candidate, rule)) {
    next = candidate
  } else if (key !== '.' && start === base.length && base !== '' && !base.includes('.')) {
    const dotted = `${base}.${key}`
    if (validPartial(dotted, rule)) {
      next = dotted
      caret = dotted.length
    }
  }
  if (next === null) return
  target.value = next
  void nextTick(() => input.setSelectionRange(caret, caret))
}

function focusAzimuth(): void {
  azimuthEl.value?.focus()
  azimuthEl.value?.select()
}

function focusDistance(): void {
  distanceEl.value?.focus()
  distanceEl.value?.select()
}

function focusCharges(): void {
  chargesEl.value?.focus()
}

function stepCharge(dir: 1 | -1): void {
  const valid = charges.filter((c) => !chargeInvalid(c))
  if (valid.length === 0) return
  const idx = valid.indexOf(effectiveCharge.value)
  let next: number
  if (idx === -1) {
    next = dir === 1 ? valid[0]! : valid[valid.length - 1]!
  } else {
    next = valid[Math.min(Math.max(idx + dir, 0), valid.length - 1)]!
  }
  manualCharge.value = next === autoCharge.value ? null : next
}

function handleChargeKey(e: KeyboardEvent): void {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const key = e.key.toLowerCase()
  if (key === 'arrowright' || key === 'e') {
    e.preventDefault()
    stepCharge(1)
  } else if (key === 'arrowleft' || key === 'q') {
    e.preventDefault()
    stepCharge(-1)
  } else if (key === 'enter') {
    e.preventDefault()
    register()
  } else if (key === 'tab') {
    e.preventDefault()
    if (e.shiftKey) focusDistance()
    else focusAzimuth()
  }
}

function shakePanel(): void {
  const el = panelEl.value
  if (!el) return
  el.classList.remove('shake')
  void el.offsetWidth
  el.classList.add('shake')
}

function register(): void {
  if (!canRegister.value) {
    shakePanel()
    if (azimuth.value === null) focusAzimuth()
    else focusDistance()
    return
  }
  const shot = registerShot({
    azimuth: azimuth.value!,
    km: km.value!,
    charge: effectiveCharge.value,
    elevation: elevation.value!,
    type: roundType.value,
  })
  if (!shot) {
    shakePanel()
    return
  }
  flash.value = false
  requestAnimationFrame(() => {
    flash.value = true
    setTimeout(() => (flash.value = false), 450)
  })
  focusAzimuth()
}

function restoreShot(shot: Shot): void {
  azimuthRaw.value = String(parseFloat(shot.azimuth.toFixed(2)))
  distanceRaw.value = String(parseFloat(shot.km.toFixed(2)))
  manualCharge.value = shot.charge
  roundType.value = shot.type
  focusAzimuth()
}

onMounted(focusAzimuth)

defineExpose({ focusAzimuth, register, restoreShot })
</script>

<template>
  <section ref="panelEl" class="calc metal-panel rivets rivets-bottom">
    <div class="field">
      <label class="plate-label" for="azimuth-input">{{ t('azimuth') }}</label>
      <div class="field-row">
        <div class="input-wrap">
          <input
            id="azimuth-input"
            ref="azimuthEl"
            v-model="azimuthRaw"
            class="num-input"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            spellcheck="false"
            placeholder="000.00"
            enterkeyhint="next"
            @keydown="handleNumKey($event, 'az')"
            @keydown.enter.prevent="focusDistance"
            @keydown.tab.exact.prevent="focusDistance"
            @keydown.shift.tab.prevent="focusCharges"
          />
          <span class="unit">°</span>
        </div>
        <div class="dial-box">
          <AzimuthDial :azimuth="azimuth" />
        </div>
      </div>
    </div>

    <div class="field">
      <label class="plate-label" for="distance-input">{{ t('distance') }}</label>
      <div class="field-row">
        <div class="input-wrap">
          <input
            id="distance-input"
            ref="distanceEl"
            v-model="distanceRaw"
            class="num-input"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            spellcheck="false"
            placeholder="00.00"
            enterkeyhint="done"
            @keydown="handleNumKey($event, 'km')"
            @keydown.enter.prevent="register"
            @keydown.tab.exact.prevent="focusCharges"
            @keydown.shift.tab.prevent="focusAzimuth"
          />
          <span class="unit">{{ t('km') }}</span>
        </div>
      </div>
      <div v-if="outOfRange" class="meters-hint hint-bad">{{ t('outOfRange') }}</div>
    </div>

    <div class="field">
      <span class="plate-label">{{ t('charges') }}</span>
      <div
        ref="chargesEl"
        class="charge-row"
        role="radiogroup"
        tabindex="0"
        @keydown="handleChargeKey"
      >
        <button
          v-for="c in charges"
          :key="c"
          type="button"
          class="charge-btn"
          :class="{
            active: c === effectiveCharge,
            invalid: chargeInvalid(c),
          }"
          :disabled="chargeInvalid(c)"
          tabindex="-1"
          @click="pickCharge(c)"
        >
          {{ c }}
        </button>
        <transition name="pop">
          <span v-if="isAuto && autoCharge !== null" class="auto-badge">{{ t('auto') }}</span>
        </transition>
      </div>
    </div>

    <div class="field">
      <span class="plate-label">{{ t('roundType') }}</span>
      <div class="type-row">
        <button
          v-for="rt in ROUND_TYPES"
          :key="rt"
          type="button"
          class="type-btn"
          :class="['type-' + rt.toLowerCase(), { active: rt === roundType }]"
          tabindex="-1"
          @click="roundType = rt"
        >
          <ShellIcon :type="rt" />
          <span>{{ rt }}</span>
        </button>
      </div>
    </div>

    <div class="readout">
      <div class="gauge-box">
        <ElevationGauge :elevation="elevation" />
      </div>
      <div class="readout-text">
        <span class="plate-label">{{ t('requiredElevation') }}</span>
        <div class="elev-value" :class="{ 'elev-empty': elevation === null }">
          {{ elevation === null ? '––.––' : formatElevation(elevation) }}°
        </div>
      </div>
    </div>

    <button type="button" class="fire-btn" :class="{ 'fire-flash': flash }" @click="register">
      {{ t('logShot') }} <span class="key-hint">⏎</span>
    </button>
  </section>
</template>

<style scoped>
.calc {
  padding: 1rem 0.9rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.input-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.num-input {
  width: 100%;
  background: linear-gradient(180deg, #14120d, #201c14);
  border: 2px solid #3c382b;
  border-radius: 6px;
  box-shadow:
    inset 0 3px 8px rgb(0 0 0 / 70%),
    0 1px 0 rgb(255 255 255 / 10%);
  color: var(--brass-soft);
  font-family: var(--font-mono);
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-align: right;
  padding: 0.35rem 2.2rem 0.35rem 0.6rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.num-input:focus {
  border-color: var(--brass);
}

.num-input::placeholder {
  color: #4d4732;
}

.unit {
  position: absolute;
  right: 0.55rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cream-dim);
  font-size: 0.95rem;
  font-weight: 700;
}

.dial-box {
  width: 92px;
  flex: none;
  filter: drop-shadow(0 3px 5px rgb(0 0 0 / 45%));
}

.meters-hint {
  min-height: 1rem;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--cream-dim);
  text-align: right;
}

.hint-bad {
  color: var(--red-bright);
  font-weight: 700;
}

.charge-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 8px;
  outline: none;
}

.charge-row:focus {
  outline: 2px solid var(--brass);
  outline-offset: 4px;
}

.charge-btn {
  flex: 1;
  min-width: 0;
  background: linear-gradient(180deg, #2a2620, #1b1813);
  border: 1.5px solid #45402f;
  border-radius: 6px;
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.42rem 0;
  transition:
    transform 0.12s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.charge-btn:hover:not(:disabled) {
  border-color: var(--brass);
}

.charge-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.charge-btn.active {
  border-color: var(--brass);
  color: var(--brass-soft);
  box-shadow:
    0 0 0 1px rgb(201 164 55 / 40%),
    0 0 12px rgb(201 164 55 / 25%);
}

.charge-btn.invalid {
  color: #57503c;
  border-color: #2e2a20;
  text-decoration: line-through;
  cursor: not-allowed;
}

.auto-badge {
  flex: none;
  background: var(--brass);
  color: var(--bg);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  border-radius: 3px;
  padding: 0.2rem 0.35rem;
}

.type-row {
  display: flex;
  gap: 0.4rem;
}

.type-btn {
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.28rem;
  border-radius: 6px;
  border: 1.5px solid transparent;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.4rem 0;
  color: #efe8d2;
  opacity: 0.5;
  transition:
    opacity 0.2s ease,
    transform 0.12s ease,
    box-shadow 0.2s ease;
}

.type-btn:active {
  transform: translateY(1px);
}

.type-btn.active {
  opacity: 1;
  box-shadow: 0 0 0 1.5px rgb(255 255 255 / 35%);
}

.type-he {
  background: #a3701c;
  border-color: #d8a53c;
}

.type-ap {
  background: #8c3222;
  border-color: #c25a42;
}

.type-dril {
  background: #21405f;
  border-color: #4a749e;
}

.type-star {
  background: #33608f;
  border-color: #6b9cc9;
}

.type-empt {
  background: #4d4a40;
  border-color: #7d786a;
}

.readout {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgb(0 0 0 / 18%);
  border: 1px solid rgb(0 0 0 / 25%);
  border-radius: 8px;
  padding: 0.55rem 0.7rem;
}

.gauge-box {
  width: 118px;
  flex: none;
  filter: drop-shadow(0 3px 5px rgb(0 0 0 / 45%));
}

.readout-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
}

.elev-value {
  font-family: var(--font-mono);
  font-size: 2.3rem;
  font-weight: 700;
  color: var(--red-bright);
  text-shadow: 0 0 14px rgb(212 85 61 / 45%);
  letter-spacing: 0.04em;
  transition: color 0.3s ease;
  font-variant-numeric: tabular-nums;
}

.elev-empty {
  color: #6b6350;
  text-shadow: none;
}

.fire-btn {
  background: linear-gradient(180deg, #35301f, #241f13);
  border: 2px solid var(--brass);
  border-radius: 8px;
  color: var(--brass-soft);
  font-family: var(--font-mono);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 0.7rem 0.5rem;
  transition:
    transform 0.12s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.fire-btn:hover {
  box-shadow: 0 0 18px rgb(201 164 55 / 30%);
}

.fire-btn:active {
  transform: translateY(1px);
}

.fire-flash {
  background: var(--brass);
  color: var(--bg);
  box-shadow: 0 0 26px rgb(226 196 99 / 60%);
}

.key-hint {
  opacity: 0.6;
  font-size: 0.85em;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>
