import rolster from '@rolster/rollup';

export default rolster({
  entryFiles: ['index', 'types'],
  packages: [
    '@rolster/commons',
    '@rolster/invertly',
    'dotenv',
    'express',
    'express-validator',
    'reflect-metadata'
  ]
});
