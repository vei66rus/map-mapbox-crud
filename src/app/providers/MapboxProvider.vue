<script setup lang="ts">
import { provide } from 'vue'
import mapboxgl from 'mapbox-gl'
import { config } from '@/shared/config/env'

if (config.mapbox.token) {
  mapboxgl.accessToken = config.mapbox.token
  provide('mapbox', mapboxgl)
}
</script>

<template>
  <slot />
</template>
