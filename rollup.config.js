import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
// import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import globby from 'globby';
import fs from 'fs-extra';

fs.rmdir('./dist', {
  recursive: true,
});

const files = globby.sync(['./src/**/*.{ts,tsx}']).filter((file) => {
  return !file.endsWith('.d.ts') && !file.includes('stories');
});

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: files,
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        plugins: [],
        config: {
          path: './postcss.config.js',
        },
      }),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      terser(),
    ],
    external: [
      'react',
      'react-dom',
      'tailwind-merge',
      '@lexical/react',
      'lexical',
      'react-icons',
    ],
  },
];
