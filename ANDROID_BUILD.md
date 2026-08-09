# Cardamom Farm — Android / Capacitor

This project keeps the original Figma Make React/Vite application and adds Capacitor configuration for Android.

## Local Android build

Requirements: Node.js 22, Android Studio/Android SDK, and Java 21.

```bash
npm install
npm run build:web
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio, run the app on a connected Android device or use **Build > Generate App Bundles or APKs > Generate APKs**.

For a debug APK from the terminal:

```bash
npm run cap:build
```

## GitHub Actions build (no Android Studio needed on your computer)

The repository includes `.github/workflows/android-apk.yml`. Push the project to GitHub, then open **Actions → Build Cardamom Farm APK → Run workflow**. The generated debug APK is uploaded as a workflow artifact.

## Important: Gemini and market-price APIs

The original Figma Make project uses `/api/gemini/assistant` and `/api/market-price`, which are served by `server.ts`. A Capacitor APK runs the Vite frontend locally and does not automatically run that Express server. Therefore those two API features need a hosted backend (or a future native/local implementation) before they will work inside the standalone APK.

Do not put a Gemini API key directly in the Android frontend. Keep it on a server/backend.
