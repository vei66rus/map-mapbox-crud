import type { MapMouseEvent, MapTouchEvent } from 'mapbox-gl'
import type { GeoPoint } from '@/shared/types'

export const useSegmentInteraction = () => {
  const handleMapClick = (
    e: MapMouseEvent,
    isCreating: boolean,
    tempStart: GeoPoint | null,
    creationMode: 'draw' | 'points' | 'params',
    onSetStart: (point: GeoPoint) => void,
    onCreateSegmentFromPoints: (start: GeoPoint, end: GeoPoint) => void,
    onCreateSegmentFromParams: (startPoint: GeoPoint) => void
  ) => {
    const point: GeoPoint = { lat: e.lngLat.lat, lng: e.lngLat.lng }

    if (isCreating) {
      if (creationMode === 'params') {
        if (!tempStart) {
          onSetStart(point)
        } else {
          onCreateSegmentFromParams(tempStart)
        }
      } else if (creationMode === 'draw') {
        if (!tempStart) {
          onSetStart(point)
        } else {
          onCreateSegmentFromPoints(tempStart, point)
        }
      } else if (!tempStart) {
        onSetStart(point)
      } else {
        onCreateSegmentFromPoints(tempStart, point)
      }
    }
  }

  const handleMouseMove = (
    e: MapMouseEvent,
    isCreating: boolean,
    tempStart: GeoPoint | null,
    onMouseMove: (point: GeoPoint | null) => void
  ) => {
    if (isCreating && tempStart) {
      onMouseMove({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    }
  }

  const handleTouchMove = (
    e: MapTouchEvent,
    isCreating: boolean,
    tempStart: GeoPoint | null,
    onTouchMove: (point: GeoPoint | null) => void
  ) => {
    if (isCreating && tempStart) {
      if (e.lngLat) {
        onTouchMove({ lat: e.lngLat.lat, lng: e.lngLat.lng })
      } else if (e.point && e.point.x !== undefined && e.point.y !== undefined) {
        try {
          const lngLat = e.target.unproject(e.point)
          onTouchMove({ lat: lngLat.lat, lng: lngLat.lng })
        } catch (error) {
        }
      }
    }
  }

  const handleTouchStart = (
    e: MapTouchEvent,
    isCreating: boolean,
    onTouchStart: (point: GeoPoint | null) => void
  ) => {
    if (isCreating && e.lngLat) {
      onTouchStart({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    }
  }

  const handleTouchEnd = (
    e: MapTouchEvent,
    isCreating: boolean,
    onTouchEnd: (point: GeoPoint | null) => void
  ) => {
    if (isCreating && e.lngLat) {
      onTouchEnd({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    }
  }

  return {
    handleMapClick,
    handleMouseMove,
    handleTouchMove,
    handleTouchStart,
    handleTouchEnd
  }
}
