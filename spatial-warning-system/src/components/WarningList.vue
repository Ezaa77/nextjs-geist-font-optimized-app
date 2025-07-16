<template>
  <div class="warning-list">
    <div class="warning-header">
      <h2>Active Warnings</h2>
      <div class="warning-filters">
        <select v-model="selectedType" class="filter-select">
          <option value="">All Types</option>
          <option value="flood">Flood</option>
          <option value="earthquake">Earthquake</option>
          <option value="tsunami">Tsunami</option>
          <option value="volcano">Volcano</option>
          <option value="storm">Storm</option>
          <option value="fire">Fire</option>
        </select>
        <select v-model="selectedSeverity" class="filter-select">
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <div class="warning-stats">
      <div class="stat-item">
        <span class="stat-number">{{ filteredWarnings.length }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-number critical">{{ criticalCount }}</span>
        <span class="stat-label">Critical</span>
      </div>
      <div class="stat-item">
        <span class="stat-number nearby">{{ nearbyCount }}</span>
        <span class="stat-label">Nearby</span>
      </div>
    </div>

    <div v-if="filteredWarnings.length === 0" class="no-warnings">
      <div class="no-warnings-icon">📋</div>
      <p>No warnings match your filters</p>
    </div>

    <div v-else class="warnings-container">
      <div
        v-for="warning in filteredWarnings"
        :key="warning.id"
        class="warning-card"
        :class="[
          `warning-${warning.severity}`,
          { 'warning-nearby': isNearby(warning) }
        ]"
        @click="selectWarning(warning)"
      >
        <div class="warning-icon">
          {{ getWarningSymbol(warning.type) }}
        </div>
        <div class="warning-content">
          <h3 class="warning-title">{{ warning.title }}</h3>
          <p class="warning-description">{{ warning.description }}</p>
          <div class="warning-meta">
            <span class="warning-type">{{ warning.type }}</span>
            <span class="warning-severity" :class="`severity-${warning.severity}`">
              {{ warning.severity }}
            </span>
            <span class="warning-time">
              {{ formatTime(warning.timestamp) }}
            </span>
          </div>
          <div v-if="isNearby(warning)" class="warning-distance">
            <span class="distance-badge">📍 Nearby</span>
            <span class="distance-text">
              {{ formatDistance(warning) }} away
            </span>
          </div>
        </div>
        <div class="warning-actions">
          <button @click.stop="viewOnMap(warning)" class="action-btn">
            🗺️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSpatialStore } from '@/stores/spatial'
import type { Warning } from '@/stores/spatial'

const spatialStore = useSpatialStore()

const selectedType = ref('')
const selectedSeverity = ref('')

// Filtered warnings based on selected filters
const filteredWarnings = computed(() => {
  let warnings = spatialStore.activeWarnings

  if (selectedType.value) {
    warnings = warnings.filter(w => w.type === selectedType.value)
  }

  if (selectedSeverity.value) {
    warnings = warnings.filter(w => w.severity === selectedSeverity.value)
  }

  return warnings.sort((a, b) => {
    // Sort by severity (critical first)
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
    if (severityDiff !== 0) return severityDiff

    // Then by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

// Statistics
const criticalCount = computed(() => 
  spatialStore.criticalWarnings.length
)

const nearbyCount = computed(() => 
  spatialStore.nearbyWarnings.length
)

// Check if warning is nearby user
const isNearby = (warning: Warning) => {
  return spatialStore.nearbyWarnings.some(w => w.id === warning.id)
}

// Get warning symbol
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

// Format timestamp
const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Calculate and format distance
const formatDistance = (warning: Warning) => {
  if (!spatialStore.userLocation) return 'Unknown'

  const distance = calculateDistance(
    spatialStore.userLocation.lat,
    spatialStore.userLocation.lng,
    warning.location.lat,
    warning.location.lng
  )

  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    return `${(distance / 1000).toFixed(1)}km`
  }
}

// Calculate distance between two points
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
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

// Actions
const selectWarning = (warning: Warning) => {
  // Emit event or handle warning selection
  console.log('Selected warning:', warning)
}

const viewOnMap = (warning: Warning) => {
  // Center map on warning location
  spatialStore.setMapCenter(warning.location)
  spatialStore.setMapZoom(12)
}
</script>

<style scoped>
.warning-list {
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  height: 100%;
  overflow-y: auto;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.warning-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.warning-filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  color: #374151;
}

.warning-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-number.critical {
  color: #dc2626;
}

.stat-number.nearby {
  color: #059669;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.no-warnings {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-warnings-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.warnings-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid #d1d5db;
}

.warning-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.warning-card.warning-critical {
  border-left-color: #dc2626;
}

.warning-card.warning-high {
  border-left-color: #ef4444;
}

.warning-card.warning-medium {
  border-left-color: #f59e0b;
}

.warning-card.warning-low {
  border-left-color: #10b981;
}

.warning-card.warning-nearby {
  background-color: #fef3c7;
  border-color: #f59e0b;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
  min-width: 0;
}

.warning-title {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.warning-description {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.warning-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.warning-type {
  background-color: #f3f4f6;
  color: #374151;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.warning-severity {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.severity-critical {
  background-color: #fef2f2;
  color: #dc2626;
}

.severity-high {
  background-color: #fef2f2;
  color: #ef4444;
}

.severity-medium {
  background-color: #fffbeb;
  color: #f59e0b;
}

.severity-low {
  background-color: #f0fdf4;
  color: #10b981;
}

.warning-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.warning-distance {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.distance-badge {
  background-color: #f59e0b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.distance-text {
  color: #6b7280;
  font-size: 0.75rem;
}

.warning-actions {
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #f3f4f6;
}

@media (max-width: 768px) {
  .warning-header {
    flex-direction: column;
    align-items: stretch;
  }

  .warning-filters {
    justify-content: center;
  }

  .warning-stats {
    justify-content: space-around;
  }

  .warning-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>