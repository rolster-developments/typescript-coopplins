import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response } from 'express';
import { getContext } from './context';
import {
  createHttpArguments,
  createRoute,
  createMiddlewares,
  createAPIService
} from './factories';
import { requestLambda } from './stores';

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

  return createAPIService({
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
    handleError: error
  });
}

export function registerLambdas(options: LambdaOptions): void {
  const { lambdas, error, server } = options;

  for (const token of lambdas) {
    requestLambda(token).present((options) => {
      const { http, middlewares, path } = options;

      const router = express.Router({ mergeParams: true });

      const route = createRoute(router, http);

      route('/', [
        ...createMiddlewares(middlewares),
        createCallback({ token, error })
      ]);

      server.use(path, router); // Register in server
    });
  }
}
