import { registerInjectable } from '@rolster/invertly';
import { registerController } from '../stores';
import { MiddlewareToken } from '../types';

type Tokens = MiddlewareToken[];

export function Controller(
  basePath = '/',
  middlewares: Tokens = []
): ClassDecorator {
  return (token) => {
    registerController(token, { basePath, middlewares });

    registerInjectable({
      config: {
        scopeable: false,
        singleton: true,
        token
      }
    });
  };
}
