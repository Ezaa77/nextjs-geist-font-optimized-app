import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Warning {
  id: string
  type: 'flood' | 'earthquake' | 'tsunami' | 'volcano' | 'storm' | 'fire'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  radius: number // in meters
  timestamp: Date
  expiresAt?: Date
  isActive: boolean
}

export interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
  timestamp: Date
}

export const useSpatialStore = defineStore('spatial', () => {
  // State
  const userLocation = ref<UserLocation | null>(null)
  const warnings = ref<Warning[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const mapCenter = ref({ lat: -6.2088, lng: 106.8456 }) // Default to Jakarta
  const mapZoom = ref(10)

  // Getters
  const activeWarnings = computed(() => 
    warnings.value.filter(warning => warning.isActive)
  )

  const nearbyWarnings = computed(() => {
    if (!userLocation.value) return []
    
    return activeWarnings.value.filter(warning => {
      const distance = calculateDistance(
        userLocation.value!.lat,
        userLocation.value!.lng,
        warning.location.lat,
        warning.location.lng
      )
      return distance <= warning.radius
    })
  })

  const criticalWarnings = computed(() =>
    activeWarnings.value.filter(warning => warning.severity === 'critical')
  )

  // Actions
  function setUserLocation(location: UserLocation) {
    userLocation.value = location
  }

  function addWarning(warning: Warning) {
    warnings.value.push(warning)
  }

  function updateWarning(id: string, updates: Partial<Warning>) {
    const index = warnings.value.findIndex(w => w.id === id)
    if (index !== -1) {
      warnings.value[index] = { ...warnings.value[index], ...updates }
    }
  }

  function removeWarning(id: string) {
    const index = warnings.value.findIndex(w => w.id === id)
    if (index !== -1) {
      warnings.value.splice(index, 1)
    }
  }

  function setMapCenter(center: { lat: number; lng: number }) {
    mapCenter.value = center
  }

  function setMapZoom(zoom: number) {
    mapZoom.value = zoom
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  // Utility function to calculate distance between two points
  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Mock data for demonstration
  function loadMockWarnings() {
    const mockWarnings: Warning[] = [
      {
        id: '1',
        type: 'flood',
        severity: 'high',
        title: 'Flood Warning - Jakarta Utara',
        description: 'Heavy rainfall causing flooding in Jakarta Utara area',
        location: { lat: -6.1384, lng: 106.8229 },
        radius: 5000,
        timestamp: new Date(),
        isActive: true
      },
      {
        id: '2',
        type: 'earthquake',
        severity: 'medium',
        title: 'Earthquake Alert - Bandung',
        description: 'Earthquake detected in Bandung area',
        location: { lat: -6.9175, lng: 107.6191 },
        radius: 10000,
        timestamp: new Date(),
        isActive: true
      },
      {
        id: '3',
        type: 'storm',
        severity: 'low',
        title: 'Storm Warning - Surabaya',
        description: 'Thunderstorm approaching Surabaya',
        location: { lat: -7.2575, lng: 112.7521 },
        radius: 3000,
        timestamp: new Date(),
        isActive: true
      }
    ]
    
    warnings.value = mockWarnings
  }

  return {
    // State
    userLocation,
    warnings,
    isLoading,
    error,
    mapCenter,
    mapZoom,
    
    // Getters
    activeWarnings,
    nearbyWarnings,
    criticalWarnings,
    
    // Actions
    setUserLocation,
    addWarning,
    updateWarning,
    removeWarning,
    setMapCenter,
    setMapZoom,
    setLoading,
    setError,
    loadMockWarnings
  }
})