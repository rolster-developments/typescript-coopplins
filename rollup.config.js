import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: 'dist',
    include: ['node_modules/@rolster/typescript-types/index.d.ts']
  })
];

const external = [
  '@rolster/typescript-invertly',
  '@rolster/typescript-utils',
  'dotenv',
  'express',
  'express-validator',
  'reflect-metadata'
];

export default [
  {
    input: 'dist/esm/index.js',
    output: [
      {
        file: 'dist/es/index.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external,
    plugins
  },
  {
    input: 'dist/esm/types/index.js',
    output: [
      {
        file: 'dist/es/types/index.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: 'dist/cjs/types/index.js',
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external,
    plugins
  }
];
