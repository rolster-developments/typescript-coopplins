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

function configuration(alias) {
  const filename = alias ? `${alias}/index.js` : 'index.js';

  return {
    external,
    plugins,
    input: `dist/esm/${filename}`,
    output: [
      {
        file: `dist/es/${filename}`,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `dist/cjs/${filename}`,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ]
  };
}

export default [configuration(''), configuration('types')];
