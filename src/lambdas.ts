import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response } from 'express';
import { contextOfRequest } from './context';
import { createHttpArguments } from './factories/argument.factory';
import { createMiddlewares } from './factories/middleware.factory';
import { createRoute } from './factories/route.factory';
import { createService } from './factories/service.factory';
import { requestLambda } from './stores/lambda.store';
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
  statusCode?: number;
}

function createLambda(options: LambdaOptions): RouteCallback {
  const { token, catchError, clousures, statusCode } = options;

  return createService({
    service: (request: Request, response: Response) => {
      const lambda = createFromInvertly({
        context: contextOfRequest(request),
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
    catchError,
    statusCode
  });
}

export function registerLambdas(options: LambdasOptions): void {
  const { lambdas, server, catchError, clousures } = options;

  for (const token of lambdas) {
    requestLambda(token).present((options) => {
      const { http, middlewares, path, statusCode } = options;

      const router = express.Router({ mergeParams: true });

      const route = createRoute(router, http);

      route('/', [
        ...createMiddlewares(middlewares),
        createLambda({ token, clousures, catchError, statusCode })
      ]);

      server.use(path, router); // Register in server
    });
  }
}
