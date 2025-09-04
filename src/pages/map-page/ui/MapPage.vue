<script setup lang="ts">
import { MapCanvas } from '@/widgets/map-canvas'
import { SegmentPanel } from '@/widgets/segment-panel'
import { HudHints } from '@/widgets/hud-hints'
import CreateButton from '@/features/create-segment/ui/CreateButton.vue'
import './MapPage.scss'
</script>

<template>
  <div class="map-page">
    <MapCanvas />
    <SegmentPanel />
    <HudHints />
    <CreateButton />
  </div>
</template>