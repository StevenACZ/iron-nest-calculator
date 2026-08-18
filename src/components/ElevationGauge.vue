<script setup lang="ts">
import { computed } from 'vue'
import { MAX_ELEVATION_DEG } from '../lib/ballistics.ts'

const props = defineProps<{ elevation: number | null }>()

const CX = 80
const CY = 86
const SPAN = 120

function polar(elevDeg: number, r: number): { x: number; y: number } {
  const angle = 180 + (180 - SPAN) / 2 + (elevDeg / MAX_ELEVATION_DEG) * SPAN
  const rad = (angle * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const ticks = Array.from({ length: 13 }, (_, i) => i * 5)
const labels = [0, 15, 30, 45, 60]

const arcPath = computed(() => {
  const start = polar(0, 62)
  const end = polar(MAX_ELEVATION_DEG, 62)
  return `M ${start.x} ${start.y} A 62 62 0 0 1 ${end.x} ${end.y} L ${CX} ${CY} Z`
})

const needleRotation = computed(() => {
  const e = Math.min(Math.max(props.elevation ?? 0, 0), MAX_ELEVATION_DEG)
  return `rotate(${(e / MAX_ELEVATION_DEG) * SPAN - SPAN / 2} ${CX} ${CY})`
})
</script>

<template>
  <svg viewBox="0 0 160 96" class="gauge" role="img" aria-label="Elevation gauge">
    <path :d="arcPath" fill="#3f3a2c" transform="translate(0 -2) scale(1.06)" transform-origin="80 86" />
    <path :d="arcPath" fill="var(--brass)" transform="scale(1.03)" transform-origin="80 86" />
    <path :d="arcPath" fill="var(--mint)" />
    <g v-for="tick in ticks" :key="tick">
      <line
        :x1="polar(tick, tick % 15 === 0 ? 50 : 54).x"
        :y1="polar(tick, tick % 15 === 0 ? 50 : 54).y"
        :x2="polar(tick, 59).x"
        :y2="polar(tick, 59).y"
        stroke="#1f3a2c"
        :stroke-width="tick % 15 === 0 ? 2 : 1"
      />
    </g>
    <text
      v-for="label in labels"
      :key="label"
      :x="polar(label, 34).x"
      :y="polar(label, 34).y + 3"
      text-anchor="middle"
      class="gauge-num"
    >
      {{ label }}
    </text>
    <g class="needle" :transform="needleRotation">
      <polygon :points="`${CX},${CY - 56} ${CX + 3},${CY} ${CX - 3},${CY}`" fill="#14251c" />
    </g>
    <circle :cx="CX" :cy="CY" r="5" fill="#14251c" />
    <circle :cx="CX" :cy="CY" r="2" fill="var(--brass-soft)" />
  </svg>
</template>

<style scoped>
.gauge {
  width: 100%;
  height: auto;
  display: block;
}

.gauge-num {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  fill: #1f3a2c;
}

.needle {
  transition: transform 0.55s cubic-bezier(0.34, 1.3, 0.5, 1);
}
</style>
