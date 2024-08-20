import { registerInjectable } from '@rolster/invertly';
import { registerMiddleware } from '../stores';

interface MiddlewareOptions {
  scopeable: boolean;
  singleton: boolean;
}

export function Middleware(
  options: Partial<MiddlewareOptions>
): ClassDecorator {
  return (token) => {
    registerMiddleware(token);

    const { scopeable, singleton } = {
      scopeable: false,
      singleton: true,
      ...options
    };

    registerInjectable({
      config: { scopeable, singleton, token }
    });
  };
}
