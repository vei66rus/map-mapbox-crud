import type { Map } from 'mapbox-gl'
import { computeSegmentGeometry, computeSegmentFromPoints, computeSegmentFromParams } from '@/shared/lib/geometry'
import type { Segment, GeoPoint } from '@/shared/types'

export const useMapLayers = () => {
  let mapInstance: Map | null = null

  const setMap = (map: Map) => {
    mapInstance = map
  }

  const initializeLayers = () => {
    if (!mapInstance) {
      return
    }

    try {
      mapInstance.addSource('segments', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      mapInstance.addSource('temp-segment', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      mapInstance.addLayer({
        id: 'azimuth-lines',
        type: 'line',
        source: 'segments',
        filter: ['==', ['get', 'type'], 'azimuth'],
        paint: { 'line-color': ['get', 'color'], 'line-width': 3 }
      })

      mapInstance.addLayer({
        id: 'gate-lines',
        type: 'line',
        source: 'segments',
        filter: ['==', ['get', 'type'], 'gate'],
        paint: { 'line-color': ['get', 'color'], 'line-width': 2 }
      })

      mapInstance.addLayer({
        id: 'segment-points',
        type: 'circle',
        source: 'segments',
        filter: ['==', ['get', 'type'], 'point'],
        paint: { 'circle-radius': 4, 'circle-color': ['get', 'color'] }
      })

      mapInstance.addLayer({
        id: 'temp-azimuth',
        type: 'line',
        source: 'temp-segment',
        filter: ['==', ['get', 'type'], 'temp-azimuth'],
        paint: { 'line-color': '#dc3545', 'line-width': 2, 'line-dasharray': [2, 2] }
      })

      mapInstance.addLayer({
        id: 'temp-gate',
        type: 'line',
        source: 'temp-segment',
        filter: ['==', ['get', 'type'], 'temp-gate'],
        paint: { 'line-color': '#dc3545', 'line-width': 2, 'line-dasharray': [2, 2] }
      })

      mapInstance.addLayer({
        id: 'temp-draw-line',
        type: 'line',
        source: 'temp-segment',
        filter: ['==', ['get', 'type'], 'temp-draw-line'],
        paint: { 
          'line-color': '#dc3545', 
          'line-width': 3, 
          'line-dasharray': [5, 5],
          'line-opacity': 0.8
        }
      })
    } catch (error) {
      return
    }
  }

  const updateSegmentLayers = (segments: Segment[]) => {
    if (!mapInstance) {
      return
    }

    const features: GeoJSON.Feature[] = []

    segments.filter(s => s.visible).forEach(segment => {
      const geometry = computeSegmentGeometry(segment.params)
      
      features.push({
        type: 'Feature',
        properties: { type: 'azimuth', segmentId: segment.id, color: segment.color },
        geometry: {
          type: 'LineString',
          coordinates: [
            [geometry.azimuthLine[0].lng, geometry.azimuthLine[0].lat],
            [geometry.azimuthLine[1].lng, geometry.azimuthLine[1].lat]
          ]
        }
      })

      features.push({
        type: 'Feature',
        properties: { type: 'gate', segmentId: segment.id, color: segment.color },
        geometry: {
          type: 'LineString',
          coordinates: [
            [geometry.gateLine[0].lng, geometry.gateLine[0].lat],
            [geometry.gateLine[1].lng, geometry.gateLine[1].lat]
          ]
        }
      })

      geometry.points.forEach(point => {
        features.push({
          type: 'Feature',
          properties: { type: 'point', segmentId: segment.id, color: segment.color },
          geometry: { type: 'Point', coordinates: [point.lng, point.lat] }
        })
      })
    })

    try {
      const source = mapInstance.getSource('segments') as mapboxgl.GeoJSONSource
      if (source) {
        source.setData({ type: 'FeatureCollection', features })
      }
    } catch (error) {
      return
    }
  }

  const updateTempSegment = (start: GeoPoint | null, end: GeoPoint | null, creationMode: 'draw' | 'points' | 'params' = 'draw', tempParams?: { azimuth: number, distance: number, gateAngle: number }) => {
    if (!mapInstance) {
      return
    }

    try {
      const source = mapInstance.getSource('temp-segment') as mapboxgl.GeoJSONSource
      if (!source) {
        return
      }

      if (!start) {
        source.setData({ type: 'FeatureCollection', features: [] })
        return
      }

      let features: GeoJSON.Feature[] = []

      if (creationMode === 'draw' && end) {
        features = [
          {
            type: 'Feature' as const,
            properties: { type: 'temp-draw-line' },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat]
              ]
            }
          }
        ]
      } else if (creationMode === 'params' && tempParams) {
        const params = computeSegmentFromParams(start, tempParams.azimuth, tempParams.distance, tempParams.gateAngle)
        const geometry = computeSegmentGeometry(params)
        
        features = [
          {
            type: 'Feature' as const,
            properties: { type: 'temp-azimuth' },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [geometry.azimuthLine[0].lng, geometry.azimuthLine[0].lat],
                [geometry.azimuthLine[1].lng, geometry.azimuthLine[1].lat]
              ]
            }
          },
          {
            type: 'Feature' as const,
            properties: { type: 'temp-gate' },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [geometry.gateLine[0].lng, geometry.gateLine[0].lat],
                [geometry.gateLine[1].lng, geometry.gateLine[1].lat]
              ]
            }
          }
        ]
      } else if (creationMode === 'points' && end) {
        const params = computeSegmentFromPoints(start, end, 0)
        const geometry = computeSegmentGeometry(params)
        
        features = [
          {
            type: 'Feature' as const,
            properties: { type: 'temp-azimuth' },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [geometry.azimuthLine[0].lng, geometry.azimuthLine[0].lat],
                [geometry.azimuthLine[1].lng, geometry.azimuthLine[1].lat]
              ]
            }
          },
          {
            type: 'Feature' as const,
            properties: { type: 'temp-gate' },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [geometry.gateLine[0].lng, geometry.gateLine[0].lat],
                [geometry.gateLine[1].lng, geometry.gateLine[1].lat]
              ]
            }
          }
        ]
      }

      requestAnimationFrame(() => {
        source.setData({ type: 'FeatureCollection', features })
      })
    } catch (error) {
      return
    }
  }

  return {
    setMap,
    initializeLayers,
    updateSegmentLayers,
    updateTempSegment
  }
}
