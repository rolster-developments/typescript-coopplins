import { registerInjectable } from '@rolster/typescript-invertly';
import { controllers } from '../stores';
import { MiddlewareToken } from '../types';

export function Controller(
  basePath = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
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
}
