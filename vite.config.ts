import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        // Registro do SW é feito manualmente em main.tsx (para checar
        // atualizações periodicamente e ao voltar o foco), em vez do script
        // auto-injetado padrão
        injectRegister: false,
        includeAssets: ['apple-touch-icon.png'],
        manifest: {
          name: 'Amorimpec • Resenha Equina',
          short_name: 'Amorimpec',
          description: 'Ficha de Resenha Zootécnica e Gráfica de Equinos, Asininos e Muares nos padrões rurais brasileiros, com geração de laudo em PDF.',
          lang: 'pt-BR',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#FAF8F5',
          theme_color: '#1B5E20',
          icons: [
            { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // Assets grandes (fotos do manual) precisam de um limite maior que o
          // padrao (2 MiB) para entrarem no cache do App Shell
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          // As pranchas são carregadas somente quando o leitor abre a cartilha.
          // Evita baixar ~30 MB ao instalar o app pela primeira vez.
          globIgnores: ['**/manual-gerado/**'],
          runtimeCaching: [{
            urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/manual-gerado/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'manual-ilustrado',
              expiration: { maxEntries: 32, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          }],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
