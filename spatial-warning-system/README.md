# Spatial Warning System

A location-based Progressive Web App (PWA) for emergency alerts and spatial warnings using Vue 3, Vite, and Leaflet.js.

## 🚨 Features

- **Interactive Map**: Real-time visualization of warnings and alerts using Leaflet.js
- **Location-based Services**: Get your current location and view nearby warnings
- **Progressive Web App**: Installable app with offline capabilities
- **Real-time Notifications**: Critical warning alerts with push notifications
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Warning Categories**: Support for multiple warning types (flood, earthquake, tsunami, volcano, storm, fire)
- **Severity Levels**: Color-coded warnings by severity (low, medium, high, critical)
- **Distance Calculation**: Automatic calculation of distance to warnings
- **Offline Support**: Service worker for offline functionality

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Mapping**: Leaflet.js
- **Styling**: CSS3 with modern design patterns
- **PWA**: Service Worker, Web App Manifest
- **TypeScript**: Full type safety
- **Router**: Vue Router

## 📱 PWA Features

- **Installable**: Can be installed on mobile and desktop devices
- **Offline Support**: Caches resources for offline use
- **Push Notifications**: Real-time alerts for critical warnings
- **App-like Experience**: Standalone mode with custom navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spatial-warning-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📋 Project Structure

```
spatial-warning-system/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── components/
│   │   ├── SpatialMap.vue     # Interactive map component
│   │   ├── WarningList.vue    # Warning dashboard
│   │   ├── StatusBar.vue      # Status and notifications
│   │   └── PWAInstaller.vue   # PWA installation prompt
│   ├── stores/
│   │   └── spatial.ts         # Pinia store for state management
│   ├── views/
│   │   └── HomeView.vue       # Main dashboard view
│   ├── App.vue                # Root component
│   └── main.ts                # Application entry point
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies and scripts
```

## 🗺️ Map Features

- **OpenStreetMap Integration**: Free and open-source map tiles
- **Custom Markers**: Different icons for different warning types
- **Warning Radius**: Visual representation of affected areas
- **User Location**: Real-time GPS location tracking
- **Interactive Popups**: Detailed warning information on click

## ⚠️ Warning System

### Warning Types
- 🌊 **Flood**: Water-related emergencies
- 🌋 **Earthquake**: Seismic activity alerts
- 🌊 **Tsunami**: Ocean wave warnings
- 🌋 **Volcano**: Volcanic activity alerts
- ⛈️ **Storm**: Weather-related warnings
- 🔥 **Fire**: Fire and wildfire alerts

### Severity Levels
- 🟢 **Low**: Minor alerts, stay informed
- 🟡 **Medium**: Moderate risk, take precautions
- 🟠 **High**: Significant risk, immediate action may be required
- 🔴 **Critical**: Extreme risk, immediate evacuation or shelter

## 📍 Location Services

- **GPS Integration**: Uses browser's Geolocation API
- **Distance Calculation**: Haversine formula for accurate distance measurement
- **Nearby Warnings**: Automatic detection of warnings in your area
- **Location Privacy**: User consent required for location access

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Spatial Warning System
VITE_APP_DESCRIPTION=Location-based emergency alerts
```

### PWA Configuration

The PWA is configured in `vite.config.ts` with:
- Auto-update registration
- Custom manifest
- Service worker caching
- Offline support

## 📱 Mobile Optimization

- **Touch-friendly Interface**: Optimized for mobile interactions
- **Responsive Design**: Adapts to different screen sizes
- **Mobile-first Approach**: Designed primarily for mobile use
- **PWA Installation**: Easy installation on mobile devices

## 🔒 Privacy & Security

- **Location Consent**: Explicit user permission required
- **Data Privacy**: No personal data stored or transmitted
- **HTTPS Required**: Secure connections for location services
- **Local Storage**: Minimal data stored locally

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e

# Run all tests
npm run test
```

## 📦 Deployment

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Connect your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`

### GitHub Pages
1. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Leaflet](https://leafletjs.com/) - Open-source JavaScript library for mobile-friendly interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) - Free world map
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a demonstration application. For production use in emergency situations, additional testing, validation, and integration with real emergency services APIs would be required.
