<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useSegmentStore } from '@/entities/segment'

const segmentStore = useSegmentStore()
const editingSegment = ref<string | null>(null)
const editingName = ref<string>('')
const isEditingName = ref(false)
const nameInput = ref<HTMLInputElement>()

watch(() => segmentStore.activeSegmentId, (newId) => {
  if (newId && segmentStore.isEditing) {
    editingSegment.value = newId
  } else {
    editingSegment.value = null
  }
})

const handleEditSegment = (id: string) => {
  segmentStore.setActiveSegment(id)
  segmentStore.setEditing(true)
  editingSegment.value = id
}

const handleCancelEdit = () => {
  segmentStore.setEditing(false)
  segmentStore.setActiveSegment(null)
  editingSegment.value = null
}

const handleToggleVisibility = (id: string) => {
  segmentStore.toggleSegmentVisibility(id)
}

const handleDeleteSegment = (id: string) => {
  if (confirm('Удалить сегмент?')) {
    segmentStore.deleteSegment(id)
    if (editingSegment.value === id) {
      handleCancelEdit()
    }
  }
}

const handleUpdateSegment = (id: string, updates: any) => {
  segmentStore.updateSegment({
    id,
    updates
  })
}

const handleStartEditName = () => {
  editingName.value = activeSegment.value?.name || ''
  isEditingName.value = true
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

const handleSaveName = () => {
  if (activeSegment.value && editingName.value.trim()) {
    handleUpdateSegment(activeSegment.value.id, { name: editingName.value.trim() })
  }
  isEditingName.value = false
}

const handleCancelEditName = () => {
  isEditingName.value = false
  editingName.value = ''
}

const activeSegment = computed(() => {
  if (!segmentStore.activeSegmentId) return null
  return segmentStore.segments.find(s => s.id === segmentStore.activeSegmentId)
})
</script>

<template>
  <div class="segment-panel">
    <div class="segment-panel__header">
      <h3 class="segment-panel__title">Сегменты</h3>
    </div>

    <div v-if="segmentStore.isCreating" class="segment-panel__instructions">
      <div class="segment-panel__instructions-header">
        <h4 class="segment-panel__instructions-title">Создание сегмента</h4>
      </div>
      <div class="segment-panel__instructions-steps">
        <div class="segment-panel__instruction-step">
          <div class="segment-panel__step-number">1</div>
          <span>Кликните по карте для установки начальной точки</span>
        </div>
        <div class="segment-panel__instruction-step">
          <div class="segment-panel__step-number">2</div>
          <span>Нарисуйте линию мышью</span>
        </div>
        <div class="segment-panel__instruction-step">
          <div class="segment-panel__step-number">3</div>
          <span>Кликните еще раз для создания сегмента</span>
        </div>
      </div>
      <div class="segment-panel__actions">
        <button 
          class="segment-panel__btn segment-panel__btn--secondary"
          @click="segmentStore.cancelCreation"
        >
          Отмена
        </button>
      </div>
    </div>

    <div v-if="activeSegment && segmentStore.isEditing" class="segment-panel__edit-form">
      <div class="segment-panel__edit-header">
        <h4 v-if="!isEditingName" class="segment-panel__edit-title" @click="handleStartEditName">
          {{ activeSegment.name }}
        </h4>
        <input 
          v-else
          ref="nameInput"
          v-model="editingName"
          class="segment-panel__name-input"
          @keyup.enter="handleSaveName"
          @keyup.esc="handleCancelEditName"
          @blur="handleSaveName"
          placeholder="Введите название"
        />
        <button class="segment-panel__edit-close" @click="handleCancelEdit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="segment-panel__edit-content">
        <div class="segment-panel__field-group">
          <div class="segment-panel__field-header">
            <label class="segment-panel__field-label">
              Азимут
            </label>
            <span class="segment-panel__field-value">{{ Math.round(activeSegment.params.azimuth) }}°</span>
          </div>
          <div class="segment-panel__field-controls">
            <input 
              type="range" 
              class="segment-panel__field-slider"
              :value="activeSegment.params.azimuth"
              @input="handleUpdateSegment(activeSegment.id, { 
                params: { 
                  ...activeSegment.params, 
                  azimuth: Number(($event.target as HTMLInputElement).value) 
                } 
              })"
              min="0" 
              max="360" 
              step="0.1"
            />
            <input 
              type="number" 
              class="segment-panel__field-input"
              :value="activeSegment.params.azimuth"
              @input="handleUpdateSegment(activeSegment.id, { 
                params: { 
                  ...activeSegment.params, 
                  azimuth: Number(($event.target as HTMLInputElement).value) 
                } 
              })"
              min="0" 
              max="360" 
              step="0.1"
            />
          </div>
        </div>
        
        <div class="segment-panel__field-group">
          <div class="segment-panel__field-header">
            <label class="segment-panel__field-label">
              Расстояние
            </label>
            <span class="segment-panel__field-value">{{ Math.round(activeSegment.params.distance) }}м</span>
          </div>
          <div class="segment-panel__field-controls">
            <input 
              type="range" 
              class="segment-panel__field-slider"
              :value="activeSegment.params.distance"
              @input="handleUpdateSegment(activeSegment.id, { 
                params: { 
                  ...activeSegment.params, 
                  distance: Number(($event.target as HTMLInputElement).value) 
                } 
              })"
              min="100" 
              max="10000" 
              step="100"
            />
            <input 
              type="number" 
              class="segment-panel__field-input"
              :value="activeSegment.params.distance"
              @input="handleUpdateSegment(activeSegment.id, { 
                params: { 
                  ...activeSegment.params, 
                  distance: Number(($event.target as HTMLInputElement).value) 
                } 
              })"
              min="100" 
              step="100"
            />
          </div>
        </div>
        
        <div class="segment-panel__field-group">
          <div class="segment-panel__field-header">
            <label class="segment-panel__field-label">
              Угол створа
            </label>
            <span class="segment-panel__field-value">{{ Math.round(activeSegment.params.gateAngle) }}°</span>
          </div>
          <div class="segment-panel__field-controls">
            <input 
              type="range" 
              class="segment-panel__field-slider"
              :value="activeSegment.params.gateAngle"
              @input="handleUpdateSegment(activeSegment.id, { 
                params: { 
                  ...activeSegment.params, 
                  gateAngle: Number(($event.target as HTMLInputElement).value) 
                } 
              })"
              min="0" 
              max="180" 
              step="0.1"
            />
            <input 
              type="number" 
              class="segment-panel__field-input"
              :value="activeSegment.params.gateAngle"
              @input="handleUpdateSegment(activeSegment.id, { 
                params: { 
                  ...activeSegment.params, 
                  gateAngle: Number(($event.target as HTMLInputElement).value) 
                } 
              })"
              min="0" 
              max="180" 
              step="0.1"
            />
          </div>
        </div>
      </div>
      
      <div class="segment-panel__edit-footer">
        <button class="segment-panel__btn segment-panel__btn--primary" @click="handleCancelEdit">
          Готово
        </button>
      </div>
    </div>

    <div class="segment-panel__list">
      <div 
        v-for="segment in segmentStore.segments"
        :key="segment.id"
        class="segment-panel__item"
        :class="{ 'segment-panel__item--active': segment.id === segmentStore.activeSegmentId }"
      >
        <div class="segment-panel__item-header">
          <span class="segment-panel__item-name">{{ segment.name }}</span>
          <div class="segment-panel__item-actions">
            <button 
              class="segment-panel__item-btn"
              @click="handleToggleVisibility(segment.id)"
            >
              {{ segment.visible ? 'Скрыть' : 'Показать' }}
            </button>
            <button 
              class="segment-panel__item-btn"
              @click="handleEditSegment(segment.id)"
            >
              Редактировать
            </button>
            <button 
              class="segment-panel__item-btn segment-panel__item-btn--danger"
              @click="handleDeleteSegment(segment.id)"
            >
              Удалить
            </button>
          </div>
        </div>
        
        <div class="segment-panel__item-info">
          <div class="segment-panel__item-param">
            A: {{ Math.round(segment.params.azimuth) }}°
          </div>
          <div class="segment-panel__item-param">
            L: {{ Math.round(segment.params.distance) }}м
          </div>
          <div class="segment-panel__item-param">
            d: {{ Math.round(segment.params.gateAngle) }}°
          </div>
        </div>
      </div>
    </div>
  </div>
</template>