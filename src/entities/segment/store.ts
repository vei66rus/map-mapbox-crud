import { defineStore } from 'pinia'
import { computeSegmentFromPoints, computeSegmentFromParams } from './lib/compute'
import { useColors } from '@/shared/composables'
import type { SegmentState, Segment, CreateSegmentPayload, UpdateSegmentPayload } from '@/shared/types'
import type { GeoPoint } from '@/shared/types'

export const useSegmentStore = defineStore('segment', {
  state: (): SegmentState => ({
    segments: [],
    activeSegment: null,
    isCreating: false,
    isEditing: false,
    tempStart: null,
    mousePosition: null,
    creationMode: 'draw',
    tempAzimuth: 0,
    tempDistance: 1000,
    tempGateAngle: 0,
    isThrottling: false
  }),

  getters: {
    activeSegmentId: (state) => state.activeSegment?.id || null,
    visibleSegments: (state) => state.segments.filter(s => s.visible)
  },

  actions: {
    createSegment(payload: CreateSegmentPayload): Segment {
      const { getNextColor } = useColors()
      const segment: Segment = {
        id: Date.now().toString(),
        name: payload.name,
        params: payload.params,
        color: payload.color || getNextColor(),
        visible: true,
        created: new Date(),
        updated: new Date()
      }
      this.segments.push(segment)
      return segment
    },

    createSegmentFromPoints(start: GeoPoint, end: GeoPoint): void {
      const gateAngle = 0
      
      const params = computeSegmentFromPoints(start, end, gateAngle)
      const segment = this.createSegment({
        name: `Сегмент ${this.segments.length}`,
        params
      })
      
      this.setActiveSegment(segment.id)
      this.setEditing(true)
      
      this.completeCreation()
    },

    createSegmentFromParams(startPoint: GeoPoint): void {
      const params = computeSegmentFromParams(
        startPoint, 
        this.tempAzimuth, 
        this.tempDistance, 
        this.tempGateAngle
      )
      
      const segment = this.createSegment({
        name: `Сегмент ${this.segments.length}`,
        params
      })
      
      this.setActiveSegment(segment.id)
      this.setEditing(true)
      
      this.completeCreation()
    },

    setStartPoint(point: GeoPoint): void {
      this.tempStart = point
    },

    updateSegment(payload: UpdateSegmentPayload): void {
      const index = this.segments.findIndex(s => s.id === payload.id)
      if (index >= 0) {
        this.segments[index] = {
          ...this.segments[index],
          ...payload.updates,
          updated: new Date()
        }
      }
    },

    deleteSegment(id: string): void {
      const index = this.segments.findIndex(s => s.id === id)
      if (index >= 0) {
        this.segments.splice(index, 1)
        if (this.activeSegment?.id === id) {
          this.activeSegment = null
        }
      }
    },

    setActiveSegment(id: string | null): void {
      this.activeSegment = id ? this.segments.find(s => s.id === id) || null : null
    },

    setEditing(editing: boolean): void {
      this.isEditing = editing
    },

    startCreation(): void {
      this.isCreating = true
      this.tempStart = null
      this.mousePosition = null
      this.creationMode = 'draw'
    },

    startCreationWithParams(): void {
      this.isCreating = true
      this.tempStart = null
      this.mousePosition = null
      this.creationMode = 'params'
    },

    setTempStart(point: GeoPoint): void {
      this.tempStart = point
    },

    setMousePosition(point: GeoPoint | null): void {
      this.mousePosition = point
    },

    setTempAzimuth(azimuth: number): void {
      this.tempAzimuth = azimuth
    },

    setTempDistance(distance: number): void {
      this.tempDistance = distance
    },

    setTempGateAngle(angle: number): void {
      this.tempGateAngle = angle
    },

    setThrottling(throttling: boolean): void {
      this.isThrottling = throttling
    },

    cancelCreation(): void {
      this.isCreating = false
      this.tempStart = null
      this.mousePosition = null
      this.creationMode = 'draw'
    },

    completeCreation(): void {
      this.isCreating = false
      this.tempStart = null
      this.mousePosition = null
      this.creationMode = 'draw'
    },

    toggleSegmentVisibility(id: string): void {
      const segment = this.segments.find(s => s.id === id)
      if (segment) {
        segment.visible = !segment.visible
      }
    }
  }
})