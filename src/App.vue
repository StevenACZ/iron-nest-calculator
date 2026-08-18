<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { cycleAssignMode, resetVolley, store, type AssignMode } from './lib/store.ts'
import { t, toggleLang } from './lib/i18n.ts'
import CalculatorPanel from './components/CalculatorPanel.vue'
import CannonColumn from './components/CannonColumn.vue'
import HistoryPanel from './components/HistoryPanel.vue'

const calc = ref<InstanceType<typeof CalculatorPanel> | null>(null)

const MODES: { id: AssignMode; label: () => string }[] = [
  { id: 'alternate', label: () => t.value('modeAuto') },
  { id: 'gun1', label: () => t.value('modeGun1') },
  { id: 'gun2', label: () => t.value('modeGun2') },
]

function doReset(): void {
  resetVolley()
  calc.value?.focusAzimuth()
}

function onKeydown(e: KeyboardEvent): void {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const key = e.key.toLowerCase()
  if (key === 'r') {
    e.preventDefault()
    doReset()
  } else if (key === 'c') {
    e.preventDefault()
    cycleAssignMode()
  } else if (key === 'escape') {
    calc.value?.focusAzimuth()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="shell-layout">
    <header class="top">
      <p class="tagline">{{ t('tagline') }}</p>
      <div class="title-row">
        <h1 class="title">Iron Nest</h1>
        <button type="button" class="lang-btn" @click="toggleLang">
          {{ t('langLabel') }}
        </button>
      </div>
      <p class="subtitle">{{ t('subtitle') }}</p>
    </header>

    <main class="board">
      <CalculatorPanel ref="calc" />

      <div class="guns-zone">
        <div class="guns-bar">
          <div class="mode-chips">
            <button
              v-for="mode in MODES"
              :key="mode.id"
              type="button"
              class="mode-chip"
              :class="{ active: store.assignMode === mode.id }"
              @click="store.assignMode = mode.id"
            >
              {{ mode.label() }}
            </button>
            <span class="key-tag">C</span>
          </div>
          <button type="button" class="reset-btn" @click="doReset">
            ⟳ {{ t('reset') }} <span class="key-tag">R</span>
          </button>
        </div>

        <div class="guns-grid">
          <CannonColumn :gun="1" />
          <CannonColumn :gun="2" />
        </div>

        <HistoryPanel />
      </div>
    </main>

    <footer class="foot">
      <p class="hints">{{ t('hintKeys') }} · {{ t('hintDrag') }}</p>
      <p class="disclaimer">{{ t('disclaimer') }}</p>
    </footer>
  </div>
</template>

<style scoped>
.shell-layout {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100vh;
}

.top {
  text-align: center;
}

.tagline {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: var(--red-bright);
}

.title-row {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  margin: 0.1rem 0 0;
  font-family: var(--font-mono);
  font-size: clamp(1.9rem, 5vw, 2.7rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brass-soft);
  text-shadow:
    0 0 22px rgb(201 164 55 / 30%),
    0 2px 3px rgb(0 0 0 / 65%);
}

.lang-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgb(0 0 0 / 30%);
  border: 1px solid rgb(201 164 55 / 40%);
  border-radius: 5px;
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.3rem 0.55rem;
  transition: border-color 0.2s ease;
}

.lang-btn:hover {
  border-color: var(--brass);
}

.subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--cream-dim);
}

.board {
  display: grid;
  grid-template-columns: minmax(300px, 380px) 1fr;
  gap: 1rem;
  align-items: start;
}

.guns-zone {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-width: 0;
}

.guns-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.mode-chips {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.mode-chip {
  background: rgb(0 0 0 / 30%);
  border: 1.5px solid rgb(255 255 255 / 12%);
  border-radius: 6px;
  color: var(--cream-dim);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.6rem;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.mode-chip.active {
  color: var(--brass-soft);
  border-color: var(--brass);
}

.reset-btn {
  background: linear-gradient(180deg, #3a2018, #2a150f);
  border: 1.5px solid var(--red);
  border-radius: 6px;
  color: #e8b0a2;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.38rem 0.7rem;
  transition:
    box-shadow 0.2s ease,
    transform 0.12s ease;
}

.reset-btn:hover {
  box-shadow: 0 0 14px rgb(181 67 47 / 35%);
}

.reset-btn:active {
  transform: translateY(1px);
}

.key-tag {
  display: inline-block;
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 3px;
  font-size: 0.62rem;
  padding: 0.05rem 0.3rem;
  margin-left: 0.15rem;
  color: var(--cream);
}

.guns-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  align-items: stretch;
}

.foot {
  margin-top: auto;
  text-align: center;
}

.hints {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--cream-dim);
}

.disclaimer {
  margin: 0.35rem 0 0;
  font-size: 0.64rem;
  color: #7d745c;
}

@media (max-width: 860px) {
  .board {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .guns-grid {
    grid-template-columns: 1fr;
  }
}
</style>
