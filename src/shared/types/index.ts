export interface GeoPoint {
  lat: number
  lng: number
}

export interface SegmentParams {
  startPoint: GeoPoint
  azimuth: number
  distance: number
  gateAngle: number
}

export interface SegmentGeometry {
  azimuthLine: [GeoPoint, GeoPoint]
  gateLine: [GeoPoint, GeoPoint]
  points: GeoPoint[]
}

export interface Segment {
  id: string
  name: string
  params: SegmentParams
  color: string
  visible: boolean
  created: Date
  updated: Date
}

export interface CreateSegmentPayload {
  name: string
  params: SegmentParams
  color?: string
}

export interface UpdateSegmentPayload {
  id: string
  updates: Partial<Omit<Segment, 'id' | 'created' | 'updated'>>
}

export interface SegmentState {
  segments: Segment[]
  activeSegment: Segment | null
  isCreating: boolean
  isEditing: boolean
  tempStart: GeoPoint | null
  mousePosition: GeoPoint | null
  creationMode: 'draw' | 'points' | 'params'
  tempAzimuth: number
  tempDistance: number
  tempGateAngle: number
  isThrottling: boolean
}

export interface MapLayer {
  id: string
  type: 'line' | 'circle'
  source: string
  filter?: any[]
  paint: Record<string, any>
}

export interface MapSource {
  id: string
  type: 'geojson'
  data: any
}
