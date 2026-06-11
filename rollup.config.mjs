import rolster from '@rolster/rollup';

export default rolster({
  requiredEsm: true,
  entryFiles: ['index', 'types'],
  packages: [
    '@rolster/commons',
    '@rolster/invertly',
    '@sentry/node',
    'dotenv',
    'express',
    'express-validator',
    'reflect-metadata'
  ]
});
