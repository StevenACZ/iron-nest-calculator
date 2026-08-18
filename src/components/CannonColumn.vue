<script setup lang="ts">
import { computed, ref } from 'vue'
import { GUN_CAPACITY } from '../lib/ballistics.ts'
import { moveShot, removeShot, store, targetGun, type GunId } from '../lib/store.ts'
import { t } from '../lib/i18n.ts'
import ShotCard from './ShotCard.vue'

const props = defineProps<{ gun: GunId }>()

const shots = computed(() => store.shots.filter((s) => s.gun === props.gun))
const isNext = computed(() => targetGun() === props.gun)
const isFull = computed(() => shots.value.length >= GUN_CAPACITY)
const dragOver = ref(false)

function onDrop(e: DragEvent) {
  dragOver.value = false
  const id = e.dataTransfer?.getData('text/plain')
  if (id) moveShot(id, props.gun)
}
</script>

<template>
  <section
    class="cannon metal-panel rivets rivets-bottom"
    :class="{ 'is-next': isNext, 'drag-over': dragOver }"
    @dragover.prevent="dragOver = true"
    @dragleave="dragOver = false"
    @drop.prevent="onDrop"
  >
    <header class="cannon-head">
      <svg viewBox="0 0 60 34" class="cannon-icon" aria-hidden="true">
        <line x1="2" y1="31" x2="58" y2="31" stroke="#2f3a29" stroke-width="2" />
        <rect x="16" y="8" width="34" height="6" rx="2" fill="#22201c" transform="rotate(-20 16 14)" />
        <rect x="12" y="19" width="22" height="8" rx="2" fill="#22201c" />
        <circle cx="18" cy="28" r="5" fill="#14120e" stroke="#c9a437" stroke-width="1.5" />
        <circle cx="30" cy="28" r="5" fill="#14120e" stroke="#c9a437" stroke-width="1.5" />
        <circle cx="18" cy="28" r="1.5" fill="#c9a437" />
        <circle cx="30" cy="28" r="1.5" fill="#c9a437" />
      </svg>
      <span class="plate-label">{{ t('gun') }} {{ gun }}</span>
      <transition name="fade">
        <span v-if="isNext" class="next-badge">▸ {{ t('next') }}</span>
      </transition>
      <span class="count" :class="{ 'count-full': isFull }">{{ shots.length }}/{{ GUN_CAPACITY }}</span>
    </header>

    <TransitionGroup tag="div" name="cardfx" class="cannon-body">
      <ShotCard v-for="shot in shots" :key="shot.id" :shot="shot" @remove="removeShot" />
      <div v-if="shots.length === 0" key="__empty" class="empty-slot">
        {{ isFull ? t('full') : t('empty') }}
      </div>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.cannon {
  display: flex;
  flex-direction: column;
  padding: 0.65rem 0.7rem 0.8rem;
  min-height: 260px;
  transition:
    outline-color 0.25s ease,
    box-shadow 0.25s ease;
  outline: 2px solid transparent;
  outline-offset: 3px;
}

.cannon.is-next {
  outline-color: rgb(201 164 55 / 55%);
}

.cannon.drag-over {
  outline-color: var(--brass-soft);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 14%),
    inset 0 -2px 6px rgb(0 0 0 / 25%),
    0 0 0 3px rgb(201 164 55 / 25%),
    0 8px 22px rgb(0 0 0 / 45%);
}

.cannon-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.15rem 0.5rem;
  border-bottom: 1px solid rgb(0 0 0 / 25%);
  margin-bottom: 0.55rem;
}

.cannon-icon {
  width: 44px;
  height: 26px;
  flex: none;
}

.next-badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brass-soft);
  text-shadow: 0 1px 2px rgb(0 0 0 / 60%);
}

.count {
  margin-left: auto;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--cream);
  background: rgb(0 0 0 / 30%);
  border: 1px solid rgb(0 0 0 / 35%);
  border-radius: 4px;
  padding: 0.12rem 0.4rem;
}

.count-full {
  color: var(--red-bright);
}

.cannon-body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  flex: 1;
}

.empty-slot {
  border: 2px dashed rgb(0 0 0 / 28%);
  border-radius: 6px;
  color: rgb(20 25 15 / 55%);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90px;
  flex: 1;
}

.cardfx-enter-active {
  transition:
    transform 0.5s cubic-bezier(0.22, 1.4, 0.36, 1),
    opacity 0.35s ease;
}

.cardfx-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.25s ease;
  position: absolute;
  width: 100%;
}

.cardfx-enter-from {
  transform: translateY(-30px) rotate(-5deg) scale(0.85);
  opacity: 0;
}

.cardfx-leave-to {
  transform: translateY(12px) scale(0.9);
  opacity: 0;
}

.cardfx-move {
  transition: transform 0.4s cubic-bezier(0.22, 1.2, 0.36, 1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
