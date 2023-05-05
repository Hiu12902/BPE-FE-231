import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import resolve from '@rollup/plugin-node-resolve';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({ devToolsEnabled: true }),
    svgr(),
    resolve({
      extensions: ['.js', '.ts', '.jsx'],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  preview: {
    port: 8080,
  },
});
