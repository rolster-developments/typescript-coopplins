import { registerInjectable } from '@rolster/invertly';
import { middlewares } from '../stores';

interface MiddlewareProps {
  scopeable: boolean;
  singleton: boolean;
}

const DEFAULT_PROPS: MiddlewareProps = {
  scopeable: false,
  singleton: true
};

export const Middleware = (props: Partial<MiddlewareProps>): ClassDecorator => {
  return (token) => {
    middlewares.push(token);

    const { scopeable, singleton } = { ...DEFAULT_PROPS, ...props };

    registerInjectable({
      config: { scopeable, singleton, token }
    });
  };
};
