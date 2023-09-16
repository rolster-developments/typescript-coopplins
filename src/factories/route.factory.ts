import { Router } from 'express';
import { Http } from '../types';

export const createRoute = (router: Router, http: Http): Function => {
  return router[http].bind(router);
};
