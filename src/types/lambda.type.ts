import { HttpMethod } from '../enums';
import { MiddlewareToken } from './middleware.type';

export interface LambdaOptions {
  http: HttpMethod;
  middlewares: MiddlewareToken[];
  path: string;
}
