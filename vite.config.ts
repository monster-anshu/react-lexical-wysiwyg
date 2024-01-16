import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        '@lexical/react',
        'lexical',
        'react-icons',
        'tailwind-merge',
      ],
    },
  },
});
