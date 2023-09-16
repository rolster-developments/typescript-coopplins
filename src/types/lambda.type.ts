import { Http } from './http.type';
import { MiddlewareToken } from './middleware.type';

export type LambdaProps = {
  http: Http;
  middlewares: MiddlewareToken[];
  path: string;
};
