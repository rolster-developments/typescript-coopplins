import { Router } from 'express';
import { HttpMethod } from '../enums';

export function createRoute(router: Router, http: HttpMethod): Function {
  return router[http].bind(router);
}
