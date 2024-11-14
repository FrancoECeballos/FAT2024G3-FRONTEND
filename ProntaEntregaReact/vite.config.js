import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    outDir: 'build',  // Aquí se configura el directorio de salida para la compilación
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pronta Entrega',
        short_name: 'PE',
        description: 'Aplicación de Pronta Entrega',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/prontalogo_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/prontalogo_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
