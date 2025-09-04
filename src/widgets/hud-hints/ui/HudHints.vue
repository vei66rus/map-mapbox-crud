<script setup lang="ts">
import { computed } from 'vue'
import { useSegmentStore } from '@/entities/segment'
import { computeBearing, computeDistance } from '@/entities/segment/lib/compute'
import type { GeoPoint } from '@/shared/types'
import './HudHints.scss'

const segmentStore = useSegmentStore()

const showHints = computed(() => {
  return segmentStore.isCreating && segmentStore.tempStart && segmentStore.mousePosition
})

const hintsInfo = computed(() => {
  if (!showHints.value || !segmentStore.tempStart || !segmentStore.mousePosition) {
    return null
  }

  const start = segmentStore.tempStart
  const end = segmentStore.mousePosition
  
  const bearing = computeBearing(start, end)
  const distance = computeDistance(start, end)
  
  return {
    bearing: Math.round(bearing),
    distance: Math.round(distance)
  }
})

const handleCancel = () => {
  segmentStore.cancelCreation()
}
</script>

<template>
  <div v-if="showHints" class="hud-hints">
    <div class="hud-hints__info">
      <div class="hud-hints__item">
        <span class="hud-hints__label">Азимут:</span>
        <span class="hud-hints__value">{{ hintsInfo?.bearing }}°</span>
      </div>
      <div class="hud-hints__item">
        <span class="hud-hints__label">Расстояние:</span>
        <span class="hud-hints__value">{{ hintsInfo?.distance }}м</span>
      </div>
    </div>
    <div class="hud-hints__instruction">
      Кликните еще раз для создания сегмента
    </div>
    <button class="hud-hints__cancel" @click="handleCancel">
      Отменить
    </button>
  </div>
</template>