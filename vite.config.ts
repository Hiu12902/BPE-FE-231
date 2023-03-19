import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
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
});
