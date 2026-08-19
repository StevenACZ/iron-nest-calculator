<script setup lang="ts">
import type { RoundType } from '../lib/ballistics.ts'

defineProps<{ type: RoundType }>()
</script>

<template>
  <svg viewBox="0 0 16 16" aria-hidden="true" class="shell-ico">
    <template v-if="type === 'HE'">
      <path
        fill="currentColor"
        d="M8 1 9.5 5.5 13 3 11 6.8 15 8 11 9.2 13 13 9.5 10.5 8 15 6.5 10.5 3 13 5 9.2 1 8 5 6.8 3 3 6.5 5.5Z"
      />
    </template>
    <template v-else-if="type === 'AP'">
      <path stroke="currentColor" stroke-width="2" fill="none" d="M11.5 1.5v4M11.5 10.5v4" />
      <path stroke="currentColor" stroke-width="2" fill="none" d="M1 8h7" />
      <path fill="currentColor" d="M7.5 5.6 15 8l-7.5 2.4Z" />
    </template>
    <template v-else-if="type === 'DRIL'">
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linejoin="round"
        d="M4.5 1.8h7L10.6 6 8 14.5 5.4 6Z"
      />
      <path stroke="currentColor" stroke-width="1.2" d="M5.2 4.4h5.6M6.1 7.6h3.8M7 10.8h2" />
    </template>
    <template v-else-if="type === 'STAR'">
      <path
        fill="currentColor"
        d="M8 1 9.4 4.6 13 6 9.4 7.4 8 11 6.6 7.4 3 6 6.6 4.6Z"
      />
      <path
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        d="M8 12.2v.6M8 14.6v.4"
      />
      <circle cx="3.2" cy="10.6" r="0.9" fill="currentColor" />
      <circle cx="12.8" cy="10.6" r="0.9" fill="currentColor" />
    </template>
    <template v-else>
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linejoin="round"
        stroke-dasharray="2.6 1.8"
        d="M8 1.5c2.5 2.5 3.5 4.5 3.5 7.5v4.5h-7V9c0-3 1-5 3.5-7.5Z"
      />
    </template>
  </svg>
</template>

<style scoped>
.shell-ico {
  width: 14px;
  height: 14px;
  flex: none;
}
</style>
