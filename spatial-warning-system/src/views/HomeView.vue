<script setup lang="ts">
import { computed } from 'vue'
import { useSpatialStore } from '@/stores/spatial'
import StatusBar from '@/components/StatusBar.vue'
import SpatialMap from '@/components/SpatialMap.vue'
import WarningList from '@/components/WarningList.vue'
import PWAInstaller from '@/components/PWAInstaller.vue'

const spatialStore = useSpatialStore()

const error = computed(() => spatialStore.error)

const clearError = () => {
  spatialStore.setError(null)
}
</script>

<template>
  <div class="home">
    <div class="app-header">
      <h1 class="app-title">
        <span class="title-icon">🚨</span>
        Spatial Warning System
      </h1>
      <p class="app-subtitle">Location-based emergency alerts and warnings</p>
    </div>

    <StatusBar />

    <div class="main-content">
      <div class="content-grid">
        <!-- Map Section -->
        <div class="map-section">
          <div class="section-header">
            <h2>Interactive Map</h2>
            <p>View warnings and your location on the map</p>
          </div>
          <div class="map-container">
            <SpatialMap />
          </div>
        </div>

        <!-- Warnings Section -->
        <div class="warnings-section">
          <div class="section-header">
            <h2>Warning Dashboard</h2>
            <p>Monitor active alerts and notifications</p>
          </div>
          <div class="warnings-container">
            <WarningList />
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-banner">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">{{ error }}</span>
        <button @click="clearError" class="error-dismiss">×</button>
      </div>
    </div>

    <!-- PWA Installer -->
    <PWAInstaller />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  text-align: center;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.app-title {
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 2.5rem;
  animation: pulse 2s infinite;
}

.app-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.map-section {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.section-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.map-container {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8fafc;
}

.warnings-section {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.warnings-container {
  flex: 1;
  overflow: hidden;
}

.error-banner {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ef4444;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 1.25rem;
}

.error-message {
  font-size: 0.875rem;
  font-weight: 500;
}

.error-dismiss {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.error-dismiss:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    height: auto;
    min-height: 800px;
  }

  .map-section,
  .warnings-section {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 16px;
  }

  .app-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 8px;
  }

  .title-icon {
    font-size: 2rem;
  }

  .main-content {
    padding: 16px;
  }

  .content-grid {
    gap: 16px;
  }

  .map-section,
  .warnings-section {
    padding: 16px;
  }

  .section-header h2 {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 12px;
  }

  .app-title {
    font-size: 1.25rem;
  }

  .title-icon {
    font-size: 1.75rem;
  }

  .main-content {
    padding: 12px;
  }

  .content-grid {
    gap: 12px;
  }

  .map-section,
  .warnings-section {
    padding: 12px;
  }
}
</style>
