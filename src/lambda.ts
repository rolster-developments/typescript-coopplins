import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response } from 'express';
import {
  createHttpArguments,
  createRoute,
  createMiddlewares,
  createAPIService
} from './factories';
import { lambdas } from './stores';
import { fetchContext } from './types';

type RouteCallback = (request: Request, response: Response) => Promise<any>;

type Config = {
  collection: Function[];
  server: Express;
  error?: (error: unknown) => void;
};

type LambdaCallback = {
  token: Function;
  error?: (error: unknown) => void;
};

export function registerLambdas({ collection, error, server }: Config): void {
  for (const token of collection) {
    lambdas.fetch(token).present(({ http, middlewares, path }) => {
      const router = express.Router({ mergeParams: true });

      const httpLambda = createRoute(router, http);
      const middleraresLambda = createMiddlewares(middlewares);
      const callLambda = createCallback({ token, error });

      httpLambda('/', [...middleraresLambda, callLambda]);

      server.use(path, router);
    });
  }
}

function createCallback(config: LambdaCallback): RouteCallback {
  const { token, error } = config;

  return createAPIService((request: Request, response: Response) => {
    const object = createFromInvertly<any>({
      config: { token, context: fetchContext(request) }
    });

    if (typeof object.execute !== 'function') {
      return Promise.resolve();
    }

    const resolver = object.execute.bind(object);

    const args = createHttpArguments({ object, key: 'execute', request });

    return resolver(...[...args, request, response]);
  }, error);
}
