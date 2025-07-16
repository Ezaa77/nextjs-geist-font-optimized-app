<template>
  <div v-if="showInstallPrompt" class="pwa-installer">
    <div class="installer-content">
      <div class="installer-icon">📱</div>
      <div class="installer-text">
        <h3>Install Spatial Warning System</h3>
        <p>Get instant access to emergency alerts and warnings</p>
      </div>
      <div class="installer-actions">
        <button @click="installPWA" class="install-btn">
          Install App
        </button>
        <button @click="dismissPrompt" class="dismiss-btn">
          Not Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
let deferredPrompt: any = null

const installPWA = async () => {
  if (!deferredPrompt) return

  // Show the install prompt
  deferredPrompt.prompt()

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
  } else {
    console.log('User dismissed the install prompt')
  }

  // Clear the deferredPrompt
  deferredPrompt = null
  showInstallPrompt.value = false
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  // Store dismissal in localStorage to avoid showing again immediately
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

const checkInstallability = () => {
  // Check if the app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  // Check if user recently dismissed the prompt
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    
    if (now - dismissedTime < oneDay) {
      return
    }
  }

  // Check if the browser supports PWA installation
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    showInstallPrompt.value = true
  }
}

onMounted(() => {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    
    // Stash the event so it can be triggered later
    deferredPrompt = e
    
    // Show our custom install prompt
    checkInstallability()
  })

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    showInstallPrompt.value = false
    deferredPrompt = null
  })

  // Check if we should show the install prompt on page load
  setTimeout(checkInstallability, 3000)
})
</script>

<style scoped>
.pwa-installer {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 20px;
  max-width: 400px;
  width: calc(100% - 40px);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

.installer-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.installer-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.installer-text {
  flex: 1;
  min-width: 0;
}

.installer-text h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.installer-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
}

.installer-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.install-btn {
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.install-btn:hover {
  background-color: #5a67d8;
  transform: translateY(-1px);
}

.dismiss-btn {
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dismiss-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
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

@media (max-width: 480px) {
  .pwa-installer {
    bottom: 10px;
    padding: 16px;
    width: calc(100% - 20px);
  }

  .installer-content {
    gap: 12px;
  }

  .installer-icon {
    font-size: 1.5rem;
  }

  .installer-text h3 {
    font-size: 0.875rem;
  }

  .installer-text p {
    font-size: 0.75rem;
  }

  .installer-actions {
    gap: 6px;
  }

  .install-btn,
  .dismiss-btn {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
}
</style>