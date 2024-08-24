import { registerInjectable } from '@rolster/invertly';
import { registerController } from '../stores';
import { MiddlewareToken } from '../types';

export function Controller(
  basePath = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return (token) => {
    registerController(token, { basePath, middlewares });

    registerInjectable({
      scopeable: false,
      singleton: true,
      token
    });
  };
}
