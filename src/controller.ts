import createFromInvertly from '@rolster/invertly';
import express, { Express, Request, Response, Router } from 'express';
import {
  createHttpArguments,
  createRoute,
  createMiddleware,
  createMiddlewares,
  createAPIService
} from './factories';
import { controllers, routes } from './stores';
import { MiddlewareToken } from './types';

type Controller = Record<string | symbol, Function>;
type FnResolver = (request: Request, response: Response) => Promise<any>;

interface ControllersProps {
  collection: Function[];
  server: Express;
  error?: (err: unknown) => void;
}

interface ControllerProps {
  controller: Controller;
  key: string | symbol;
  error?: (ex: unknown) => void;
}

const createRouter = (middlewares: MiddlewareToken[]): Router => {
  const router = express.Router({ mergeParams: true });

  for (const middleware of middlewares) {
    createMiddleware(middleware).present((call) => router.use(call));
  }

  return router;
};

const createResolver = (props: ControllerProps): FnResolver => {
  const { controller, error, key } = props;

  return createAPIService((request: Request, response: Response) => {
    const resolver = controller[key].bind(controller);

    const args = createHttpArguments({ object: controller, key, request });

    return resolver(...[...args, request, response]);
  }, error);
};

export const registerControllers = (props: ControllersProps): void => {
  const { collection, error, server } = props;

  for (const token of collection) {
    controllers.fetch(token).present(({ basePath, middlewares }) => {
      const controller = createFromInvertly<Controller>({ config: { token } });

      const router = createRouter(middlewares);
      const configs = routes.fetch(token);

      for (const { http, middlewares, key, path } of configs) {
        const routeMiddlewares = createMiddlewares(middlewares);

        const route = createRoute(router, http);

        const resolver = createResolver({ controller, key, error });

        route(path, [...routeMiddlewares, resolver]);
      }

      server.use(basePath, router);
    });
  }
};
