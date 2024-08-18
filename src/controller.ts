import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response, Router } from 'express';
import {
  createHttpArguments,
  createRoute,
  createMiddleware,
  createMiddlewares,
  createAPIService
} from './factories';
import { controllersStore, routesStore } from './stores';
import { MiddlewareToken } from './types';

type Controller = Record<string | symbol, Function>;
type Resolver = (request: Request, response: Response) => Promise<any>;

interface ControllersOptions {
  controllers: Function[];
  server: Express;
  error?: (err: unknown) => void;
}

interface ControllerOptions {
  controller: Controller;
  key: string | symbol;
  error?: (ex: unknown) => void;
}

function createRouter(middlewares: MiddlewareToken[]): Router {
  const router = express.Router({ mergeParams: true });

  for (const middleware of middlewares) {
    createMiddleware(middleware).present((call) => router.use(call));
  }

  return router;
}

function createResolver(options: ControllerOptions): Resolver {
  const { controller, error, key } = options;

  return createAPIService((request: Request, response: Response) => {
    const resolver = controller[key].bind(controller);

    const args = createHttpArguments(controller, key, request);

    return resolver(...[...args, request, response]);
  }, error);
}

export function registerControllers(options: ControllersOptions): void {
  const { controllers, error, server } = options;

  for (const token of controllers) {
    controllersStore.request(token).present(({ basePath, middlewares }) => {
      const controller = createFromInvertly<Controller>({ config: { token } });

      const configurations = routesStore.request(token);
      const router = createRouter(middlewares);

      for (const configuration of configurations) {
        const { http, middlewares, key, path } = configuration;

        const routeMiddlewares = createMiddlewares(middlewares);

        const route = createRoute(router, http);

        const resolver = createResolver({ controller, key, error });

        route(path, [...routeMiddlewares, resolver]);
      }

      server.use(basePath, router); // Register in server
    });
  }
}
