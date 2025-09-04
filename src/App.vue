<script setup lang="ts">
import { MapboxProvider } from '@/app/providers'
import { MapPage } from '@/pages/map-page'
</script>

<template>
  <MapboxProvider>
    <MapPage />
  </MapboxProvider>
</template>