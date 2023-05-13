import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import resolve from '@rollup/plugin-node-resolve';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({ devToolsEnabled: true }),
    svgr(),
    resolve({
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
      },
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  preview: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      plugins: [
        babel({ babelHelpers: 'bundled' }),
        rollupNodePolyFill(),
        nodeResolve(),
        commonjs(),
      ],
    },
    minify: false,
    sourcemap: true,
  },
});
