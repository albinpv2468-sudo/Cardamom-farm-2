import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cardamomfarm.app',
  appName: 'Cardamom Farm',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#f7faf7',
  },
};

export default config;
