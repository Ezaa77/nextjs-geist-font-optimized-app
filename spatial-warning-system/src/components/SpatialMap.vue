<template>
  <div class="spatial-map-container">
    <div id="map" ref="mapContainer" class="map"></div>
    <div class="map-controls">
      <button @click="getCurrentLocation" class="location-btn" :disabled="isLoading">
        <span v-if="isLoading">Loading...</span>
        <span v-else>📍 My Location</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import { useSpatialStore } from '@/stores/spatial'
import type { Warning } from '@/stores/spatial'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

const spatialStore = useSpatialStore()
const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
let userMarker: L.Marker | null = null
let warningMarkers: L.Marker[] = []

const isLoading = ref(false)

// Initialize map
const initMap = () => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView(
    [spatialStore.mapCenter.lat, spatialStore.mapCenter.lng],
    spatialStore.mapZoom
  )

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Add map event listeners
  map.on('moveend', () => {
    if (map) {
      spatialStore.setMapCenter({
        lat: map.getCenter().lat,
        lng: map.getCenter().lng
      })
      spatialStore.setMapZoom(map.getZoom())
    }
  })
}

// Add user location marker
const addUserMarker = (lat: number, lng: number) => {
  if (!map) return

  // Remove existing user marker
  if (userMarker) {
    map.removeLayer(userMarker)
  }

  // Create custom user marker icon
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })

  userMarker = L.marker([lat, lng], { icon: userIcon })
    .addTo(map)
    .bindPopup('Your Location')
}

// Add warning markers
const addWarningMarkers = (warnings: Warning[]) => {
  if (!map) return

  // Clear existing warning markers
  warningMarkers.forEach(marker => map?.removeLayer(marker))
  warningMarkers = []

  warnings.forEach(warning => {
    const icon = getWarningIcon(warning.type, warning.severity)
    
    const marker = L.marker([warning.location.lat, warning.location.lng], { icon })
      .addTo(map!)
      .bindPopup(createWarningPopup(warning))

    // Add circle for warning radius
    const circle = L.circle([warning.location.lat, warning.location.lng], {
      color: getWarningColor(warning.severity),
      fillColor: getWarningColor(warning.severity),
      fillOpacity: 0.2,
      radius: warning.radius
    }).addTo(map!)

    warningMarkers.push(marker)
  })
}

// Get warning icon based on type and severity
const getWarningIcon = (type: string, severity: string) => {
  const size = severity === 'critical' ? 32 : severity === 'high' ? 28 : 24
  const color = getWarningColor(severity)
  
  return L.divIcon({
    className: 'warning-marker',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${getWarningSymbol(type)}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}

// Get warning symbol based on type
const getWarningSymbol = (type: string) => {
  const symbols: Record<string, string> = {
    flood: '🌊',
    earthquake: '🌋',
    tsunami: '🌊',
    volcano: '🌋',
    storm: '⛈️',
    fire: '🔥'
  }
  return symbols[type] || '⚠️'
}

// Get warning color based on severity
const getWarningColor = (severity: string) => {
  const colors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#7c2d12'
  }
  return colors[severity] || '#6b7280'
}

// Create warning popup content
const createWarningPopup = (warning: Warning) => {
  return `
    <div class="warning-popup">
      <h3 style="margin: 0 0 8px 0; color: ${getWarningColor(warning.severity)};">
        ${warning.title}
      </h3>
      <p style="margin: 0 0 8px 0; font-size: 14px;">
        ${warning.description}
      </p>
      <div style="font-size: 12px; color: #6b7280;">
        <strong>Type:</strong> ${warning.type}<br>
        <strong>Severity:</strong> ${warning.severity}<br>
        <strong>Radius:</strong> ${(warning.radius / 1000).toFixed(1)} km<br>
        <strong>Time:</strong> ${warning.timestamp.toLocaleString()}
      </div>
    </div>
  `
}

// Get current location
const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    spatialStore.setError('Geolocation is not supported by this browser')
    return
  }

  isLoading.value = true
  spatialStore.setError(null)

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })

    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp)
    }

    spatialStore.setUserLocation(location)
    addUserMarker(location.lat, location.lng)

    // Center map on user location
    if (map) {
      map.setView([location.lat, location.lng], 15)
    }

  } catch (error) {
    spatialStore.setError('Unable to get your location')
    console.error('Geolocation error:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for changes in warnings
watch(() => spatialStore.activeWarnings, (warnings) => {
  addWarningMarkers(warnings)
}, { deep: true })

// Watch for changes in user location
watch(() => spatialStore.userLocation, (location) => {
  if (location) {
    addUserMarker(location.lat, location.lng)
  }
})

onMounted(() => {
  initMap()
  spatialStore.loadMockWarnings()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.spatial-map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.location-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.location-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.location-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

:deep(.warning-popup) {
  min-width: 200px;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.leaflet-popup-tip) {
  background-color: white;
}
</style>