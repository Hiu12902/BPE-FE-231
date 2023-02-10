import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import resolve from '@rollup/plugin-node-resolve';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
});
