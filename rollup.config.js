import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  resolve(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: 'dist',
    include: ['node_modules/@rolster/typescript-types/index.d.ts']
  })
];

const external = [
  '@rolster/helpers-advanced',
  '@rolster/invertly',
  'dotenv',
  'express',
  'reflect-metadata'
];

const rollupTs = (alias) => {
  return {
    input: `dist/esm/${alias}.js`,
    output: [
      {
        file: `dist/cjs/${alias}.js`,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `dist/es/${alias}.js`,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external,
    plugins
  };
};

export default [rollupTs('index'), rollupTs('types/index')];
