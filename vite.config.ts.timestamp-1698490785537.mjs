// vite.config.ts
import { defineConfig } from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/vite/dist/node/index.js";
import preact from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import resolve from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/@rollup/plugin-node-resolve/dist/es/index.js";
import svgr from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/vite-plugin-svgr/dist/index.mjs";
import * as path from "path";
import rollupNodePolyFill from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/rollup-plugin-node-polyfills/dist/index.js";
import { NodeGlobalsPolyfillPlugin } from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import { NodeModulesPolyfillPlugin } from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/@esbuild-plugins/node-modules-polyfill/dist/index.js";
import commonjs from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
import nodeResolve from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/rollup-plugin-node-resolve/dist/rollup-plugin-node-resolve.cjs.js";
import { babel } from "file:///C:/Users/levan/OneDrive/Documents/GitHub/BPE-FE-231/node_modules/@rollup/plugin-babel/dist/es/index.js";
var __vite_injected_original_dirname = "C:\\Users\\levan\\OneDrive\\Documents\\GitHub\\BPE-FE-231";
var vite_config_default = defineConfig({
  plugins: [
    preact({ devToolsEnabled: true }),
    svgr(),
    resolve({
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".ts": "tsx"
      },
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__vite_injected_original_dirname, "src") }]
  },
  preview: {
    port: 8080
  },
  build: {
    rollupOptions: {
      plugins: [
        babel({ babelHelpers: "bundled" }),
        rollupNodePolyFill(),
        nodeResolve(),
        commonjs()
      ]
    },
    minify: false,
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsZXZhblxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXEJQRS1GRS0yMzFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGxldmFuXFxcXE9uZURyaXZlXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcQlBFLUZFLTIzMVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbGV2YW4vT25lRHJpdmUvRG9jdW1lbnRzL0dpdEh1Yi9CUEUtRkUtMjMxL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBwcmVhY3QgZnJvbSAnQHByZWFjdC9wcmVzZXQtdml0ZSc7XHJcbmltcG9ydCByZXNvbHZlIGZyb20gJ0Byb2xsdXAvcGx1Z2luLW5vZGUtcmVzb2x2ZSc7XHJcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgcm9sbHVwTm9kZVBvbHlGaWxsIGZyb20gJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnO1xyXG5pbXBvcnQgeyBOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luIH0gZnJvbSAnQGVzYnVpbGQtcGx1Z2lucy9ub2RlLWdsb2JhbHMtcG9seWZpbGwnO1xyXG5pbXBvcnQgeyBOb2RlTW9kdWxlc1BvbHlmaWxsUGx1Z2luIH0gZnJvbSAnQGVzYnVpbGQtcGx1Z2lucy9ub2RlLW1vZHVsZXMtcG9seWZpbGwnO1xyXG5pbXBvcnQgY29tbW9uanMgZnJvbSAnQHJvbGx1cC9wbHVnaW4tY29tbW9uanMnO1xyXG5pbXBvcnQgbm9kZVJlc29sdmUgZnJvbSAncm9sbHVwLXBsdWdpbi1ub2RlLXJlc29sdmUnO1xyXG5pbXBvcnQgeyBiYWJlbCB9IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWJhYmVsJztcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICBwcmVhY3QoeyBkZXZUb29sc0VuYWJsZWQ6IHRydWUgfSksXHJcbiAgICBzdmdyKCksXHJcbiAgICByZXNvbHZlKHtcclxuICAgICAgZXh0ZW5zaW9uczogWycuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbiddLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGVzYnVpbGRPcHRpb25zOiB7XHJcbiAgICAgIGxvYWRlcjoge1xyXG4gICAgICAgICcuanMnOiAnanN4JyxcclxuICAgICAgICAnLnRzJzogJ3RzeCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIE5vZGUuanMgZ2xvYmFsIHRvIGJyb3dzZXIgZ2xvYmFsVGhpc1xyXG4gICAgICBkZWZpbmU6IHtcclxuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcclxuICAgICAgfSxcclxuICAgICAgLy8gRW5hYmxlIGVzYnVpbGQgcG9seWZpbGwgcGx1Z2luc1xyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgTm9kZUdsb2JhbHNQb2x5ZmlsbFBsdWdpbih7XHJcbiAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxyXG4gICAgICAgICAgYnVmZmVyOiB0cnVlLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIE5vZGVNb2R1bGVzUG9seWZpbGxQbHVnaW4oKSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczogW3sgZmluZDogJ0AnLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpIH1dLFxyXG4gIH0sXHJcbiAgcHJldmlldzoge1xyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBiYWJlbCh7IGJhYmVsSGVscGVyczogJ2J1bmRsZWQnIH0pLFxyXG4gICAgICAgIHJvbGx1cE5vZGVQb2x5RmlsbCgpLFxyXG4gICAgICAgIG5vZGVSZXNvbHZlKCksXHJcbiAgICAgICAgY29tbW9uanMoKSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlWLFNBQVMsb0JBQW9CO0FBQ3RYLE9BQU8sWUFBWTtBQUNuQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVO0FBQ2pCLFlBQVksVUFBVTtBQUN0QixPQUFPLHdCQUF3QjtBQUMvQixTQUFTLGlDQUFpQztBQUMxQyxTQUFTLGlDQUFpQztBQUMxQyxPQUFPLGNBQWM7QUFDckIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxhQUFhO0FBVnRCLElBQU0sbUNBQW1DO0FBWXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU8sRUFBRSxpQkFBaUIsS0FBSyxDQUFDO0FBQUEsSUFDaEMsS0FBSztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sWUFBWSxDQUFDLE9BQU8sT0FBTyxRQUFRLFFBQVEsT0FBTztBQUFBLElBQ3BELENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxRQUNQLE9BQU87QUFBQSxNQUNUO0FBQUE7QUFBQSxNQUVBLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFNBQVM7QUFBQSxRQUNQLDBCQUEwQjtBQUFBLFVBQ3hCLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWLENBQUM7QUFBQSxRQUNELDBCQUEwQjtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxhQUFrQixhQUFRLGtDQUFXLEtBQUssRUFBRSxDQUFDO0FBQUEsRUFDcEU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUCxNQUFNLEVBQUUsY0FBYyxVQUFVLENBQUM7QUFBQSxRQUNqQyxtQkFBbUI7QUFBQSxRQUNuQixZQUFZO0FBQUEsUUFDWixTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
