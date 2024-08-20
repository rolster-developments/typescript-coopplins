import { Optional } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { NextFunction, Request, Response } from 'express';
import { itIsExistsMiddleware } from '../stores';
import { MiddlewareRoute, MiddlewareToken, OnMiddleware } from '../types';

function itIsOnMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['execute'] === 'function';
}

export function createMiddleware(
  token: MiddlewareToken
): Optional<MiddlewareRoute> {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!itIsExistsMiddleware(token)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      token(req, res, next)
    );
  }

  const middleware = createFromInvertly({ config: { token } });

  return itIsOnMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.execute(req, res, next);
      })
    : Optional.empty();
}

export function createMiddlewares(
  tokens: MiddlewareToken[]
): MiddlewareRoute[] {
  return tokens.reduce((middlewares: MiddlewareRoute[], middleware) => {
    createMiddleware(middleware).present((call) => {
      middlewares.push(call);
    });

    return middlewares;
  }, []);
}
