<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ azimuth: number | null }>()

const ticks = Array.from({ length: 24 }, (_, i) => i * 15)
const labels = [0, 45, 90, 135, 180, 225, 270, 315]

function polar(deg: number, r: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: 60 + r * Math.cos(rad), y: 60 + r * Math.sin(rad) }
}

const needleRotation = computed(() => `rotate(${props.azimuth ?? 0} 60 60)`)
</script>

<template>
  <svg viewBox="0 0 120 120" class="dial" role="img" aria-label="Azimuth dial">
    <circle cx="60" cy="60" r="58" fill="#3f3a2c" />
    <circle cx="60" cy="60" r="55" fill="none" stroke="var(--brass)" stroke-width="5" />
    <circle cx="60" cy="60" r="50" fill="var(--mint)" />
    <circle cx="60" cy="60" r="50" fill="url(#dialShine)" />
    <g v-for="tick in ticks" :key="tick">
      <line
        :x1="polar(tick, tick % 45 === 0 ? 42 : 45).x"
        :y1="polar(tick, tick % 45 === 0 ? 42 : 45).y"
        :x2="polar(tick, 48).x"
        :y2="polar(tick, 48).y"
        stroke="#1f3a2c"
        :stroke-width="tick % 45 === 0 ? 2 : 1"
      />
    </g>
    <text
      v-for="label in labels"
      :key="label"
      :x="polar(label, 34).x"
      :y="polar(label, 34).y + 2.5"
      text-anchor="middle"
      class="dial-num"
    >
      {{ label }}°
    </text>
    <g class="needle" :transform="needleRotation">
      <polygon points="60,16 63,60 57,60" fill="#14251c" />
      <polygon points="60,74 62,60 58,60" fill="#14251c" opacity="0.55" />
    </g>
    <circle cx="60" cy="60" r="5" fill="#14251c" />
    <circle cx="60" cy="60" r="2" fill="var(--brass-soft)" />
    <defs>
      <radialGradient id="dialShine" cx="0.35" cy="0.3" r="0.9">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="100%" stop-color="#0a2015" stop-opacity="0.25" />
      </radialGradient>
    </defs>
  </svg>
</template>

<style scoped>
.dial {
  width: 100%;
  height: auto;
  display: block;
}

.dial-num {
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 700;
  fill: #1f3a2c;
}

.needle {
  transition: transform 0.55s cubic-bezier(0.34, 1.3, 0.5, 1);
}
</style>
