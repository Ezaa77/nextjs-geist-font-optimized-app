<template>
  <div class="status-bar">
    <div class="status-content">
      <!-- Location Status -->
      <div class="status-item location-status">
        <div class="status-icon">
          <span v-if="userLocation" class="icon-active">📍</span>
          <span v-else class="icon-inactive">📍</span>
        </div>
        <div class="status-text">
          <span class="status-label">Location</span>
          <span v-if="userLocation" class="status-value">
            {{ formatCoordinates(userLocation.lat, userLocation.lng) }}
          </span>
          <span v-else class="status-value inactive">
            Not available
          </span>
        </div>
      </div>

      <!-- Critical Warnings -->
      <div v-if="criticalWarnings.length > 0" class="status-item critical-warnings">
        <div class="status-icon">
          <span class="icon-critical">🚨</span>
        </div>
        <div class="status-text">
          <span class="status-label">Critical Alerts</span>
          <span class="status-value critical">
            {{ criticalWarnings.length }} active
          </span>
        </div>
      </div>

      <!-- Nearby Warnings -->
      <div v-if="nearbyWarnings.length > 0" class="status-item nearby-warnings">
        <div class="status-icon">
          <span class="icon-nearby">⚠️</span>
        </div>
        <div class="status-text">
          <span class="status-label">Nearby Warnings</span>
          <span class="status-value nearby">
            {{ nearbyWarnings.length }} in your area
          </span>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="status-item connection-status">
        <div class="status-icon">
          <span v-if="isOnline" class="icon-active">📡</span>
          <span v-else class="icon-inactive">📡</span>
        </div>
        <div class="status-text">
          <span class="status-label">Connection</span>
          <span :class="['status-value', { active: isOnline, inactive: !isOnline }]">
            {{ isOnline ? 'Online' : 'Offline' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Critical Warning Alert -->
    <div v-if="showCriticalAlert" class="critical-alert">
      <div class="alert-content">
        <div class="alert-icon">🚨</div>
        <div class="alert-text">
          <strong>Critical Warning!</strong>
          {{ criticalWarnings.length }} critical alert{{ criticalWarnings.length > 1 ? 's' : '' }} in your area
        </div>
        <button @click="dismissAlert" class="alert-dismiss">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSpatialStore } from '@/stores/spatial'

const spatialStore = useSpatialStore()

const isOnline = ref(navigator.onLine)
const showCriticalAlert = ref(false)

// Computed properties
const userLocation = computed(() => spatialStore.userLocation)
const criticalWarnings = computed(() => spatialStore.criticalWarnings)
const nearbyWarnings = computed(() => spatialStore.nearbyWarnings)

// Format coordinates for display
const formatCoordinates = (lat: number, lng: number) => {
  const latStr = Math.abs(lat).toFixed(4) + (lat >= 0 ? 'N' : 'S')
  const lngStr = Math.abs(lng).toFixed(4) + (lng >= 0 ? 'E' : 'W')
  return `${latStr}, ${lngStr}`
}

// Dismiss critical alert
const dismissAlert = () => {
  showCriticalAlert.value = false
}

// Show critical alert when critical warnings are detected
const checkCriticalWarnings = () => {
  if (criticalWarnings.value.length > 0 && !showCriticalAlert.value) {
    showCriticalAlert.value = true
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      showCriticalAlert.value = false
    }, 10000)
  }
}

// Watch for critical warnings
const unwatchCritical = computed(() => {
  checkCriticalWarnings()
})

// Network status listeners
const handleOnline = () => {
  isOnline.value = true
}

const handleOffline = () => {
  isOnline.value = false
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Check for critical warnings on mount
  checkCriticalWarnings()
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.status-bar {
  position: relative;
  background-color: #1e293b;
  color: white;
  padding: 12px 20px;
  border-radius: 0 0 12px 12px;
}

.status-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.status-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.status-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.status-label {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.status-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-value.active {
  color: #10b981;
}

.status-value.inactive {
  color: #64748b;
}

.status-value.critical {
  color: #fca5a5;
}

.status-value.nearby {
  color: #fbbf24;
}

.icon-active {
  opacity: 1;
}

.icon-inactive {
  opacity: 0.5;
}

.icon-critical {
  animation: pulse 2s infinite;
}

.icon-nearby {
  animation: bounce 1s infinite;
}

.critical-alert {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #dc2626;
  color: white;
  padding: 12px 20px;
  border-radius: 0 0 12px 12px;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-dismiss {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.alert-dismiss:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .status-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .status-item {
    justify-content: space-between;
  }

  .status-text {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .status-label {
    font-size: 0.875rem;
  }

  .status-value {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .status-bar {
    padding: 8px 12px;
  }

  .status-content {
    gap: 8px;
  }

  .status-item {
    gap: 6px;
  }

  .status-icon {
    font-size: 1rem;
  }
}
</style>