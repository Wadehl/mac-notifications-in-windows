import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
      },
    ]),
    vitePluginForArco({
      style: 'css',
    }),
    renderer({
      resolve: {
        got: { type: 'esm' },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
      },
      javascriptEnabled: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
