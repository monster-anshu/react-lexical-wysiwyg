import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import globby from 'globby';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import multi from '@rollup/plugin-multi-entry';
import packageJson from './package.json' assert { type: 'json' };

const commonPlugins = [
  typescript({
    tsconfig: './tsconfig.build.json',
  }),
  commonjs(),
  postcss({
    plugins: [],
    config: {
      path: './postcss.config.js',
    },
    extract: 'style.css',
  }),
  multi(),
  resolve(),
  replace({
    preventAssignment: true,
  }),
];

const files = globby
  .sync(['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.d.ts'])
  .filter((item) => !item.includes('stories'));

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: files,
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      manualChunks: {
        vendor: ['node_modules/**/*'],
      },
    },
  ],
  plugins: commonPlugins,
  external: [
    /node_modules/,
    ...Object.keys(packageJson.peerDependencies || {}),
    ...Object.keys(packageJson.dependencies || {}),
  ],
};
