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
        <h1 class="title">
          Iron Nest
          <span class="subtitle">{{ t('subtitle') }}</span>
        </h1>
        <div class="header-links">
          <a
            class="gh-btn"
            href="https://github.com/StevenACZ/iron-nest-calculator"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>
          <button type="button" class="lang-btn" @click="toggleLang">
            {{ t('langLabel') }}
          </button>
        </div>
      </div>
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
      <section class="about">
        <p class="intro">{{ t('intro') }}</p>
        <details class="faq">
          <summary>{{ t('faqTitle') }}</summary>
          <dl>
            <dt>{{ t('faq1q') }}</dt>
            <dd>{{ t('faq1a') }}</dd>
            <dt>{{ t('faq2q') }}</dt>
            <dd>{{ t('faq2a') }}</dd>
            <dt>{{ t('faq3q') }}</dt>
            <dd>{{ t('faq3a') }}</dd>
            <dt>{{ t('faq4q') }}</dt>
            <dd>{{ t('faq4a') }}</dd>
          </dl>
        </details>
        <nav class="ext-links">
          <a
            href="https://store.steampowered.com/app/2950790/IRON_NEST_Heavy_Turret_Simulator/"
            target="_blank"
            rel="noopener"
          >
            {{ t('linkSteam') }}
          </a>
          <a href="https://github.com/StevenACZ/iron-nest-calculator" target="_blank" rel="noopener">
            {{ t('linkGithub') }}
          </a>
          <a href="https://iron-nest.fandom.com/" target="_blank" rel="noopener">
            {{ t('linkWiki') }}
          </a>
        </nav>
      </section>
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

.header-links {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.gh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: rgb(0 0 0 / 30%);
  border: 1px solid rgb(201 164 55 / 40%);
  color: var(--cream);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.gh-btn:hover {
  border-color: var(--brass);
  color: var(--brass-soft);
}

.gh-btn svg {
  width: 17px;
  height: 17px;
}

.lang-btn {
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
  display: block;
  margin-top: 0.3rem;
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--cream-dim);
  text-shadow: none;
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

.about {
  max-width: 640px;
  margin: 1rem auto 0;
  text-align: left;
}

.intro {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.55;
  color: var(--cream-dim);
  text-align: center;
}

.faq {
  margin-top: 0.7rem;
  font-size: 0.72rem;
  color: var(--cream-dim);
}

.faq summary {
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.66rem;
  color: var(--cream);
}

.faq summary:hover {
  color: var(--brass-soft);
}

.faq dl {
  margin: 0.6rem 0 0;
}

.faq dt {
  font-weight: 700;
  color: var(--cream);
  margin-top: 0.55rem;
}

.faq dd {
  margin: 0.2rem 0 0;
  line-height: 1.5;
}

.ext-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 1.2rem;
  margin-top: 0.8rem;
  font-size: 0.68rem;
}

.ext-links a {
  color: var(--cream-dim);
  text-decoration-color: rgb(201 164 55 / 45%);
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.ext-links a:hover {
  color: var(--brass-soft);
}

.disclaimer {
  margin: 0.8rem 0 0;
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
