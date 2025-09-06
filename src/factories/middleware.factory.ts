import { Optional } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { NextFunction, Request, Response } from 'express';
import { isDefinedMiddleware } from '../stores/middlerare.store';
import { MiddlewareRoute, MiddlewareToken, OnMiddleware } from '../types';

function isOnMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['onMiddleware'] === 'function';
}

type Route = Optional<MiddlewareRoute>;
type Routes = MiddlewareRoute[];

export function createMiddleware(token: MiddlewareToken): Route {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!isDefinedMiddleware(token)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      token(req, res, next)
    );
  }

  const middleware = createFromInvertly({ token });

  return isOnMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.onMiddleware(req, res, next);
      })
    : Optional.empty();
}

export function createMiddlewares(tokens: MiddlewareToken[]): Routes {
  return tokens.reduce((middlewares: Routes, middleware) => {
    const optional = createMiddleware(middleware);

    optional.isPresent() && middlewares.push(optional.get());

    return middlewares;
  }, []);
}
