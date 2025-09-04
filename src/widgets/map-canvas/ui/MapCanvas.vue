<script setup lang="ts">
import { onMounted, watch, onUnmounted, computed } from 'vue'
import { useSegmentStore } from '@/entities/segment'
import { useMap, useMapLayers, useSegmentInteraction } from '@/shared/composables'
import './MapCanvas.scss'

const segmentStore = useSegmentStore()
const { initializeMap, onMapClick, onMouseMove, onTouchMove, onTouchStart, onTouchEnd, cleanup, isMapLoaded } = useMap()
const { setMap, initializeLayers, updateSegmentLayers, updateTempSegment } = useMapLayers()
const { handleMapClick, handleMouseMove } = useSegmentInteraction()

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && segmentStore.isCreating) {
    segmentStore.cancelCreation()
  }
}

const updateCursor = (isCreating: boolean) => {
  const mapContainer = document.getElementById('map')
  if (mapContainer) {
    if (isCreating) {
      mapContainer.style.cursor = 'crosshair'
    } else {
      mapContainer.style.cursor = 'grab'
    }
  }
}

const mapContainerClass = computed(() => ({
  'map-canvas__container': true,
  'creating': segmentStore.isCreating
}))

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  
  setTimeout(() => {
    const map = initializeMap('map')
    if (!map) {
      return
    }

    setMap(map)

    map.on('touchmove', (e: any) => {
      if (segmentStore.isCreating && segmentStore.tempStart) {
        if (e.lngLat) {
          segmentStore.setMousePosition({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        }
      }
    })

    map.on('load', () => {
      setTimeout(() => {
        initializeLayers()
        
        setTimeout(() => {
          updateSegmentLayers(segmentStore.segments)
        }, 2500)
      }, 2000)
    })

    onMapClick((e: any) => {
      handleMapClick(
        e,
        segmentStore.isCreating,
        segmentStore.tempStart,
        segmentStore.creationMode,
        segmentStore.setStartPoint,
        segmentStore.createSegmentFromPoints,
        segmentStore.createSegmentFromParams
      )
      
      if (segmentStore.isCreating && !segmentStore.tempStart && e.lngLat) {
        segmentStore.setMousePosition({ lat: e.lngLat.lat, lng: e.lngLat.lng })
      }
    })

    onMouseMove((e: any) => {
      handleMouseMove(
        e,
        segmentStore.isCreating,
        segmentStore.tempStart,
        segmentStore.setMousePosition
      )
    })

    onTouchMove((e: any) => {
      if (segmentStore.isCreating && segmentStore.tempStart) {
        if (e.lngLat) {
          segmentStore.setMousePosition({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        } else if (e.point && e.point.x !== undefined && e.point.y !== undefined) {
          try {
            const lngLat = e.target.unproject(e.point)
            segmentStore.setMousePosition({ lat: lngLat.lat, lng: lngLat.lng })
          } catch (error) {
          }
        }
      }
    })

    onTouchStart((e: any) => {
      if (segmentStore.isCreating && segmentStore.tempStart) {
        if (e.lngLat) {
          segmentStore.setMousePosition({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        }
      }
    })

    onTouchEnd((e: any) => {
      if (segmentStore.isCreating && segmentStore.tempStart) {
        if (e.lngLat) {
          segmentStore.setMousePosition({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        }
      }
    })

    watch(() => segmentStore.segments, () => {
      if (isMapLoaded.value) {
        updateSegmentLayers(segmentStore.segments)
      }
    }, { deep: true })

    watch([() => segmentStore.tempStart, () => segmentStore.mousePosition], () => {
      if (segmentStore.tempStart && segmentStore.mousePosition && segmentStore.creationMode === 'draw') {
        if (isMapLoaded.value) {
          updateTempSegment(segmentStore.tempStart, segmentStore.mousePosition, 'draw')
        }
      } else if (segmentStore.tempStart && segmentStore.creationMode === 'params') {
        if (isMapLoaded.value) {
          updateTempSegment(segmentStore.tempStart, null, 'params', {
            azimuth: segmentStore.tempAzimuth,
            distance: segmentStore.tempDistance,
            gateAngle: segmentStore.tempGateAngle
          })
        }
      } else if (segmentStore.tempStart && segmentStore.mousePosition && segmentStore.creationMode === 'points') {
        if (isMapLoaded.value) {
          updateTempSegment(segmentStore.tempStart, segmentStore.mousePosition, 'points')
        }
      } else {
        updateTempSegment(null, null)
      }
    })

    watch([() => segmentStore.tempAzimuth, () => segmentStore.tempDistance, () => segmentStore.tempGateAngle], () => {
      if (segmentStore.tempStart && segmentStore.creationMode === 'params' && isMapLoaded.value) {
        updateTempSegment(segmentStore.tempStart, null, 'params', {
          azimuth: segmentStore.tempAzimuth,
          distance: segmentStore.tempDistance,
          gateAngle: segmentStore.tempGateAngle
        })
      }
    })
  }, 100)
})

watch(() => segmentStore.isCreating, (isCreating) => {
  updateCursor(isCreating)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  cleanup()
})
</script>

<template>
  <div class="map-canvas">
    <div id="map" :class="mapContainerClass"></div>
  </div>
</template>