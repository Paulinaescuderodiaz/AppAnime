import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nekorate.app',
  appName: 'Neko Rate',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;

