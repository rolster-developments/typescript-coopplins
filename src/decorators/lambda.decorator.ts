import { registerInjectable } from '@rolster/invertly';
import { lambdas } from '../stores';
import { Http, LambdaProps, MiddlewareToken } from '../types';

type Tokens = MiddlewareToken[];

const createLambda = (props: LambdaProps): ClassDecorator => {
  return (token) => {
    lambdas.push(token, props);

    registerInjectable({
      config: {
        scopeable: true,
        singleton: false,
        token
      }
    });
  };
};

export const LambdaPost = (
  path = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return createLambda({ path, middlewares, http: Http.Post });
};

export const LambdaGet = (
  path = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return createLambda({ path, middlewares, http: Http.Get });
};

export const LambdaPut = (
  path = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return createLambda({ path, middlewares, http: Http.Put });
};

export const LambdaDelete = (
  path = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return createLambda({ path, middlewares, http: Http.Delete });
};

export const LambdaPatch = (
  path = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return createLambda({ path, middlewares, http: Http.Patch });
};

export const LambdaOptions = (
  path = '/',
  middlewares: Tokens = []
): ClassDecorator => {
  return createLambda({ path, middlewares, http: Http.Options });
};
