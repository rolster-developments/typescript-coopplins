import { registerInjectable } from '@rolster/invertly';
import { registerMiddleware } from '../stores';

interface MiddlewareOptions {
  scopeable?: boolean;
  singleton?: boolean;
}

export function Middleware(options?: MiddlewareOptions): ClassDecorator {
  return (token) => {
    registerMiddleware(token);

    registerInjectable({
      scopeable: !!options?.scopeable,
      singleton: !!options?.singleton,
      token
    });
  };
}
