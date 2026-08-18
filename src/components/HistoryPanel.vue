<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatAzimuth, formatElevation } from '../lib/ballistics.ts'
import { clearHistory, closeMatch, store } from '../lib/store.ts'
import { t, lang } from '../lib/i18n.ts'

const open = ref(false)

const orderedMatches = computed(() => [...store.matches].sort((a, b) => b.n - a.n))

const totalVolleys = computed(() =>
  store.matches.reduce((acc, m) => acc + m.volleys.length, 0),
)

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString(lang.value === 'es' ? 'es-PE' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <section class="history metal-panel rivets">
    <button type="button" class="history-head" @click="open = !open">
      <span class="plate-label">{{ t('history') }}</span>
      <span class="history-meta">
        {{ t('match') }} {{ store.currentMatch }} · {{ t('volley') }} {{ store.currentVolley }}
      </span>
      <span class="chevron" :class="{ 'chevron-open': open }">▾</span>
    </button>

    <transition name="unfold">
      <div v-if="open" class="history-body">
        <div class="history-actions">
          <button type="button" class="ghost-btn" @click="closeMatch">
            {{ t('closeMatch') }}
          </button>
          <button
            v-if="totalVolleys > 0"
            type="button"
            class="ghost-btn danger"
            @click="clearHistory"
          >
            {{ t('clearHistory') }}
          </button>
        </div>

        <p v-if="orderedMatches.length === 0" class="history-empty">{{ t('noHistory') }}</p>

        <article v-for="match in orderedMatches" :key="match.n" class="match">
          <header class="match-head">
            <strong>
              {{ t('match') }} {{ match.n }}
              <span v-if="!match.closedAt" class="live-tag">· {{ t('currentMatch') }}</span>
            </strong>
            <span class="match-date">{{ fmtDate(match.startedAt) }}</span>
          </header>
          <div v-for="volley in match.volleys" :key="volley.n" class="volley">
            <div class="volley-head">
              {{ t('volley') }} {{ volley.n }} — {{ volley.shots.length }}
              {{ volley.shots.length === 1 ? t('shot') : t('shots') }}
            </div>
            <div class="volley-shots">
              <span v-for="(shot, i) in volley.shots" :key="i" class="shot-chip">
                C{{ shot.gun }} · {{ shot.type }}{{ shot.charge }} ·
                {{ formatAzimuth(shot.azimuth) }}° / {{ formatElevation(shot.elevation) }}° ·
                {{ shot.km.toFixed(2) }} km
              </span>
            </div>
          </div>
        </article>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.history {
  overflow: hidden;
}

.history-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: none;
  border: none;
  color: var(--cream);
  padding: 0.6rem 0.8rem;
  text-align: left;
}

.history-meta {
  margin-left: auto;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cream-dim);
}

.chevron {
  transition: transform 0.25s ease;
  color: var(--cream-dim);
}

.chevron-open {
  transform: rotate(180deg);
}

.history-body {
  padding: 0 0.8rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 320px;
  overflow-y: auto;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.ghost-btn {
  background: rgb(0 0 0 / 25%);
  border: 1px solid rgb(0 0 0 / 35%);
  border-radius: 5px;
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  transition: border-color 0.2s ease;
}

.ghost-btn:hover {
  border-color: var(--brass);
}

.ghost-btn.danger:hover {
  border-color: var(--red-bright);
  color: var(--red-bright);
}

.history-empty {
  margin: 0;
  font-size: 0.78rem;
  color: var(--cream-dim);
}

.match {
  background: rgb(0 0 0 / 18%);
  border: 1px solid rgb(0 0 0 / 25%);
  border-radius: 6px;
  padding: 0.5rem 0.6rem;
}

.match-head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: 0.8rem;
  margin-bottom: 0.35rem;
}

.live-tag {
  color: var(--brass-soft);
  font-weight: 400;
  font-size: 0.7rem;
}

.match-date {
  margin-left: auto;
  font-size: 0.68rem;
  color: var(--cream-dim);
}

.volley {
  padding: 0.3rem 0;
  border-top: 1px dashed rgb(255 255 255 / 12%);
}

.volley-head {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brass-soft);
  margin-bottom: 0.25rem;
}

.volley-shots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.shot-chip {
  background: rgb(236 227 203 / 10%);
  border: 1px solid rgb(236 227 203 / 15%);
  border-radius: 4px;
  font-size: 0.66rem;
  padding: 0.15rem 0.4rem;
  color: var(--cream);
  white-space: nowrap;
}

.unfold-enter-active,
.unfold-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  max-height: 340px;
}

.unfold-enter-from,
.unfold-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
