import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const plugins = [
  commonjs(),
  resolve(),
  typescript({
    tsconfig: './tsconfig.app.json',
    declaration: true,
    declarationDir: 'dist',
    include: ['node_modules/@rolster/typescript-types/index.d.ts']
  })
];

const rollupTs = (file) => {
  return {
    input: `dist/esm/${file}.js`,
    output: [
      {
        file: `dist/cjs/${file}.js`,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `dist/es/${file}.js`,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external: [
      '@rolster/helpers-advanced',
      '@rolster/invertly',
      'dotenv',
      'express',
      'reflect-metadata'
    ],
    plugins
  };
};

const exports = ['index', 'types/index'];

export default [...exports.map((file) => rollupTs(file))];
