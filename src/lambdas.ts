import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response } from 'express';
import { getContext } from './context';
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
  clousures?: ClousureToken[];
  error?: (error: unknown) => void;
}

interface LambdaOptions {
  token: Function;
  clousures?: ClousureToken[];
  error?: (error: unknown) => void;
}

function createLambda(options: LambdaOptions): RouteCallback {
  const { token, clousures, error } = options;

  return createService({
    service: (request: Request, response: Response) => {
      const lambda = createFromInvertly<any>({
        config: {
          context: getContext(request),
          token
        }
      });

      if (typeof lambda.execute !== 'function') {
        return Promise.resolve();
      }

      const resolver = lambda.execute.bind(lambda);
      const args = createHttpArguments(lambda, 'execute', request);

      return resolver(...[...args, request, response]);
    },
    clousures,
    handleError: error
  });
}

export function registerLambdas(options: LambdasOptions): void {
  const { lambdas, clousures, error, server } = options;

  for (const token of lambdas) {
    requestLambda(token).present((options) => {
      const { http, middlewares, path } = options;

      const router = express.Router({ mergeParams: true });

      const route = createRoute(router, http);

      route('/', [
        ...createMiddlewares(middlewares),
        createLambda({ token, clousures, error })
      ]);

      server.use(path, router); // Register in server
    });
  }
}
