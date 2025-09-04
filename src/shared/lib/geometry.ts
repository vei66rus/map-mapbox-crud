import { point } from '@turf/turf'
import bearing from '@turf/bearing'
import distance from '@turf/distance'
import destination from '@turf/destination'
import type { GeoPoint, SegmentParams, SegmentGeometry } from '@/shared/types'

export const computeBearing = (from: GeoPoint, to: GeoPoint): number => {
  const fromPoint = point([from.lng, from.lat])
  const toPoint = point([to.lng, to.lat])
  return bearing(fromPoint, toPoint)
}

export const computeDistance = (from: GeoPoint, to: GeoPoint): number => {
  const fromPoint = point([from.lng, from.lat])
  const toPoint = point([to.lng, to.lat])
  return distance(fromPoint, toPoint, { units: 'meters' })
}

export const computeDestination = (from: GeoPoint, bearing: number, distance: number): GeoPoint => {
  const fromPoint = point([from.lng, from.lat])
  const dest = destination(fromPoint, distance / 1000, bearing, { units: 'kilometers' })
  const coords = dest.geometry.coordinates
  return { lat: coords[1], lng: coords[0] }
}

export const computeSegmentGeometry = (params: SegmentParams): SegmentGeometry => {
  const { startPoint, azimuth, distance: segmentDistance, gateAngle } = params
  
  const endPoint = computeDestination(startPoint, azimuth, segmentDistance)
  
  let gatePoint: GeoPoint
  if (gateAngle === 0) {
    gatePoint = endPoint
  } else {
    gatePoint = computeDestination(startPoint, azimuth + 180 + gateAngle, segmentDistance)
  }
  
  return {
    azimuthLine: [startPoint, endPoint],
    gateLine: [startPoint, gatePoint],
    points: [startPoint, endPoint, gatePoint]
  }
}

export const computeSegmentFromPoints = (start: GeoPoint, end: GeoPoint, gateAngle: number = 45): SegmentParams => {
  const azimuth = computeBearing(start, end)
  const distance = computeDistance(start, end)
  
  return {
    startPoint: start,
    azimuth,
    distance,
    gateAngle
  }
}

export const computeSegmentFromParams = (
  startPoint: GeoPoint, 
  azimuth: number, 
  distance: number, 
  gateAngle: number = 45
): SegmentParams => {
  return {
    startPoint,
    azimuth,
    distance,
    gateAngle
  }
}
