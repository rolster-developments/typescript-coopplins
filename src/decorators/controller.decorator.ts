import { registerInjectable } from '@rolster/invertly';
import { controllers } from '../stores';
import { MiddlewareToken } from '../types';

type Tokens = MiddlewareToken[];

export const Controller = (
  basePath = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return (token) => {
    controllers.push(token, { basePath, middlewares });

    registerInjectable({
      config: {
        scopeable: false,
        singleton: true,
        token
      }
    });
  };
};
