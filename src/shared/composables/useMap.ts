import { ref, inject } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { MapLayer, MapSource } from '@/shared/types'
import { config } from '@/shared/config/env'

interface UseMapReturn {
  map: any
  isMapLoaded: any
  initializeMap: (containerId: string) => any
  addSource: (source: MapSource) => void
  addLayer: (layer: MapLayer) => void
  updateSourceData: (sourceId: string, data: any) => void
  onMapClick: (callback: (e: any) => void) => void
  onMouseMove: (callback: (e: any) => void) => void
  onTouchMove: (callback: (e: any) => void) => void
  onTouchStart: (callback: (e: any) => void) => void
  onTouchEnd: (callback: (e: any) => void) => void
  cleanup: () => void
}

export const useMap = (): UseMapReturn => {
  const map = ref<mapboxgl.Map | null>(null)
  const mapbox = inject<typeof mapboxgl>('mapbox')
  const isMapLoaded = ref(false)

  const isMapReady = () => {
    return map.value && isMapLoaded.value && map.value.isStyleLoaded()
  }

  const initializeMap = (containerId: string) => {
    if (!mapbox) {
      return null
    }

    const container = document.getElementById(containerId)
    if (!container) {
      return null
    }

    try {
      const newMap = new mapboxgl.Map({
        container: containerId,
        style: config.mapbox.style,
        center: config.mapbox.center,
        zoom: config.mapbox.zoom,
        attributionControl: false,
        interactive: true,
        trackResize: true,
        preserveDrawingBuffer: false,
        dragPan: true,
        dragRotate: true,
        scrollZoom: true,
        touchZoomRotate: true,
        boxZoom: true,
        doubleClickZoom: true,
        keyboard: true
      })

      newMap.on('load', () => {
        if (newMap.isStyleLoaded()) {
          setTimeout(() => {
            isMapLoaded.value = true
          }, 200)
        } else {
          newMap.on('style.load', () => {
            setTimeout(() => {
              isMapLoaded.value = true
            }, 200)
          })
        }
      })

      map.value = newMap
      return newMap
    } catch (error) {
      return null
    }
  }

  const addSource = (source: MapSource) => {
    if (!isMapReady()) {
      return
    }
    try {
      map.value!.addSource(source.id, source)
    } catch (error) {
      return
    }
  }

  const addLayer = (layer: MapLayer) => {
    if (!isMapReady()) {
      return
    }
    try {
      map.value!.addLayer(layer)
    } catch (error) {
      return
    }
  }

  const updateSourceData = (sourceId: string, data: any) => {
    if (!isMapReady()) {
      return
    }
    try {
      const source = map.value!.getSource(sourceId) as mapboxgl.GeoJSONSource
      if (source) {
        source.setData(data)
      }
    } catch (error) {
      return
    }
  }

  const onMapClick = (callback: (e: mapboxgl.MapMouseEvent) => void) => {
    if (!map.value) return
    map.value.on('click', callback)
  }

  const onMouseMove = (callback: (e: mapboxgl.MapMouseEvent) => void) => {
    if (!map.value) return
    map.value.on('mousemove', callback)
  }

  const onTouchMove = (callback: (e: mapboxgl.MapTouchEvent) => void) => {
    if (!map.value) return
    map.value.on('touchmove', callback)
  }

  const onTouchStart = (callback: (e: mapboxgl.MapTouchEvent) => void) => {
    if (!map.value) return
    map.value.on('touchstart', callback)
  }

  const onTouchEnd = (callback: (e: mapboxgl.MapTouchEvent) => void) => {
    if (!map.value) return
    map.value.on('touchend', callback)
  }

  const cleanup = () => {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
    isMapLoaded.value = false
  }

  return {
    map,
    isMapLoaded,
    initializeMap,
    addSource,
    addLayer,
    updateSourceData,
    onMapClick,
    onMouseMove,
    onTouchMove,
    onTouchStart,
    onTouchEnd,
    cleanup
  }
}
