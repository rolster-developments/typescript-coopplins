import { registerInjectable } from '@rolster/invertly';
import { controllersStore } from '../stores';
import { MiddlewareToken } from '../types';

type Tokens = MiddlewareToken[];

export function Controller(
  basePath = '/',
  middlewares: Tokens = []
): ClassDecorator {
  return (token) => {
    controllersStore.push(token, { basePath, middlewares });

    registerInjectable({
      config: {
        scopeable: false,
        singleton: true,
        token
      }
    });
  };
}
