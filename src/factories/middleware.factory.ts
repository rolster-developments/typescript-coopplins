import { Optional } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { NextFunction, Request, Response } from 'express';
import { middlewaresStore } from '../stores';
import { MiddlewareRoute, MiddlewareToken, OnMiddleware } from '../types';

const isMiddleware = (middleware: any): middleware is OnMiddleware => {
  return typeof middleware['execute'] === 'function';
};

export const createMiddlewares = (
  tokens: MiddlewareToken[]
): MiddlewareRoute[] => {
  return tokens.reduce((middlewares, middleware) => {
    createMiddleware(middleware).present((call) => middlewares.push(call));

    return middlewares;
  }, [] as MiddlewareRoute[]);
};

export const createMiddleware = (
  token: MiddlewareToken
): Optional<MiddlewareRoute> => {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!middlewaresStore.has(token)) {
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
};
