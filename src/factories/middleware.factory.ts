import { Optional } from '@rolster/commons';
import { createFromInvertly } from '@rolster/invertly';
import { NextFunction, Request, Response } from 'express';

import { existsMiddleware } from '../stores/middlerare.store';
import { Middleware, MiddlewareRoute, MiddlewareToken } from '../types';

function valueIsMiddleware(value: any): value is Middleware {
  return typeof value['middleware'] === 'function';
}

type Route = Optional<MiddlewareRoute>;
type Routes = MiddlewareRoute[];

export function createMiddleware(token: MiddlewareToken): Route {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!existsMiddleware(token)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      token(req, res, next)
    );
  }

  const middleware = createFromInvertly({ token });

  return valueIsMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.middleware(req, res, next);
      })
    : Optional.empty();
}

export function createMiddlewares(tokens: MiddlewareToken[]): Routes {
  return tokens.reduce((middlewares: Routes, token) => {
    const middleware = createMiddleware(token);

    if (middleware.isPresent()) {
      middlewares.push(middleware.get());
    }

    return middlewares;
  }, []);
}
