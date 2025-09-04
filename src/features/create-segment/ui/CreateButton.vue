<script setup lang="ts">
import { useSegmentStore } from '@/entities/segment'
import './CreateButton.scss'

const segmentStore = useSegmentStore()

const handleCreate = () => {
  segmentStore.startCreation()
}
</script>

<template>
  <button 
    class="create-button"
    @click="handleCreate"
    :disabled="segmentStore.isCreating"
  >
    {{ segmentStore.isCreating ? 'Создание...' : 'Создать сегмент' }}
  </button>
</template>
