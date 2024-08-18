import { registerInjectable } from '@rolster/invertly';
import { middlewaresStore } from '../stores';

interface MiddlewareOptions {
  scopeable: boolean;
  singleton: boolean;
}

export function Middleware(
  options: Partial<MiddlewareOptions>
): ClassDecorator {
  return (token) => {
    middlewaresStore.push(token);

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
