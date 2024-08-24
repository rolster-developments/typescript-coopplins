import { Optional } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { NextFunction, Request, Response } from 'express';
import { itIsExistsMiddleware } from '../stores';
import { MiddlewareRoute, MiddlewareToken, OnMiddleware } from '../types';

function itIsOnMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['onMiddleware'] === 'function';
}

type Route = Optional<MiddlewareRoute>;
type Routes = MiddlewareRoute[];

export function createMiddleware(token: MiddlewareToken): Route {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!itIsExistsMiddleware(token)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      token(req, res, next)
    );
  }

  const middleware = createFromInvertly({ token });

  return itIsOnMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.onMiddleware(req, res, next);
      })
    : Optional.empty();
}

export function createMiddlewares(tokens: MiddlewareToken[]): Routes {
  return tokens.reduce((middlewares: Routes, middleware) => {
    createMiddleware(middleware).present((call) => {
      middlewares.push(call);
    });

    return middlewares;
  }, []);
}
