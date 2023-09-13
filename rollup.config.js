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

function createConfig(alias) {
  const finalPath = alias ? `${alias}/` : '';

  return {
    input: `dist/esm/${finalPath}index.js`,
    output: [
      {
        file: `dist/es/${finalPath}index.js`,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `dist/cjs/${finalPath}index.js`,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external,
    plugins
  };
}

export default [createConfig(''), createConfig('types')];
