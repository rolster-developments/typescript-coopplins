import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response } from 'express';
import { getContextFromRequest } from './context';
import {
  createHttpArguments,
  createRoute,
  createMiddlewares,
  createService
} from './factories';
import { requestLambda } from './stores';
import { ClousureToken } from './types';

type RouteCallback = (request: Request, response: Response) => Promise<any>;

interface LambdasOptions {
  lambdas: Function[];
  server: Express;
  catchError?: (error: any) => void;
  clousures?: ClousureToken[];
}

interface LambdaOptions {
  token: Function;
  catchError?: (error: any) => void;
  clousures?: ClousureToken[];
}

function createLambda(options: LambdaOptions): RouteCallback {
  const { token, catchError, clousures } = options;

  return createService({
    service: (request: Request, response: Response) => {
      const lambda = createFromInvertly<any>({
        context: getContextFromRequest(request),
        token
      });

      if (typeof lambda.execute !== 'function') {
        return Promise.resolve();
      }

      const resolver = lambda.execute.bind(lambda);
      const args = createHttpArguments(lambda, 'execute', request);

      return resolver(...[...args, request, response]);
    },
    clousures,
    catchError
  });
}

export function registerLambdas(options: LambdasOptions): void {
  const { lambdas, server, catchError, clousures } = options;

  for (const token of lambdas) {
    requestLambda(token).present((options) => {
      const { http, middlewares, path } = options;

      const router = express.Router({ mergeParams: true });

      const route = createRoute(router, http);

      route('/', [
        ...createMiddlewares(middlewares),
        createLambda({ token, clousures, catchError })
      ]);

      server.use(path, router); // Register in server
    });
  }
}
