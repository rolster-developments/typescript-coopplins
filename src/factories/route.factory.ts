import { Router } from 'express';

import { HttpMethod } from '../enums';

export function routeAPI(router: Router, method: HttpMethod): Function {
  return router[method].bind(router);
}
