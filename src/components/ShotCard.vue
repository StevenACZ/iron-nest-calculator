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

const rings = computed(() => Math.min(props.shot.charge, 4))
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
        <polygon points="2,13 26,4 26,22" :fill="typeColor" stroke="#22201c" stroke-width="1.5" />
        <rect x="26" y="4" width="52" height="18" rx="2" fill="#efe8d2" stroke="#22201c" stroke-width="1.5" />
        <text x="52" y="17.5" text-anchor="middle" class="shell-type">{{ shot.type }}</text>
        <path d="M 82 2 L 79 2 L 79 24 L 82 24" fill="none" stroke="#22201c" stroke-width="1.8" />
        <text x="90" y="18" text-anchor="middle" class="shell-charge">{{ shot.charge }}</text>
        <path
          v-for="r in rings"
          :key="r"
          :d="`M ${96 + r * 6} 4 A 9 9 0 0 1 ${96 + r * 6} 22`"
          fill="none"
          stroke="#22201c"
          stroke-width="1.8"
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
          <rect x="8" y="21" width="22" height="7" rx="2" fill="#22201c" />
          <rect x="24" y="10" width="22" height="5" rx="1.5" fill="#22201c" transform="rotate(-28 24 15)" />
          <circle cx="14" cy="29" r="3.5" fill="#22201c" />
          <circle cx="25" cy="29" r="3.5" fill="#22201c" />
          <line x1="48" y1="26" x2="48" y2="8" stroke="#b5432f" stroke-width="2.5" />
          <polygon points="48,2 44,10 52,10" fill="#b5432f" />
        </svg>
        <div class="value-num">{{ formatElevation(shot.elevation) }}°</div>
      </div>

      <div class="value-block">
        <svg viewBox="0 0 64 34" class="value-icon" aria-hidden="true">
          <line x1="2" y1="30" x2="62" y2="30" stroke="#57523f" stroke-width="1.5" stroke-dasharray="3 2" />
          <rect x="24" y="18" width="16" height="10" rx="2" fill="#22201c" />
          <line x1="29" y1="18" x2="29" y2="6" stroke="#22201c" stroke-width="2.5" />
          <line x1="35" y1="18" x2="35" y2="6" stroke="#22201c" stroke-width="2.5" />
          <path d="M 20 14 A 16 16 0 0 1 30 6" fill="none" stroke="#b5432f" stroke-width="2.5" />
          <polygon points="18,18 17,10 24,13" fill="#b5432f" />
          <path d="M 44 14 A 16 16 0 0 0 34 6" fill="none" stroke="#b5432f" stroke-width="2.5" />
          <polygon points="46,18 47,10 40,13" fill="#b5432f" />
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
