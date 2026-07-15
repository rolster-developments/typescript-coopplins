import { createFromInvertly } from '@rolster/invertly';
import express, { Express, Request, Response, Router } from 'express';

import { createHttpArguments } from './factories/argument.factory';
import {
  createMiddleware,
  createMiddlewares
} from './factories/middleware.factory';
import { createRoute } from './factories/route.factory';
import { createService } from './factories/service.factory';
import { requestController } from './stores/controller.store';
import { requestRoutes } from './stores/route.store';
import { CatchError, ClousureToken, MiddlewareToken } from './types';

type Controller = Record<string | symbol, Function>;
type Resolver = (request: Request, response: Response) => Promise<any>;

interface ControllersOptions {
  controllers: Function[];
  server: Express;
  catchError?: CatchError;
  clousures?: ClousureToken[];
}

interface ControllerOptions {
  controller: Controller;
  key: string | symbol;
  catchError?: CatchError;
  clousures?: ClousureToken[];
  statusCode?: number;
}

function createRouter(middlewares: MiddlewareToken[]): Router {
  const router = express.Router({ mergeParams: true });

  for (const middleware of middlewares) {
    const optional = createMiddleware(middleware);

    if (optional.isPresent()) {
      router.use(optional.get());
    }
  }

  return router;
}

function createController(options: ControllerOptions): Resolver {
  const { controller, key, catchError, clousures, statusCode } = options;

  return createService({
    service: (request: Request, response: Response) => {
      const resolver = controller[key].bind(controller);

      const args = createHttpArguments(controller, key, request);

      return resolver(...[...args, request, response]);
    },
    clousures,
    catchError,
    statusCode
  });
}

export function registerControllers(options: ControllersOptions): void {
  const { controllers, server, catchError, clousures } = options;

  for (const token of controllers) {
    requestController(token).present(({ basePath, middlewares }) => {
      const controller = createFromInvertly<Controller>({ token });

      const routesOptions = requestRoutes(token);
      const router = createRouter(middlewares);

      for (const routeOptions of routesOptions) {
        const { http, middlewares, key, path, statusCode } = routeOptions;

        const route = createRoute(router, http);

        route(path, [
          ...createMiddlewares(middlewares),
          createController({
            controller,
            key,
            clousures,
            catchError,
            statusCode
          })
        ]);
      }

      server.use(basePath, router); // Register in server
    });
  }
}
