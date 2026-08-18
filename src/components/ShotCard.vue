<script setup lang="ts">
import { computed } from 'vue'
import { formatAzimuth, formatElevation, type RoundType } from '../lib/ballistics.ts'
import type { Shot } from '../lib/store.ts'
import { t } from '../lib/i18n.ts'

const props = defineProps<{ shot: Shot }>()
const emit = defineEmits<{ remove: [id: string] }>()

const TYPE_COLORS: Record<RoundType, string> = {
  HE: '#c07f1f',
  AP: '#a53a2a',
  DRIL: '#25476b',
  STAR: '#3a6ea5',
  EMPT: '#5c584c',
}

const tilt = computed(() => {
  let h = 0
  for (const ch of props.shot.id) h = (h * 31 + ch.charCodeAt(0)) % 997
  return `${((h % 30) - 15) / 10}deg`
})

const typeColor = computed(() => TYPE_COLORS[props.shot.type])

function onDragStart(e: DragEvent) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData('text/plain', props.shot.id)
  e.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <article class="card" :style="{ '--tilt': tilt }" draggable="true" @dragstart="onDragStart">
    <div class="card-top">
      <svg viewBox="0 0 24 24" class="reticle" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="#b5432f" stroke-width="2" />
        <circle cx="12" cy="12" r="3" fill="#b5432f" />
        <line x1="12" y1="1" x2="12" y2="6" stroke="#b5432f" stroke-width="2" />
        <line x1="12" y1="18" x2="12" y2="23" stroke="#b5432f" stroke-width="2" />
        <line x1="1" y1="12" x2="6" y2="12" stroke="#b5432f" stroke-width="2" />
        <line x1="18" y1="12" x2="23" y2="12" stroke="#b5432f" stroke-width="2" />
      </svg>

      <svg viewBox="0 0 130 26" class="shell" aria-hidden="true">
        <polygon points="2,13 24,4 24,22" :fill="typeColor" stroke="#22201c" stroke-width="1.5" />
        <rect x="24" y="4" width="44" height="18" rx="2" fill="#efe8d2" stroke="#22201c" stroke-width="1.5" />
        <text x="46" y="17.5" text-anchor="middle" class="shell-type">{{ shot.type }}</text>
        <path d="M 76 2 L 73 2 L 73 24 L 76 24" fill="none" stroke="#22201c" stroke-width="1.8" />
        <text x="84" y="18" text-anchor="middle" class="shell-charge">{{ shot.charge }}</text>
        <rect
          v-for="r in shot.charge"
          :key="r"
          :x="90 + (r - 1) * 6.5"
          y="5"
          width="4.5"
          height="16"
          rx="1"
          fill="#22201c"
        />
      </svg>

      <div class="card-marks">
        <button
          class="card-x"
          type="button"
          :aria-label="`${t('reset')} ${formatAzimuth(shot.azimuth)}`"
          @click="emit('remove', shot.id)"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <line x1="2" y1="2" x2="14" y2="14" stroke="#b5432f" stroke-width="3" stroke-linecap="round" />
            <line x1="14" y1="2" x2="2" y2="14" stroke="#b5432f" stroke-width="3" stroke-linecap="round" />
          </svg>
        </button>
        <svg viewBox="0 0 16 16" class="card-check" aria-hidden="true">
          <path d="M 2 9 L 6 13 L 14 3" fill="none" stroke="#4d7d43" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <div class="card-values">
      <div class="value-block">
        <svg viewBox="0 0 64 34" class="value-icon" aria-hidden="true">
          <line x1="2" y1="30" x2="62" y2="30" stroke="#57523f" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 19 24 L 15 27 L 14 30" fill="none" stroke="#22201c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 29 24 L 32 27 L 33 30" fill="none" stroke="#22201c" stroke-width="2.5" stroke-linecap="round" />
          <polygon points="11,17 29,15 35,18 34,24 12,24" fill="#22201c" />
          <line x1="31" y1="18" x2="47" y2="6" stroke="#22201c" stroke-width="3.5" stroke-linecap="round" />
          <circle cx="31" cy="18" r="2.2" fill="#c9a437" />
          <line x1="55" y1="26" x2="55" y2="11" stroke="#b5432f" stroke-width="2.5" />
          <polygon points="55,4 50.5,12 59.5,12" fill="#b5432f" />
        </svg>
        <div class="value-num">{{ formatElevation(shot.elevation) }}°</div>
      </div>

      <div class="value-block">
        <svg viewBox="0 0 64 34" class="value-icon" aria-hidden="true">
          <circle cx="32" cy="17" r="13" fill="none" stroke="#57523f" stroke-width="1.3" stroke-dasharray="2.5 2.2" />
          <rect x="26.5" y="14" width="11" height="9" rx="2" fill="#22201c" />
          <line x1="30" y1="15" x2="30" y2="5" stroke="#22201c" stroke-width="2.4" />
          <line x1="34" y1="15" x2="34" y2="5" stroke="#22201c" stroke-width="2.4" />
          <path d="M 27.5 5.5 A 11 11 0 0 0 20.5 11" fill="none" stroke="#b5432f" stroke-width="2.4" />
          <polygon points="17.5,15.5 19.2,7.8 24.8,11.8" fill="#b5432f" />
          <path d="M 36.5 5.5 A 11 11 0 0 1 43.5 11" fill="none" stroke="#b5432f" stroke-width="2.4" />
          <polygon points="46.5,15.5 44.8,7.8 39.2,11.8" fill="#b5432f" />
          <line x1="2" y1="30" x2="62" y2="30" stroke="#57523f" stroke-width="1.5" stroke-dasharray="3 2" />
        </svg>
        <div class="value-num">{{ formatAzimuth(shot.azimuth) }}°</div>
      </div>
    </div>

    <div class="card-foot">
      {{ shot.km.toFixed(2) }} km · {{ shot.charge }}
      {{ shot.charge === 1 ? t('charge_short') : t('charges_short') }}
    </div>
  </article>
</template>

<style scoped>
.card {
  background:
    linear-gradient(115deg, rgb(255 255 255 / 22%) 0%, rgb(255 255 255 / 0%) 45%),
    linear-gradient(180deg, var(--paper) 0%, var(--paper-shade) 100%);
  border: 1px solid var(--paper-edge);
  border-radius: 4px;
  box-shadow:
    0 1px 0 rgb(255 255 255 / 35%) inset,
    0 4px 10px rgb(0 0 0 / 45%);
  color: var(--ink);
  padding: 0.5rem 0.6rem 0.4rem;
  transform: rotate(var(--tilt));
  cursor: grab;
  user-select: none;
}

.card:active {
  cursor: grabbing;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reticle {
  width: 22px;
  height: 22px;
  flex: none;
}

.shell {
  flex: 1;
  min-width: 0;
  height: 26px;
}

.shell-type {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  fill: #22201c;
}

.shell-charge {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  fill: #22201c;
}

.card-marks {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: none;
}

.card-x {
  background: none;
  border: none;
  padding: 2px;
  line-height: 0;
  border-radius: 3px;
}

.card-x:hover {
  background: rgb(181 67 47 / 18%);
}

.card-x svg {
  width: 13px;
  height: 13px;
}

.card-check {
  width: 12px;
  height: 12px;
}

.card-values {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.value-block {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.value-icon {
  width: 64px;
  height: 34px;
}

.value-num {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.28rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.card-foot {
  margin-top: 0.3rem;
  padding-top: 0.25rem;
  border-top: 1px dashed rgb(34 32 28 / 30%);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  text-align: center;
  text-transform: uppercase;
}
</style>
