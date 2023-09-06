import createFromInvertly from '@rolster/typescript-invertly';
import { Optional } from '@rolster/typescript-utils';
import { NextFunction, Request, Response } from 'express';
import { middlewares } from '../stores';
import { MiddlewareRoute, MiddlewareToken, OnMiddleware } from '../types';

export function createMiddlewares(collection: MiddlewareToken[]): MiddlewareRoute[] {
  return collection.reduce((middlewares: MiddlewareRoute[], middleware) => {
    createMiddleware(middleware).present((call) => middlewares.push(call));

    return middlewares;
  }, []);
}

export function createMiddleware(token: MiddlewareToken): Optional<MiddlewareRoute> {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!middlewares.has(token)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      token(req, res, next)
    );
  }

  const middleware = createFromInvertly({ config: { token } });

  return isMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.execute(req, res, next);
      })
    : Optional.empty();
}

function isMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['execute'] === 'function';
}