import { registerInjectable } from '@rolster/invertly';
import { registerClousure } from '../stores';

interface ClousureOptions {
  scopeable: boolean;
  singleton: boolean;
}

export function Clousure(options: Partial<ClousureOptions>): ClassDecorator {
  return (token) => {
    registerClousure(token);

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
