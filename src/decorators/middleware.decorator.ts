import { registerInjectable } from '@rolster/typescript-invertly';
import { middlewares } from '../stores';

export function Middleware(): ClassDecorator {
  return (token) => {
    middlewares.push(token);

    registerInjectable({
      config: {
        scopeable: false,
        singleton: true,
        token
      }
    });
  };
}
