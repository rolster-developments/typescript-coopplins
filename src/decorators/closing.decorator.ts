import { registerInjectable } from '@rolster/invertly';
import { registerClousure } from '../stores/clousure.store';

interface ClousureOptions {
  scopeable?: boolean;
  singleton?: boolean;
}

export function Clousure(options?: ClousureOptions): ClassDecorator {
  return (token) => {
    registerClousure(token);

    registerInjectable({
      scopeable: !!options?.scopeable,
      singleton: !!options?.singleton,
      token
    });
  };
}
