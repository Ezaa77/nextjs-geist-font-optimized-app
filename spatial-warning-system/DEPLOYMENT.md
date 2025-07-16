# Deployment Guide

This guide explains how to deploy the Spatial Warning System to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. **Built the application**:
   ```bash
   npm run build
   ```

2. **Generated PWA assets**:
   - `dist/` directory with all built files
   - `dist/manifest.webmanifest` for PWA configuration
   - `dist/sw.js` for service worker

## Deployment Options

### 1. Netlify (Recommended)

**Automatic Deployment:**
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (or higher)

**Manual Deployment:**
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### 2. Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Or connect your repository to Vercel dashboard

### 3. GitHub Pages

1. Add deployment script to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Set public directory to `dist`

4. Deploy:
   ```bash
   firebase deploy
   ```

### 5. AWS S3 + CloudFront

1. Upload `dist/` contents to S3 bucket
2. Configure CloudFront distribution
3. Set up custom domain (optional)

## PWA Configuration

### HTTPS Requirement

PWA features require HTTPS. Ensure your hosting provider supports SSL certificates.

### Service Worker

The service worker is automatically generated during build. It provides:
- Offline caching
- Push notifications
- Background sync

### Manifest File

The web app manifest (`manifest.webmanifest`) includes:
- App name and description
- Icons for different sizes
- Theme colors
- Display mode settings

## Environment Variables

For production deployment, set these environment variables:

```env
VITE_APP_TITLE=Spatial Warning System
VITE_APP_DESCRIPTION=Location-based emergency alerts
VITE_MAP_DEFAULT_LAT=-6.2088
VITE_MAP_DEFAULT_LNG=106.8456
VITE_MAP_DEFAULT_ZOOM=10
```

## Performance Optimization

### Build Optimization

The build process automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Generates service worker
- Creates PWA manifest

### Caching Strategy

The service worker implements:
- Cache-first for static assets
- Network-first for API calls
- Background sync for offline actions

## Monitoring

### Analytics

Consider adding analytics to track:
- User engagement
- Warning interactions
- Location usage
- PWA installations

### Error Tracking

Implement error tracking for:
- JavaScript errors
- API failures
- Geolocation issues
- PWA installation problems

## Security Considerations

### Content Security Policy

Add CSP headers to prevent XSS attacks:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;
```

### HTTPS Headers

Set security headers:
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Troubleshooting

### Common Issues

1. **PWA not installing**:
   - Check HTTPS requirement
   - Verify manifest file
   - Ensure service worker is registered

2. **Map not loading**:
   - Check network connectivity
   - Verify OpenStreetMap access
   - Check CORS settings

3. **Location not working**:
   - Ensure HTTPS
   - Check browser permissions
   - Verify Geolocation API support

### Debug Mode

Enable debug mode by setting:
```env
VITE_DEV_MODE=true
```

## Support

For deployment issues:
1. Check the browser console for errors
2. Verify all build files are present
3. Test PWA installation
4. Validate service worker registration

## Next Steps

After deployment:
1. Test all PWA features
2. Verify offline functionality
3. Check mobile responsiveness
4. Monitor performance metrics
5. Set up monitoring and analytics