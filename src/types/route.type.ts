import { HttpMethod } from '../enums';
import { MiddlewareToken } from './middleware.type';

export type RouteOptions = {
  http: HttpMethod;
  key: string | symbol;
  middlewares: MiddlewareToken[];
  path: string;
};
