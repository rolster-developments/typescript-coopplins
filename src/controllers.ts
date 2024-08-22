import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response, Router } from 'express';
import {
  createService,
  createHttpArguments,
  createMiddleware,
  createMiddlewares,
  createRoute
} from './factories';
import { requestController, requestRoutes } from './stores';
import { ClousureToken, MiddlewareToken } from './types';

type Controller = Record<string | symbol, Function>;
type Resolver = (request: Request, response: Response) => Promise<any>;

interface ControllersOptions {
  controllers: Function[];
  server: Express;
  clousures?: ClousureToken[];
  error?: (err: any) => void;
}

interface ControllerOptions {
  controller: Controller;
  key: string | symbol;
  clousures?: ClousureToken[];
  error?: (ex: any) => void;
}

function createRouter(middlewares: MiddlewareToken[]): Router {
  const router = express.Router({ mergeParams: true });

  for (const middleware of middlewares) {
    createMiddleware(middleware).present((call) => {
      router.use(call);
    });
  }

  return router;
}

function createController(options: ControllerOptions): Resolver {
  const { clousures, controller, error, key } = options;

  return createService({
    service: (request: Request, response: Response) => {
      const resolver = controller[key].bind(controller);

      const args = createHttpArguments(controller, key, request);

      return resolver(...[...args, request, response]);
    },
    clousures,
    handleError: error
  });
}

export function registerControllers(options: ControllersOptions): void {
  const { clousures, controllers, error, server } = options;

  for (const token of controllers) {
    requestController(token).present(({ basePath, middlewares }) => {
      const controller = createFromInvertly<Controller>({ config: { token } });

      const routesOptions = requestRoutes(token);
      const router = createRouter(middlewares);

      for (const routeOptions of routesOptions) {
        const { http, middlewares, key, path } = routeOptions;

        const route = createRoute(router, http);

        route(path, [
          ...createMiddlewares(middlewares),
          createController({ controller, key, clousures, error })
        ]);
      }

      server.use(basePath, router); // Register in server
    });
  }
}
