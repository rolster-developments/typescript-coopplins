import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response } from 'express';
import {
  createHttpArguments,
  createRoute,
  createMiddlewares,
  createAPIService
} from './factories';
import { lambdasStore } from './stores';
import { requestContext } from './types';

type RouteCallback = (request: Request, response: Response) => Promise<any>;

interface LambdaOptions {
  lambdas: Function[];
  server: Express;
  error?: (error: unknown) => void;
}

interface LambdaCallback {
  token: Function;
  error?: (error: unknown) => void;
}

function createCallback(config: LambdaCallback): RouteCallback {
  const { token, error } = config;

  return createAPIService((request: Request, response: Response) => {
    const lambda = createFromInvertly<any>({
      config: {
        context: requestContext(request),
        token
      }
    });

    if (typeof lambda.execute !== 'function') {
      return Promise.resolve();
    }

    const resolver = lambda.execute.bind(lambda);
    const args = createHttpArguments(lambda, 'execute', request);

    return resolver(...[...args, request, response]);
  }, error);
}

export function registerLambdas(options: LambdaOptions): void {
  const { lambdas, error, server } = options;

  for (const token of lambdas) {
    lambdasStore.request(token).present((options) => {
      const { http, middlewares, path } = options;

      const router = express.Router({ mergeParams: true });

      const routeLambda = createRoute(router, http);

      routeLambda('/', [
        ...createMiddlewares(middlewares),
        createCallback({ token, error })
      ]);

      server.use(path, router); // Register in server
    });
  }
}
